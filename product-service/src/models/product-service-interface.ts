import { CreateProduct, ProductsWithCount, ProductWithCount } from "./products";

export interface ProductServiceInterface {
  getProductById: (id: string) => Promise<ProductWithCount>;
  getAllProducts: () => Promise<ProductsWithCount>;
  create: (product: CreateProduct) => Promise<ProductWithCount>;
}
