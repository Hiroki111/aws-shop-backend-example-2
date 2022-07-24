import { successResponse, errorResponse } from "../../libs/apiResponseBuilder";
import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";

export const getProductByIdHandler =
  (productService: ProductServiceInterface) => async (event) => {
    try {
      winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

      const { productId = "" } = event.pathParameters;

      const product = await productService.getProductById(productId);

      winstonLogger.logRequest(
        `"Received product with id: ${productId}: ${JSON.stringify(product)}`
      );

      if (!product)
        return errorResponse(
          new Error(`Product with id ${productId} not found`),
          404
        );

      return successResponse({ product });
    } catch (err) {
      return errorResponse(err);
    }
  };
