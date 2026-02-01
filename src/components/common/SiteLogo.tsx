function SiteLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <img
      src="/tourist-logo.png"
      alt="Afayi"
      className={`${className} object-contain`}
    />
  );
}

export default SiteLogo;
