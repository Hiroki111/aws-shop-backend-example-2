import { Client, QueryConfig } from "pg";
import { ProductsWithCount, ProductWithCount } from "../models/products";
import { ProductServiceInterface } from "../models/product-service-interface";
import { TableEnum } from "../libs/table.enums";

class ProductRepositoryService implements ProductServiceInterface {
  constructor(private dbClient: Client) {}

  async getProductById(id: string): Promise<ProductWithCount> {
    const query: QueryConfig = {
      text: `SELECT p.*, s.count FROM ${TableEnum.PRODUCTS} p inner join ${TableEnum.STOCK} s on p.id = s.product_id WHERE p.id = $1`,
      values: [id],
    };

    const result = await this.dbClient.query(query);
    return result.rows[0] ? result.rows[0] : null;
  }

  async getAllProducts(): Promise<ProductsWithCount> {
    const query: QueryConfig = {
      text: `SELECT p.*, s.count FROM ${TableEnum.PRODUCTS} p JOIN ${TableEnum.STOCK} s on p.id = s.product_id`,
    };

    const result = await this.dbClient.query(query);
    return result.rows ? result.rows : null;
  }

  async create(product: ProductWithCount) {
    let res: ProductWithCount;
    try {
      await this.dbClient.query("BEGIN");
      const queryProductConfig: QueryConfig = {
        text: `INSERT INTO ${TableEnum.PRODUCTS}(title, description, price) VALUES($1, $2, $3) RETURNING *`,
        values: [product.title, product.description, product.price],
      };
      const resultProduct = await this.dbClient.query(queryProductConfig);
      const queryStockConfig = {
        text: `INSERT INTO ${TableEnum.STOCK}(product_id, count) VALUES ($1, $2) RETURNING *`,
        values: [resultProduct.rows[0].id, product.count],
      };
      const resultStock = await this.dbClient.query(queryStockConfig);
      res = {
        ...resultProduct.rows[0],
        count: resultStock.rows[0].count,
      };
      await this.dbClient.query("COMMIT");
    } catch (e) {
      await this.dbClient.query("ROLLBACK");
      throw e;
    } finally {
      await this.dbClient.end();
    }

    return res;
  }
}

export { ProductRepositoryService };
