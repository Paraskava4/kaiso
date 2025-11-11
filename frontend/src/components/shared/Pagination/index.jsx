import * as React from "react";
import PropTypes from "prop-types";

function PageSelector({ itemsPerPage, onItemsPerPageChange }) {
  return (
    <div className="flex relative gap-2 items-center">
      <label
        htmlFor="page-size-select"
        className="relative text-sm font-medium leading-5 text-zinc-500"
      >
        List per Page:
      </label>
      <div className="flex relative gap-2 items-center px-2 py-1.5 h-8 bg-white">
        <select
          id="page-size-select"
          className="relative text-sm font-medium leading-5 text-zinc-700 bg-transparent border-none outline-none"
          aria-label="Select number of items per page"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}

PageSelector.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
};

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  maxVisiblePages = 5,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxVisibleBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxVisibleAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxVisibleBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxVisibleAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxVisibleBeforeCurrent;
        endPage = currentPage + maxVisibleAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <footer
      className="flex relative justify-between mb-8 items-center self-stretch"
      role="contentinfo"
      aria-label="Pagination controls"
    >
      <div className="flex relative gap-2 items-center">
        <span className="relative text-sm font-medium leading-5 text-neutral-400">
          Showing
        </span>
        <span className="relative text-sm font-medium leading-5 text-zinc-700">
          {startItem} To {endItem}
        </span>
        <span className="relative text-sm font-medium leading-5 text-neutral-400">
          From {totalItems}
        </span>
      </div>
      <div className="flex relative gap-5 items-center">
        <PageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
        />
        <nav
          className="flex relative items-center h-8 bg-white border-solid border-[0.5px] border-zinc-700 border-opacity-30"
          role="navigation"
          aria-label="Pagination navigation"
        >
          <button
            className={`flex items-center justify-center gap-2.5 self-stretch px-2.5 text-sm font-medium leading-5 text-center bg-white border-solid border-r-[0.5px] border-r-zinc-700 border-r-opacity-30 w-[57px] ${
              currentPage === 1 ? "text-zinc-400 cursor-not-allowed" : "text-zinc-500 hover:bg-gray-50"
            }`}
            aria-label="Go to previous page"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>


          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`relative gap-2.5 self-stretch p-1.5 text-sm font-medium leading-5 text-center border-solid border-r-[0.5px] border-r-zinc-700 border-r-opacity-30 w-[30px] ${
                page === currentPage
                  ? "text-white bg-sky-900"
                  : "bg-white text-zinc-500 hover:bg-gray-50"
              }`}
              aria-label={`Go to page ${page}${page === currentPage ? ", current page" : ""}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className={`flex items-center justify-center gap-2.5 self-stretch px-2.5 text-sm font-medium leading-5 text-center bg-white  border-r-zinc-700 border-r-opacity-30 w-[57px] ${
              currentPage === totalPages ? "text-zinc-400 cursor-not-allowed" : "text-zinc-500 hover:bg-gray-50"
            }`}
            aria-label="Go to next page"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>

        </nav>
      </div>
    </footer>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  maxVisiblePages: PropTypes.number,
};

export default Pagination;