import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5,
  className = '',
  size = 'md'
}) => {
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const needsEllipsis = totalPages > maxVisiblePages;
  const showStartEllipsis = needsEllipsis && visiblePages[0] > 2;
  const showEndEllipsis = needsEllipsis && visiblePages[visiblePages.length - 1] < totalPages - 1;

  const buttonSize = size === 'sm' ? 'sm' : 'md';
  const buttonClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items info */}
      {showInfo && (
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Showing {startItem} to {endItem} of {totalItems} items
        </div>
      )}
      
      {/* Pagination controls */}
      <div className="flex items-center space-x-1 order-1 sm:order-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        
        {/* First page */}
        {showStartEllipsis && (
          <>
            <Button
              variant={currentPage === 1 ? 'primary' : 'outline'}
              size={buttonSize}
              onClick={() => onPageChange(1)}
              className={buttonClass}
            >
              1
            </Button>
            <span className="px-2 text-gray-500">...</span>
          </>
        )}
        
        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'outline'}
            size={buttonSize}
            onClick={() => onPageChange(page)}
            className={`${buttonClass} ${
              currentPage === page ? 'bg-blue-600 text-white border-blue-600' : ''
            }`}
          >
            {page}
          </Button>
        ))}
        
        {/* Last page */}
        {showEndEllipsis && (
          <>
            <span className="px-2 text-gray-500">...</span>
            <Button
              variant={currentPage === totalPages ? 'primary' : 'outline'}
              size={buttonSize}
              onClick={() => onPageChange(totalPages)}
              className={buttonClass}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        {/* Next button */}
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
