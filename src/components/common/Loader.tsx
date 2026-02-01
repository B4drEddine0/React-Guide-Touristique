interface LoaderProps {
  text?: string;
}

function Loader({ text = 'Chargement...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16" role="status" aria-live="polite">
      <div className="relative w-12 h-12">
        <span className="absolute inset-0 rounded-full border-[3px] border-ocean-100" />
        <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-ocean-500 animate-spin-slow" />
      </div>
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

export default Loader;
