import * as handlers from "./src/functions";
import { InMemoryProductService } from "./src/services/in-memory-product-service";

const productService = new InMemoryProductService();

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
