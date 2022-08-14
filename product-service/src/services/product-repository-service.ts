import { Pool, QueryConfig } from "pg";
import { ProductsWithCount, ProductWithCount } from "../models/products";
import { ProductServiceInterface } from "../models/product-service-interface";
import { TableEnum } from "../libs/table.enums";

class ProductRepositoryService implements ProductServiceInterface {
  constructor(private dbClient: Pool) {}

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
    const client = await this.dbClient.connect();
    try {
      await client.query("BEGIN");
      const queryProductConfig: QueryConfig = {
        text: `INSERT INTO ${TableEnum.PRODUCTS}(title, description, price) VALUES($1, $2, $3) RETURNING *`,
        values: [product.title, product.description, product.price],
      };
      const resultProduct = await client.query(queryProductConfig);
      const queryStockConfig = {
        text: `INSERT INTO ${TableEnum.STOCK}(product_id, count) VALUES ($1, $2) RETURNING *`,
        values: [resultProduct.rows[0].id, product.count],
      };
      const resultStock = await client.query(queryStockConfig);
      res = {
        ...resultProduct.rows[0],
        count: resultStock.rows[0].count,
      };
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      await client.release();
    }

    return res;
  }
}

export { ProductRepositoryService };
