// middleware to upload image to cloudinary
import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs/promises'

dotenv.config()

// types for response of image uplaod
export interface ICloudinaryResponse {
  success: boolean
  message: string
  imgURL?: string
  imgPublicId?: string
}

// config for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadImageToCloud = async (imageToBeUpload: string): Promise<ICloudinaryResponse> => {
  try {
    // uplaod to cloudinary
    const imageUploadedToCloudinaryData = await cloudinary.uploader.upload(imageToBeUpload, {
      folder: 'PuranaKitab'
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { url, public_id } = imageUploadedToCloudinaryData

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!url) {
      return {
        success: false,
        message: 'Failed to upload imaage to cloudinary'
      }
    }

    return {
      success: true,
      message: 'Successfully uploaded image to cloudinary',
      imgURL: url,
      imgPublicId: String(public_id).replace('PuranaKitab/', '')
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: 'Error while uploading image '
    }
  } finally {
    // finnally delete locally added image after uploading to cloud
    await fs.unlink(imageToBeUpload)
  }
}

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
        message: 'Failed to update image to cloudinary'
      }
    }

    return {
      success: true,
      message: 'Successfully updated image to cloudinary'
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: 'Error while updating image'
    }
  } finally {
    // finnally delete locally added image after uploading to cloud
    await fs.unlink(imageToBeUpload)
  }
}

export { updateImageToCloud, uploadImageToCloud }
