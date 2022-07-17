import { Product, Products } from "./products";

export interface ProductServiceInterface {
  getProductById: (id: string) => Promise<Product>;
  getAllProducts: () => Promise<Products>;
}
