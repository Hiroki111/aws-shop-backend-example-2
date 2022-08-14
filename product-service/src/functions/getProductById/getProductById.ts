import { successResponse, errorResponse } from "../../libs/apiResponseBuilder";
import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";

export const getProductByIdHandler =
  (productService: ProductServiceInterface) => async (event) => {
    try {
      winstonLogger.LOG(`Incoming event: ${JSON.stringify(event)}`);

      const { productId = "" } = event.pathParameters;

      const product = await productService.getProductById(productId);

      winstonLogger.LOG(
        `"Received product with id: ${productId}: ${JSON.stringify(product)}`
      );

      if (!product)
        return errorResponse(
          new Error(`Product with id ${productId} not found`),
          404
        );

      return successResponse({ product });
    } catch (e) {
      const error = errorResponse(e, e.statusCode);
      winstonLogger.ERROR(error.body);
      return error;
    }
  };
