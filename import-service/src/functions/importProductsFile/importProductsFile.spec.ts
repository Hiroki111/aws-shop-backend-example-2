import { importProductsFile } from "./importProductsFile";
import { errorResponse, successResponse } from "../../utils/apiResponseBuilder";
jest.mock("@aws-sdk/s3-request-presigner");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

describe("importProductsFile Handler", () => {
  it("should return 400 if no productName in query", async () => {
    const result = await importProductsFile({
      queryStringParameters: {
        name: null,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 200 with signedUrl", async () => {
    const getSignedUrlMock: jest.Mock = getSignedUrl as any;

    const testUrl = "testUrl";
    getSignedUrlMock.mockResolvedValue(testUrl);

    const result = await importProductsFile({
      queryStringParameters: { name: "name" },
    });
    expect(result).toEqual(successResponse(testUrl));
  });

  it("should return error", async () => {
    const getSignedUrlMock: jest.Mock = getSignedUrl as any;

    const error = new Error("Something went wrong");
    getSignedUrlMock.mockRejectedValue(error);

    const result = await importProductsFile({
      queryStringParameters: { name: "name" },
    });
    expect(result).toEqual(errorResponse(error));
  });
});
