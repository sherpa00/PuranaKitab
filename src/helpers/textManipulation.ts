import { capitalize } from '../__tests__/integration/controllers/authors.controller'

// req.query fullname into acceptable format with Capital Firstname and Capital Lastname
const convertToAcceptableFullname = (unProcessedFullname: string): string => {
  const arrDividedFullname = unProcessedFullname.split('_').map(data => capitalize(data))
  const processedFullname = arrDividedFullname.join(' ')
  return processedFullname
}

export { convertToAcceptableFullname, capitalize }
