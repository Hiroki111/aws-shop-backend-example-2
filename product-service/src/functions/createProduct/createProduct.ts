import { ProductServiceInterface } from "../../models/product-service-interface";
import { winstonLogger } from "../../libs/winstonLogger";
import { errorResponse, successResponse } from "../../libs/apiResponseBuilder";

export const createProductHandler =
  (productService: ProductServiceInterface) => async (event) => {
    try {
      winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

      const product = await productService.create(JSON.parse(event.body));

      winstonLogger.logRequest(`Created product: ${JSON.stringify(product)}`);

      return successResponse(product);
    } catch (err) {
      return errorResponse(err, err.statusCode);
    }
  };
