import { convertToAcceptableFullname } from '../../helpers/textManipulation'
import { capitalize } from '../../controllers/authors.controller'

jest.mock('../../controllers/authors.controller.ts')

describe('Testing helper function to convert fullname to acceptable format', () => {
    const fullname: string = 'joe_van'

    const mockedFirstname: string = 'Joe'
    const mockedLastname: string = 'Van'

    it('Should return acceptable format of fullname unproccessed fullname', () => {
        ;(capitalize as jest.MockedFunction<typeof capitalize>)
            .mockReturnValueOnce(mockedFirstname)
            .mockReturnValueOnce(mockedLastname)
        
        const result = convertToAcceptableFullname(fullname)

        expect(result).toBeDefined()
        expect(result).toEqual(mockedFirstname + ' ' + mockedLastname)
        expect(capitalize).toHaveBeenCalled()
        expect(capitalize).toHaveBeenCalledTimes(2)
    })

    it('Should return acceptable format of fullname unproccessed firstname only', () => {
        ;(capitalize as jest.MockedFunction<typeof capitalize>)
            .mockReturnValueOnce(mockedFirstname)
        
        const result = convertToAcceptableFullname('joe')

        expect(result).toBeDefined()
        expect(result).toEqual(mockedFirstname)
        expect(capitalize).toHaveBeenCalled()
        expect(capitalize).toHaveBeenCalledTimes(1)
    })
    
    afterEach(() => {
        jest.clearAllMocks()
    })
})
