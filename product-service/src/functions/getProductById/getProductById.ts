import { successResponse, errorResponse } from "../../libs/apiResponseBuilder";
import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";

export const getProductByIdHandler =
  (productService: ProductServiceInterface) => async (event) => {
    try {
      console.log(event.pathParameters);
      winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

      const { productId = "" } = event.pathParameters;

      console.log(productService);

      const product = await productService.getProductById(productId);

      winstonLogger.logRequest(
        `"Received product with id: ${productId}: ${JSON.stringify(product)}`
      );

      if (product) return successResponse({ product });

      return successResponse({ message: "Product not found" }, 404);
    } catch (err) {
      return errorResponse(err);
    }
  };
