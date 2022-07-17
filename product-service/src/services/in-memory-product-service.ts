import products from "../mocks/products-data.json";
import { ProductServiceInterface } from "../models/product-service-interface";

class InMemoryProductService implements ProductServiceInterface {
  getProductById(id: string) {
    return Promise.resolve(products.find((product) => product.id === id));
  }

  getAllProducts() {
    return Promise.resolve(products);
  }
}

export { InMemoryProductService };
