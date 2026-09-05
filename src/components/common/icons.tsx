import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.6-3.6 4.4-5.4 7.5-5.4s5.9 1.8 7.5 5.4" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 20.2s-7.6-4.6-9.8-9.2C.8 7.4 2.6 4 6.2 4c2.1 0 3.6 1.1 4.8 2.7C12.2 5.1 13.7 4 15.8 4c3.6 0 5.4 3.4 4 7-2.2 4.6-9.8 9.2-9.8 9.2Z" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 8.5h11l1 12.5h-13z" />
      <path d="M9 8.5v-2a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export function StarIcon({ half, ...props }: IconProps & { half?: boolean }) {
  const id = "star-half-clip";
  return (
    <svg {...base} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      {half && (
        <clipPath id={id}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      )}
      <path
        clipPath={half ? `url(#${id})` : undefined}
        d="m12 3 2.7 5.9 6.3.7-4.7 4.4 1.2 6.3L12 17.3 6.5 20.3l1.2-6.3-4.7-4.4 6.3-.7Z"
      />
      {half && (
        <path
          d="m12 3 2.7 5.9 6.3.7-4.7 4.4 1.2 6.3L12 17.3 6.5 20.3l1.2-6.3-4.7-4.4 6.3-.7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      )}
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3.5c.5 2.2 2 3.6 4.3 3.8v2.6c-1.6.1-3-.4-4.3-1.3v6.6a5 5 0 1 1-4.2-5v2.7a2.3 2.3 0 1 0 1.8 2.3V3.5Z" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.4 17.6 4 20l2.5-2.3A8 8 0 1 1 12 20a8 8 0 0 1-5.6-2.4Z" />
      <path d="M9 9.6c0 3 2.4 5.4 5.4 5.4.5 0 .9-.4.9-1v-1a.7.7 0 0 0-.5-.6l-1.6-.5a.7.7 0 0 0-.7.2l-.4.5a4.6 4.6 0 0 1-2.1-2.1l.5-.4a.7.7 0 0 0 .2-.7l-.5-1.6A.7.7 0 0 0 9.6 7h-1c-.6 0-1 .4-1 .9" />
    </svg>
  );
}
