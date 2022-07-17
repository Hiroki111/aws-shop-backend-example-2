import { successResponse, errorResponse } from "../../libs/apiResponseBuilder";
import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";

export const getAllProductsHandler =
  (productService: ProductServiceInterface) => async (event) => {
    try {
      winstonLogger.logRequest(`Incoming event: ${JSON.stringify(event)}`);

      const products = await productService.getAllProducts();

      winstonLogger.logRequest(
        `"Received products: ${JSON.stringify(products)}`
      );

      return successResponse(products);
    } catch (err) {
      return errorResponse(err);
    }
  };
