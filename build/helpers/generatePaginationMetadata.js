"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// helper function to generate pagination metadata
const generatePaginationMetadata = (totalResult, currentPage, size) => {
    const totalPages = totalResult === size ? 1 : Math.ceil(totalResult / size);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    return {
        total_results: Number(totalResult),
        total_pages: totalPages,
        current_page: currentPage,
        has_next_page: hasNextPage,
        has_previous_page: hasPreviousPage
    };
};
exports.default = generatePaginationMetadata;
