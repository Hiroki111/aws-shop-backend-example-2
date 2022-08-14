import { successResponse, errorResponse } from "../../libs/apiResponseBuilder";
import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";
import { ProductsWithCount } from "../../models/products";

export const getAllProductsHandler =
  (productService: ProductServiceInterface) => async (event) => {
    try {
      winstonLogger.LOG(
        `Getting all products. Event: ${JSON.stringify(event)}`
      );

      let products: ProductsWithCount;
      try {
        products = await productService.getAllProducts();
        winstonLogger.LOG(`"Received products: ${JSON.stringify(products)}`);
        return successResponse(products);
      } catch (e) {
        return errorResponse(new Error("Could not get products"), 404);
      }
    } catch (e) {
      const error = errorResponse(e, e.statusCode);
      winstonLogger.ERROR(error.body);
      return error;
    }
  };
