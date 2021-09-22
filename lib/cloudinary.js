// Import the v2 api and rename it to cloudinary
import { v2 as cloudinary, TransformationOptions } from "cloudinary";
import { CLOUDINARY_FOLDER_NAME } from "./constants";

// Initialize the sdk with cloud_name, api_key and api_secret
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Gets a resource from cloudinary using it's public id
 *
 * @param {string} publicId The public id of the image
 */
export const handleGetCloudinaryResource = (publicId) => {
  return cloudinary.api.resource(`${CLOUDINARY_FOLDER_NAME}${publicId}`, {
    resource_type: "image",
    type: "upload",
  });
};

/**
 * Applies chained transformations to an image and returns the url
 *
 * @param {string} publicId The public id of the image
 * @param {TransformationOptions} transformation The transformation options to run on the image
 */
export const handleGetTransformImageUrl = (publicId, transformation) => {
  return cloudinary.url(publicId, { transformation });
};

/**
 * Uploads an image to cloudinary and returns the upload result
 *
 * @param {{path: string; transformation?:TransformationOptions,publicId?: string }} resource
 */
export const handleCloudinaryUpload = (resource) => {
  return cloudinary.uploader.upload(resource.path, {
    // Folder to store image in
    folder: CLOUDINARY_FOLDER_NAME,
    // Public id of image.
    public_id: resource.publicId,
    // Type of resource
    resource_type: "auto",
    // Transformation to apply to the video
    transformation: resource.transformation,
  });
};
