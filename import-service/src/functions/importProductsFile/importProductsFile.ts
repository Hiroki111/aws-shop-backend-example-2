import { errorResponse, successResponse } from "../../utils/apiResponseBuilder";
import { winstonLogger as logger } from "../../utils/winstonLogger";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../libs/s3";
import { APIGatewayEvent } from "aws-lambda";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const { BUCKET, UPLOADED_FOLDER } = process.env;

export const importProductsFile = async (
  event: Pick<APIGatewayEvent, "queryStringParameters">
) => {
  try {
    const {
      queryStringParameters: { name: filename },
    } = event;

    if (!filename) {
      return errorResponse(new Error('Please provide queryString "name"'), 400);
    }

    logger.LOG("Creating a signed URL");
    const importFile = new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${UPLOADED_FOLDER}/${filename}`,
      ContentType: "text/csv",
    });
    const signedUrl = await getSignedUrl(s3Client, importFile, {
      expiresIn: 60,
    });
    logger.LOG(`Created signed url: ${signedUrl}`);

    return successResponse(signedUrl);
  } catch (error) {
    return errorResponse(error);
  }
};
