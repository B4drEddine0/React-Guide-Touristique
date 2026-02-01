function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-card">
      <div className="skeleton h-56 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-10 w-32 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default SkeletonCard;
