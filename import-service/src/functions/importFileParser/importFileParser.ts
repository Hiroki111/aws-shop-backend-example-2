import { parseCsvStream } from "../../utils/csv";
import { errorResponse } from "../../utils/apiResponseBuilder";
import { winstonLogger as logger } from "../../utils/winstonLogger";
import { copyObject, deleteObject, getObject } from "../../libs/s3";
import { S3Event } from "aws-lambda";

const { UPLOADED_FOLDER = "", PARSED_FOLDER = "" } = process.env;

export const importFileParser = async (event: S3Event) => {
  try {
    for (const record of event.Records) {
      const { object, bucket } = record.s3;
      const input = {
        Bucket: bucket.name,
        Key: object.key,
      };

      logger.LOG(`Parsing csv stream with input: ${JSON.stringify(input)}`);
      const { Body: csvStream } = await getObject(input);
      const records = await parseCsvStream(csvStream);
      logger.LOG(`Parsed records: ${JSON.stringify(records)}`);

      logger.LOG(`Moving file from '${UPLOADED_FOLDER}' to '${PARSED_FOLDER}'`);
      await copyObject({
        ...input,
        CopySource: `${bucket.name}/${object.key}`,
        Key: object.key.replace(UPLOADED_FOLDER, PARSED_FOLDER),
      });

      logger.LOG(`Deleting file from folder ${UPLOADED_FOLDER}`);
      await deleteObject(input);
    }
  } catch (e) {
    const error = errorResponse(e);
    logger.ERROR(error.body);
  }
};
