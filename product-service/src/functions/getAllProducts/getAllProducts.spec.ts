import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";
import { getAllProductsHandler } from "./getAllProducts";

describe("getAllProducts Handler", () => {
  jest.spyOn(winstonLogger, "logRequest").mockImplementation(jest.fn);
  const mockRepository: ProductServiceInterface = {
    getProductById: jest.fn(),
    getAllProducts: jest.fn(),
    create: jest.fn(),
  };
  const handler = getAllProductsHandler(mockRepository);
  const spyRepository = jest.spyOn(mockRepository, "getAllProducts");

  beforeEach(() => {
    spyRepository.mockClear();
  });

  it("should return 200 if products returned", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
    };

    spyRepository.mockResolvedValue([
      {
        count: 4,
        description:
          "Improving the Design of Existing Code ”shed light on the refactoring process, describing the principles and best practices for its implementation.",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 2.4,
        title: "Refactoring by M. Fowler",
      },
    ]);

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual([
      {
        count: 4,
        description:
          "Improving the Design of Existing Code ”shed light on the refactoring process, describing the principles and best practices for its implementation.",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 2.4,
        title: "Refactoring by M. Fowler",
      },
    ]);
  });

  it("should return 500 if internal server error", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
    };

    spyRepository.mockRejectedValue({ message: "Internal server error" });

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal server error",
    });
  });
});
