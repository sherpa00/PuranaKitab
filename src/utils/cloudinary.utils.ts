// middleware to upload image to cloudinary
import {v2 as cloudinary} from 'cloudinary'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs/promises'

dotenv.config()

// types for response of image uplaod
export interface ICloudinaryResponse {
    success: boolean
    message: string
    imgURL?: string
}

// config for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadImage = async (imageToBeUpload: string): Promise<ICloudinaryResponse> => {
    try {
        // uplaod to cloudinary
        const imageUploadedToCloudinaryData = await cloudinary.uploader.upload(
            imageToBeUpload,
            {
                folder: 'PuranaKitab'
            }
        )

        const {url} = imageUploadedToCloudinaryData 

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
            imgURL: url
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


export default uploadImage

