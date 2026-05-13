type ShellBrandLogoProps = {
  className?: string;
};

export function ShellBrandLogo({ className = '' }: ShellBrandLogoProps) {
  return (
    <div className={`flex min-w-0 items-start md:h-full md:w-full ${className}`}>
      <img
        src="/branding/lineage-reforged-logo-dark-no-icon-framed.png"
        alt="Lineage: Reforged"
        className="block h-11 w-auto object-contain object-top sm:h-12 md:h-full md:w-full md:object-contain"
      />
    </div>
  );
}
