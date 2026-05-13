type ShellBrandLogoProps = {
  className?: string;
};

export function ShellBrandLogo({ className = '' }: ShellBrandLogoProps) {
  return (
    <div className={`flex min-w-0 items-center md:h-full md:w-full ${className}`}>
      <img
        src="/branding/lineage-reforged-logo-dark.png"
        alt="Lineage: Reforged"
        className="block h-11 w-auto object-contain sm:h-12 md:h-full md:w-full md:object-cover"
      />
    </div>
  );
}
