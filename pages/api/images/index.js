// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import {
  handleCloudinaryUpload,
  handleGetTransformImageUrl,
} from "../../../lib/cloudinary";
import {
  BADGE_FRAME_NAME,
  CLOUDINARY_FOLDER_NAME,
} from "../../../lib/constants";

// Custom config for our API route
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * The handler function for the API route. Takes in an incoming request and outgoing response.
 *
 * @param {NextApiRequest} req The incoming request object
 * @param {NextApiResponse} res The outgoing response object
 */
export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      try {
        const result = await handlePostRequest(req);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

/**
 * Handles the POST request to the API route.
 *
 * @param {NextApiRequest} req The incoming request object
 */
const handlePostRequest = async (req) => {
  // Get the form data using the parseForm function
  const data = await parseForm(req);

  // Get the name of the user from the incoming form data
  const name = data.fields.name;

  // Get the how it started image file from the incoming form data
  const thenImage = data.files.then;

  // Get the how it's going image file from the incoming form data
  const nowImage = data.files.now;

  // Upload the how it started image to Cloudinary
  const thenImageUploadResult = await handleCloudinaryUpload({
    path: thenImage.path,
  });

  // Upload the how it's going image to Cloudinary
  const nowImageUploadResult = await handleCloudinaryUpload({
    path: nowImage.path,
  });

  // Use Cloudinary to overlay the two images over the badge frame using chained transformations
  const url = handleGetTransformImageUrl(
    // The badge frame image
    `${CLOUDINARY_FOLDER_NAME}${BADGE_FRAME_NAME}`,
    [
      {
        // Then image
        overlay: thenImageUploadResult.public_id.replace(/\//g, ":"),
        width: 110,
        height: 110,
        crop: "scale",
        gravity: "north_west",
        x: 56,
        y: 478,
      },
      {
        // Now image
        overlay: nowImageUploadResult.public_id.replace(/\//g, ":"),
        width: 150,
        height: 150,
        crop: "scale",
        gravity: "north_west",
        x: 220,
        y: 405,
      },
      {
        // Name layer
        overlay: {
          font_family: "Arial",
          font_size: 36,
          font_weight: "bold",
          stroke: "stroke",
          letter_spacing: 2,
          text: name,
        },
        border: "5px_solid_black",
        color: "white",
        width: 333,
        crop: "fit",
        gravity: "north_west",
        x: 50,
        y: 650,
      },
    ]
  );

  return url;
};

/**
 * Parses the incoming form data.
 *
 * @param {NextApiRequest} req The incoming request object
 */
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      return resolve({ fields, files });
    });
  });
};
