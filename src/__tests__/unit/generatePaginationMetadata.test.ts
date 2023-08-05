import generatePaginationMetadata from '../../helpers/generatePaginationMetadata'
import { type IPaginationMetadata } from '../../types'


describe('Testing generate pagination metadata helper function', () => {

    it('Should return pagination metadata for correct arguments for page 1', () => {
        const tempTotalResult: number = 50
        const tempPage: number = 1
        const tempSize: number = 10

        const result: IPaginationMetadata = generatePaginationMetadata(tempTotalResult,tempPage,tempSize)

        expect(result.total_results).toEqual(tempTotalResult)
        expect(result.current_page).toEqual(tempPage)
        expect(result.total_pages).toEqual(tempTotalResult / tempSize)
        expect(result.has_next_page).toBeTruthy()
        expect(result.has_previous_page).toBeFalsy()
    })

    it('Should return pagination metadata for correct arguments for intermediate page ', () => {
        const tempTotalResult: number = 50
        const tempPage: number = 3
        const tempSize: number = 10

        const result: IPaginationMetadata = generatePaginationMetadata(tempTotalResult,tempPage,tempSize)

        expect(result.total_results).toEqual(tempTotalResult)
        expect(result.current_page).toEqual(tempPage)
        expect(result.total_pages).toEqual(tempTotalResult / tempSize)
        expect(result.has_next_page).toBeTruthy()
        expect(result.has_previous_page).toBeTruthy()
    })

    it('Should return pagination metadata for correct arguments for last page', () => {
        const tempTotalResult: number = 50
        const tempPage: number = 5
        const tempSize: number = 10

        const result: IPaginationMetadata = generatePaginationMetadata(tempTotalResult,tempPage,tempSize)

        expect(result.total_results).toEqual(tempTotalResult)
        expect(result.current_page).toEqual(tempPage)
        expect(result.total_pages).toEqual(tempTotalResult / tempSize)
        expect(result.has_next_page).toBeFalsy()
        expect(result.has_previous_page).toBeTruthy()
    })

    it('should generate pagination metadata correctly when totalResult is less than size', () => {
        const totalResult = 5
        const currentPage = 1
        const size = 10
    
        const result: IPaginationMetadata = generatePaginationMetadata(totalResult, currentPage, size)
    
        expect(result.total_results).toBe(totalResult)
        expect(result.total_pages).toBe(1)
        expect(result.current_page).toBe(currentPage)
        expect(result.has_next_page).toBe(false)
        expect(result.has_previous_page).toBe(false)
      })
})