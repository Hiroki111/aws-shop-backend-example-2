import { Handler, SQSEvent } from "aws-lambda";
import { CreateProduct } from "../../models/products";
import { ProductServiceInterface } from "../../models/product-service-interface";
import { winstonLogger } from "../../libs/winstonLogger";
import { PublishCommand, PublishInput, SNSClient } from "@aws-sdk/client-sns";

const { REGION = "", TOPIC_ARN = "" } = process.env;
const sns = new SNSClient({ region: REGION });

export const catalogBatchProcessHandler =
  (productService: ProductServiceInterface): Handler =>
  async (event: SQSEvent) => {
    let haveZeroCount = 0;
    const importedProducts = [];
    const batchItemFailures = [];
    winstonLogger.LOG(
      `Processing Data From Queue with Records ${JSON.stringify(event.Records)}`
    );

    for (const record of event.Records) {
      const payload: CreateProduct = JSON.parse(record.body);

      try {
        winstonLogger.LOG(
          `Creating product with payload: ${JSON.stringify(payload)}`
        );
        const createdProduct = await productService.create(payload);

        if (!createdProduct) {
          winstonLogger.ERROR(
            `Unable to create product with payload: ${JSON.stringify(payload)}`
          );
          batchItemFailures.push({ itemIdentifier: record.messageId });
        } else {
          winstonLogger.LOG(
            `Created product: ${JSON.stringify(createdProduct)}`
          );
          importedProducts.push(createdProduct);

          if (createdProduct.count === 0) {
            winstonLogger.WARN(`Product has zero count`);
            haveZeroCount = 1;
          }
        }
      } catch (e) {
        winstonLogger.ERROR(
          `Error in processing SQS consumer with payload: ${JSON.stringify(
            payload
          )}`
        );
        winstonLogger.ERROR(`Error message: ${e.message}`);
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }

    winstonLogger.LOG(`Publishing messages to SNS`);
    const publishMessage: PublishInput = {
      TopicArn: TOPIC_ARN,
      Subject: `IvanR Ideas Store: imported products ${
        haveZeroCount ? "(have zero count)" : ""
      }`,
      Message: JSON.stringify(importedProducts),
      MessageAttributes: {
        haveZeroCount: {
          DataType: "Number",
          StringValue: haveZeroCount.toString(),
        },
      },
    };
    await sns.send(new PublishCommand(publishMessage));

    return { batchItemFailures };
  };
