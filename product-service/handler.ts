import * as handlers from "./src/functions";
import { ProductRepositoryService } from "./src/services/product-repository-service";
import { ClientConfig, Pool } from "pg";
import * as process from "process";

const { PGHOST, PGPORT, PGDATABASE, PGUSERNAME, PGPASSWORD } = process.env;
const dbOptions: ClientConfig = {
  user: PGUSERNAME,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: Number(PGPORT),
  host: PGHOST,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

const dbClient = new Pool(dbOptions);
dbClient.connect();
// const productService = new InMemoryProductService();
const productService = new ProductRepositoryService(dbClient);

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
export const createProduct = handlers.createProductHandler(productService);
export const catalogBatchProcess =
  handlers.catalogBatchProcessHandler(productService);
