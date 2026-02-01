interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center justify-center flex-wrap gap-2 pt-10" aria-label="Pagination des lieux">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
      >
        ← Précédent
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`min-w-[44px] px-3 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
            page === currentPage
              ? 'bg-gradient-ocean text-white border-transparent shadow-card'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-ocean-50 hover:text-ocean-600 hover:border-ocean-200'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
      >
        Suivant →
      </button>
    </nav>
  );
}

export default Pagination;
