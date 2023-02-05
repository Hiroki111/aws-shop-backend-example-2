// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SNSClient } from "@aws-sdk/client-sns";
import { CreateProduct } from "../../models/products";
import { catalogBatchProcessHandler } from "./catalogBatchProcess";

const mockProductService = {
  create: jest.fn(),
};
let result: any;
jest.mock("@aws-sdk/client-sns", () => {
  // Works and lets you check for constructor calls:
  return {
    SNSClient: jest.fn().mockImplementation(() => {
      return { send: (command) => (result = command) };
    }),
    PublishCommand: jest.fn().mockImplementation(() => {
      return {
        TopicArn: "",
        Subject: "IvanR Ideas Store: imported products (have zero count)",
        Message:
          "[\n" +
          "  {\n" +
          '    "id": "testID",\n' +
          '    "price": 1,\n' +
          '    "count": 0,\n' +
          '    "title": "Product",\n' +
          '    "description": "description"\n' +
          "  },\n" +
          "  {\n" +
          '    "id": "testID",\n' +
          '    "price": 1,\n' +
          '    "count": 0,\n' +
          '    "title": "test",\n' +
          '    "description": "test"\n' +
          "  }\n" +
          "]",
        MessageAttributes: {
          haveZeroCount: { DataType: "Number", StringValue: "1" },
        },
      };
    }),
  };
});

it("should create products and publish message", async () => {
  const product: CreateProduct = {
    price: 1,
    count: 0,
    title: "test",
    description: "test",
  };
  const event = {
    Records: [
      { body: JSON.stringify(product) },
      { body: JSON.stringify(product) },
    ],
  };
  mockProductService.create.mockResolvedValue({ id: "testID", ...product });
  const handler = catalogBatchProcessHandler(mockProductService as any);

  const response = await handler(event, null, null);

  expect(mockProductService.create).toBeCalledTimes(2);
  expect(mockProductService.create).toHaveBeenNthCalledWith(1, product);
  expect(mockProductService.create).toHaveBeenNthCalledWith(2, product);
  expect(result).toBeTruthy();
  expect(result).toEqual({
    TopicArn: "",
    Subject: "IvanR Ideas Store: imported products (have zero count)",
    Message:
      "[\n" +
      "  {\n" +
      '    "id": "testID",\n' +
      '    "price": 1,\n' +
      '    "count": 0,\n' +
      '    "title": "Product",\n' +
      '    "description": "description"\n' +
      "  },\n" +
      "  {\n" +
      '    "id": "testID",\n' +
      '    "price": 1,\n' +
      '    "count": 0,\n' +
      '    "title": "test",\n' +
      '    "description": "test"\n' +
      "  }\n" +
      "]",
    MessageAttributes: {
      haveZeroCount: { DataType: "Number", StringValue: "1" },
    },
  });
  expect(response).toEqual({
    batchItemFailures: [],
  });
});
