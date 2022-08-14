import { ProductServiceInterface } from "../../models/product-service-interface";
import { winstonLogger } from "../../libs/winstonLogger";
import { errorResponse, successResponse } from "../../libs/apiResponseBuilder";
import { APIGatewayEvent } from "aws-lambda";
import { CreateProduct, ProductWithCount } from "../../models/products";

export const createProductHandler =
  (productService: ProductServiceInterface) =>
  async (event: Pick<APIGatewayEvent, "body">) => {
    try {
      const payload = JSON.parse(event.body) as CreateProduct;
      winstonLogger.LOG(`Creating product: ${payload}`);

      let product: ProductWithCount;
      try {
        product = await productService.create(payload);
      } catch (e) {
        winstonLogger.ERROR(e);
        return errorResponse(
          new Error(
            `Could not create a product with payload ${JSON.stringify(payload)}`
          ),
          400
        );
      }

      winstonLogger.LOG(`Created product: ${JSON.stringify(product)}`);
      return successResponse(product);
    } catch (e) {
      const error = errorResponse(e, e.statusCode);
      winstonLogger.ERROR(error.body);
      return error;
    }
  };
