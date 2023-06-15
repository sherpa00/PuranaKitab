"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImageFromCloud = exports.uploadImageToCloud = exports.updateImageToCloud = void 0;
// middleware to upload image to cloudinary
const cloudinary_1 = require("cloudinary");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("node:fs/promises"));
dotenv.config();
// config for cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// util to upload image to cloud
const uploadImageToCloud = (imageToBeUpload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // uplaod to cloudinary
        const imageUploadedToCloudinaryData = yield cloudinary_1.v2.uploader.upload(imageToBeUpload, {
            folder: 'PuranaKitab'
        });
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { url, public_id } = imageUploadedToCloudinaryData;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!url) {
            return {
                success: false,
                message: 'Failed to upload imaage'
            };
        }
        return {
            success: true,
            message: 'Successfully uploaded image to cloud',
            imgURL: url,
            imgPublicId: String(public_id).replace('PuranaKitab/', '')
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while uploading image '
        };
    }
    finally {
        // finnally delete locally added image after uploading to cloud
        yield fs.unlink(imageToBeUpload);
    }
});
exports.uploadImageToCloud = uploadImageToCloud;
// util to update image by replacing the original image from cloud using same public_id
const updateImageToCloud = (imageToBeUpload, imgPublicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // uplaod to cloudinary
        const imageUpdatedToCloudinaryData = yield cloudinary_1.v2.uploader.upload(imageToBeUpload, {
            folder: 'PuranaKitab',
            public_id: imgPublicId,
            invalidate: true
        });
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { url } = imageUpdatedToCloudinaryData;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!url) {
            return {
                success: false,
                message: 'Failed to update image'
            };
        }
        return {
            success: true,
            message: 'Successfully updated image to cloud'
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while updating image'
        };
    }
    finally {
        // finnally delete locally added image after uploading to cloud
        yield fs.unlink(imageToBeUpload);
    }
});
exports.updateImageToCloud = updateImageToCloud;
// util to remove image from cloud
const removeImageFromCloud = (imgPublicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // delete image from cloudinary
        const newPubliId = 'PuranaKitab/' + imgPublicId;
        const imageRemovedFromCloudinaryData = yield cloudinary_1.v2.uploader.destroy(newPubliId);
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (imageRemovedFromCloudinaryData.result !== 'ok') {
            return {
                success: false,
                message: 'Failed to remove image from cloud'
            };
        }
        return {
            success: true,
            message: 'Successfully removed image from cloud'
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while removing image'
        };
    }
});
exports.removeImageFromCloud = removeImageFromCloud;
