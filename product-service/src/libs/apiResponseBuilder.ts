import { winstonLogger } from "./winstonLogger";

interface ResponseInterface {
  statusCode: number;
  headers: Record<string, unknown>;
  body: string;
}

const defaultHeaders = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
};

const errorResponse = (err: Error, statusCode = 500): ResponseInterface => {
  winstonLogger.logError(`Error: ${err.message}`);

  return {
    statusCode,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({
      message: err.message || "Something went wrong !!!",
    }),
  };
};

const successResponse = (
  body: unknown,
  statusCode = 200
): ResponseInterface => {
  winstonLogger.logRequest(`Lambda successfully invoked and finished`);

  return {
    statusCode,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(body),
  };
};

export { errorResponse, successResponse, ResponseInterface };
