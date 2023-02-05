export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type ProductWithCount = {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
};

export type Stock = {
  product_id: string;
  count: number;
};

export type ProductsWithCount = ProductWithCount[];

export type CreateProduct = {
  title: string;
  description: string;
  price: number;
  count: number;
};
