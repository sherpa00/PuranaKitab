import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs/promises'
import { removeImageFromCloud, updateImageToCloud, uploadImageToCloud } from '../../utils/cloudinary.utils'

jest.mock('dotenv')
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn()
    }
  }
}))
jest.mock('node:fs/promises')

describe('Testing cloudinary image upload function', () => {
  const imgPath: string = 'src/public/temp.jpg'

  const mockedCloudinaryUploadApiResponse = {
    url: 'https://example.com/image.jpg',
    public_id: 'PuranaKitab/image123'
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(dotenv.config as jest.MockedFunction<typeof dotenv.config>).mockReturnValue({})
    ;(cloudinary.config as jest.Mock)()
    ;(cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockedCloudinaryUploadApiResponse)
    ;(fs.unlink as jest.Mock).mockResolvedValue({})
  })

  it('Should return success response when uploading image to cloud', async () => {
    const result = await uploadImageToCloud(imgPath)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully uploaded image')
    expect(result.imgURL).toBeDefined()
    expect(result.imgURL).toEqual(mockedCloudinaryUploadApiResponse.url)
    expect(result.imgPublicId).toBeDefined()
    expect(result.imgPublicId).toEqual(String(mockedCloudinaryUploadApiResponse.public_id).replace('PuranaKitab/', ''))
    expect(cloudinary.uploader.upload).toHaveBeenCalled()
    expect(fs.unlink).toHaveBeenCalled()
  })

  it('Should return error response when cloudinary upload fails while uploading image to cloud', async () => {
    ;(cloudinary.uploader.upload as jest.Mock).mockResolvedValue({})

    const result = await uploadImageToCloud(imgPath)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to upload image')
    expect(result.imgURL).toBeUndefined()
    expect(result.imgPublicId).toBeUndefined()
    expect(cloudinary.uploader.upload).toHaveBeenCalled()
    expect(fs.unlink).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing cloudinary image update function', () => {
  const imgPath: string = 'src/public/temp.jpg'
  const imgPublicId: string = 'tempImagePublicId'

  const mockedCloudinaryUpdateApiResponse = {
    url: 'https://example.com/image.jpg'
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(dotenv.config as jest.MockedFunction<typeof dotenv.config>).mockReturnValue({})
    ;(cloudinary.config as jest.Mock)()
    ;(cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockedCloudinaryUpdateApiResponse)
    ;(fs.unlink as jest.Mock).mockResolvedValue({})
  })

  it('Should return success response when updating image from cloud', async () => {
    const result = await updateImageToCloud(imgPath, imgPublicId)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully updated image')
    expect(result.imgURL).toBeDefined()
    expect(result.imgURL).toEqual(mockedCloudinaryUpdateApiResponse.url)
    expect(cloudinary.uploader.upload).toHaveBeenCalled()
    expect(fs.unlink).toHaveBeenCalled()
  })

  it('Should return error response when cloudinary upload fails while updating image from cloud', async () => {
    ;(cloudinary.uploader.upload as jest.Mock).mockResolvedValue({})

    const result = await updateImageToCloud(imgPath, imgPublicId)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to update image')
    expect(result.imgURL).toBeUndefined()
    expect(cloudinary.uploader.upload).toHaveBeenCalled()
    expect(fs.unlink).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing cloudinary image remove function', () => {
  const imgPublicId: string = 'tempImagePublicId'

  const mockedCloudinaryDestroyApiResponse = {
    result: 'ok'
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(dotenv.config as jest.MockedFunction<typeof dotenv.config>).mockReturnValue({})
    ;(cloudinary.config as jest.Mock)()
    ;(cloudinary.uploader.destroy as jest.Mock).mockResolvedValue(mockedCloudinaryDestroyApiResponse)
  })

  it('Should return success response when removing image from cloud', async () => {
    const result = await removeImageFromCloud(imgPublicId)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully removed image')
    expect(cloudinary.uploader.destroy).toHaveBeenCalled()
  })

  it('Should return error response when cloudinary destroy fails while removing image from cloud', async () => {
    ;(cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
      result: 'failed'
    })

    const result = await removeImageFromCloud(imgPublicId)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove image')
    expect(cloudinary.uploader.destroy).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
