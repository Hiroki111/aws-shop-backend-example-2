import * as handlers from "./src/functions";
import { ProductRepositoryService } from "./src/services/product-repository-service";
import { Client, ClientConfig } from "pg";
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

const dbClient = new Client(dbOptions);
dbClient.connect();
// const productService = new InMemoryProductService();
const productService = new ProductRepositoryService(dbClient);

export const getProductById = handlers.getProductByIdHandler(productService);
export const getAllProducts = handlers.getAllProductsHandler(productService);
export const createProduct = handlers.createProductHandler(productService);
