// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  handleCloudinaryUpload,
  handleGetCloudinaryResource,
} from "../../../lib/cloudinary";

/**
 * The handler function for the API route. Takes in an incoming request and outgoing response.
 *
 * @param {NextApiRequest} req The incoming request object
 * @param {NextApiResponse} res The outgoing response object
 */
export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "GET": {
      try {
        if (!id) {
          throw "id param is required";
        }

        const result = await handleGetRequest(id);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res
          .status(error?.error?.http_code ?? 400)
          .json({ message: "Error", error });
      }
    }

    case "POST": {
      try {
        if (!id) {
          throw "id param is required";
        }

        const result = await handlePostRequest(id);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res
          .status(error?.error?.http_code ?? 400)
          .json({ message: "Error", error });
      }
    }

    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

/**
 * Handles the GET request to the API route.
 *
 * @param {string} id The public id of the image to retrieve
 * @returns
 */
const handleGetRequest = (id) => {
  return handleGetCloudinaryResource(id);
};

/**
 * Handles the POST request to the API route.
 *
 * @param {string} id The public id that will be given to the image
 * @returns
 */
const handlePostRequest = (id) => {
  return handleCloudinaryUpload({
    path: "public/images/badge-bg.png",
    publicId: id,
  });
};
