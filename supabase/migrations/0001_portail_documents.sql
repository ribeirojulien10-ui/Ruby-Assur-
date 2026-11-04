-- ============================================================================
-- Portail documentaire Ruby Assur' — schéma PostgreSQL (Supabase)
-- ⚠️ PRÉPARÉ MAIS JAMAIS EXÉCUTÉ : aucun projet Supabase n'est créé ni connecté.
-- Il reflète le schéma SQLite utilisé en local (lib/portal/db.ts). À relire et à
-- tester sur un projet de développement AVANT toute utilisation.
--
-- Principe de sécurité : RLS activée sur TOUTES les tables et AUCUNE politique pour les rôles
-- `anon` / `authenticated` => aucun accès direct depuis le navigateur. Seul le serveur Next.js
-- (clé « service role », jamais exposée au client) lit et écrit, après avoir vérifié le jeton du lien
-- (client) ou la session de Julien (espace pro).
-- ============================================================================

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  insurance_slug text not null,
  name text not null,
  description text,
  instructions text,
  questions jsonb not null default '[]',
  is_default boolean not null default false,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references templates(id) on delete cascade,
  label text not null,
  instructions text,
  required boolean not null default true,
  sort int not null default 0,
  allowed_formats text not null,
  max_mb int,
  condition_question text,
  condition_equals text check (condition_equals in ('yes','no'))
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  insurance_slug text not null,
  title text not null,
  instructions text,
  questions jsonb not null default '[]',
  answers jsonb not null default '{}',
  token_hash text unique,          -- SHA-256 du jeton : jamais le jeton en clair
  token_enc text,                  -- jeton chiffré (AES-GCM) pour que Julien puisse recopier le lien
  token_issued_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  submitted_at timestamptz,
  completed_notified_at timestamptz,
  closed_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create table if not exists request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  label text not null,
  instructions text,
  required boolean not null default true,
  sort int not null default 0,
  allowed_formats text not null,
  max_bytes bigint not null,
  condition_question text,
  condition_equals text check (condition_equals in ('yes','no')),
  state text not null default 'to_provide' check (state in ('to_provide','received','to_replace','validated')),
  reject_reason text,
  reject_note text,
  reviewed_at timestamptz,
  validated_at timestamptz
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  item_id uuid not null references request_items(id) on delete cascade,
  storage_key text not null unique,   -- clé d'objet aléatoire dans le bucket PRIVÉ (aucun nom de client)
  original_name text not null,
  size bigint not null,
  detected_type text not null,
  sha256 text not null,
  scan_status text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  request_id uuid not null references requests(id) on delete cascade,
  item_id uuid not null references request_items(id) on delete cascade,
  file_name text not null,
  declared_size bigint not null,
  received_size bigint,
  received_sha256 text,
  expires_at timestamptz not null,
  received_at timestamptz,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  item_id uuid,
  actor text not null check (actor in ('julien','client','system')),
  type text not null,
  meta jsonb not null default '{}',   -- jamais de contenu de document ni de donnée sensible
  created_at timestamptz not null default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  channel text not null,
  missing_count int not null,
  created_at timestamptz not null default now()
);

create table if not exists outbox (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  request_ref uuid not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  error text
);

-- Trace minimale conservée après suppression d'un dossier (aucune donnée personnelle).
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  request_ref uuid
);

create index if not exists idx_requests_client on requests(client_id);
create index if not exists idx_items_request on request_items(request_id);
create index if not exists idx_files_item on files(item_id);
create index if not exists idx_events_request on events(request_id, created_at);
create index if not exists idx_uploads_request on uploads(request_id);

-- RLS : tout est refusé aux rôles anon/authenticated (aucune politique). Le serveur utilise la clé service role.
alter table clients        enable row level security;
alter table templates      enable row level security;
alter table template_items enable row level security;
alter table requests       enable row level security;
alter table request_items  enable row level security;
alter table files          enable row level security;
alter table uploads        enable row level security;
alter table events         enable row level security;
alter table reminders      enable row level security;
alter table outbox         enable row level security;
alter table audit_log      enable row level security;

-- Stockage : bucket PRIVÉ (public = false), sans aucune politique d'accès public.
-- Les téléversements passent par des URL signées à usage unique émises par le serveur (createSignedUploadUrl),
-- les téléchargements par des URL signées courtes émises uniquement après vérification de la session de Julien.
insert into storage.buckets (id, name, public, file_size_limit)
values ('portal-documents', 'portal-documents', false, 15 * 1024 * 1024)
on conflict (id) do update set public = false;
