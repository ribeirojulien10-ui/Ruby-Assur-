type IconProps = { size?: number; className?: string };

const base = (size: number, className: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export const Shield = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
  </svg>
);

export const ShieldCheck = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const Heart = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
  </svg>
);

export const HeartPulse = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M19 14c1.5-1.5 2-3 2-5a4 4 0 00-7-2.6A4 4 0 003 7c0 2 .5 3.5 2 5l7 7 7-7z" />
  </svg>
);

export const Users = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0112 0M16 11a3 3 0 100-6M19 20a5.5 5.5 0 00-3.5-5" />
  </svg>
);

export const Handshake = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M9 11l3 3 8-8" />
    <path d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h11" />
  </svg>
);

export const Car = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M5 13l1.5-4.5A2 2 0 018.4 7h7.2a2 2 0 011.9 1.5L19 13M5 13h14v4H5zM7 17v2M17 17v2" />
  </svg>
);

export const House = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 11l9-7 9 7M5 10v9h14v-9" />
  </svg>
);

export const Clock = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 3a9 9 0 109 9M12 3v9l6 3" />
  </svg>
);

export const Doc = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 7h18v12H3zM3 11h18M7 15h4" />
  </svg>
);

export const Coins = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9 9.5c0-1.4 1.3-2 3-2s3 .6 3 2-1.5 1.8-3 2-3 .6-3 2 1.3 2 3 2 3-.6 3-2" />
  </svg>
);

export const Briefcase = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 7h16v13H4zM9 7V4h6v3M9 13h6" />
  </svg>
);

export const Building = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
  </svg>
);

export const Pin = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 21s-7-4.5-7-10a7 7 0 0114 0c0 5.5-7 10-7 10z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);

export const Mail = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

export const Phone = ({ size = 24, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.8a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
  </svg>
);

export const Arrow = ({ size = 16, className = "" }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Person = ({ size = 22, className = "" }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20a7 7 0 0114 0" />
  </svg>
);
