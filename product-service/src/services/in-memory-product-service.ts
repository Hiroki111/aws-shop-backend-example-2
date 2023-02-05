import products from "../mocks/products-data.json";
import { ProductServiceInterface } from "../models/product-service-interface";
import { CreateProduct } from "../models/products";

class InMemoryProductService implements ProductServiceInterface {
  getProductById(id: string) {
    return Promise.resolve(products.find((product) => product.id === id));
  }

  getAllProducts() {
    return Promise.resolve(products);
  }

  create(product: CreateProduct) {
    return Promise.resolve(product as any);
  }
}

export { InMemoryProductService };
