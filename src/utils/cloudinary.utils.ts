// middleware to upload image to cloudinary
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs/promises'
import logger from './logger.utils'

dotenv.config()

// types for response of image uplaod
export interface ICloudinaryResponse {
  success: boolean
  message: string
  imgURL?: string
  imgPublicId?: string
  data?: any
}

// config for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// util to upload image to cloud
const uploadImageToCloud = async (imageToBeUpload: string): Promise<ICloudinaryResponse> => {
  try {
    // uplaod to cloudinary
    const imageUploadedToCloudinaryData: UploadApiResponse = await cloudinary.uploader.upload(imageToBeUpload, {
      folder: 'PuranaKitab'
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { url, public_id } = imageUploadedToCloudinaryData

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!url || !public_id) {
      return {
        success: false,
        message: 'Failed to upload image'
      }
    }

    return {
      success: true,
      message: 'Successfully uploaded image',
      imgURL: url,
      imgPublicId: String(public_id).replace('PuranaKitab/', '')
    }
  } catch (err) {
    logger.error(err, 'Error while uploading image to cloud')
    return {
      success: false,
      message: 'Failed to upload image'
    }
  } finally {
    // finnally delete locally added image after uploading to cloud
    await fs.unlink(imageToBeUpload)
  }
}

// util to update image by replacing the original image from cloud using same public_id
const updateImageToCloud = async (imageToBeUpload: string, imgPublicId: string): Promise<ICloudinaryResponse> => {
  try {
    // uplaod to cloudinary
    const imageUpdatedToCloudinaryData = await cloudinary.uploader.upload(imageToBeUpload, {
      folder: 'PuranaKitab',
      public_id: imgPublicId,
      invalidate: true
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { url } = imageUpdatedToCloudinaryData

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!url) {
      return {
        success: false,
        message: 'Failed to update image'
      }
    }

    return {
      success: true,
      message: 'Successfully updated image',
      imgURL: url
    }
  } catch (err) {
    logger.error(err, 'Error while updating image from cloud')
    return {
      success: false,
      message: 'Error while updating image'
    }
  } finally {
    // finnally delete locally added image after uploading to cloud
    await fs.unlink(imageToBeUpload)
  }
}

// util to remove image from cloud
const removeImageFromCloud = async (imgPublicId: string): Promise<ICloudinaryResponse> => {
  try {
    // delete image from cloudinary
    const newPubliId: string = `PuranaKitab/${imgPublicId}`
    const imageRemovedFromCloudinaryData = await cloudinary.uploader.destroy(newPubliId)

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (imageRemovedFromCloudinaryData.result !== 'ok') {
      return {
        success: false,
        message: 'Failed to remove image'
      }
    }

    return {
      success: true,
      message: 'Successfully removed image'
    }
  } catch (err) {
    logger.error(err, 'Error while removng image from cloud')
    return {
      success: false,
      message: 'Failed to remove image'
    }
  }
}

export { updateImageToCloud, uploadImageToCloud, removeImageFromCloud }
