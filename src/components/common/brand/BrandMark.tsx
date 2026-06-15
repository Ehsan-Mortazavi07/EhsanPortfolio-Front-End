type Props = {
  className?: string;
  size?: number;
};

/** Geometric mark inspired by the mockup logo (three petals). */
export function BrandMark({ className, size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 4C12 10 10 16 16 22C22 16 20 10 16 4Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M6 14C10 16 14 18 16 24C14 18 10 14 6 14Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M26 14C22 16 18 18 16 24C18 18 22 14 26 14Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
