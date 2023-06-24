import { type IPaginationMetadata } from '../types/index'

// helper function to generate pagination metadata
const generatePaginationMetadata = (totalResult: number, currentPage: number, size: number): IPaginationMetadata => {
  const totalPages: number = totalResult === size ? 1 : Math.ceil(totalResult / size)
  const hasNextPage: boolean = currentPage < totalPages
  const hasPreviousPage: boolean = currentPage > 1

  return {
    total_results: totalResult,
    total_pages: totalPages,
    current_page: currentPage,
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage
  }
}

export default generatePaginationMetadata
