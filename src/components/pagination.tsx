// ABOUTME: Pagination component with page numbers and navigation controls
// ABOUTME: Supports URL-based navigation and responsive design

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  basePath: string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  basePath,
}: PaginationProps) {
  const generatePageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    const separator = basePath.includes('?') ? '&' : '?';
    return `${basePath}${separator}page=${page}`;
  };

  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center space-x-2" aria-label="Pagination">
      {/* Previous Button */}
      {hasPreviousPage ? (
        <Link
          href={generatePageUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-brand-sage transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {currentPage > 3 && (
          <>
            <Link
              href={generatePageUrl(1)}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-brand-sage transition-colors"
            >
              1
            </Link>
            {currentPage > 4 && (
              <span className="px-3 py-2 text-gray-400">...</span>
            )}
          </>
        )}

        {getVisiblePages().map((page) => (
          <Link
            key={page}
            href={generatePageUrl(page)}
            className={`px-3 py-2 border rounded-md transition-colors ${
              page === currentPage
                ? 'border-brand-terracotta bg-brand-terracotta text-white'
                : 'border-gray-300 text-gray-700 hover:bg-brand-sage'
            }`}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-3 py-2 text-gray-400">...</span>
            )}
            <Link
              href={generatePageUrl(totalPages)}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-brand-sage transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}
      </div>

      {/* Next Button */}
      {hasNextPage ? (
        <Link
          href={generatePageUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-brand-sage transition-colors"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
          Next
        </span>
      )}
    </nav>
  );
}