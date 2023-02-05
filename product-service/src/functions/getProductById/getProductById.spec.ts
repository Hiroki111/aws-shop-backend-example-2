import { ProductServiceInterface } from "../../models/product-service-interface";
import { getProductByIdHandler } from "./getProductById";
import { winstonLogger } from "../../libs/winstonLogger";

describe("getProductById Handler", () => {
  jest.spyOn(winstonLogger, "LOG").mockImplementation(jest.fn);
  jest.spyOn(winstonLogger, "ERROR").mockImplementation(jest.fn);
  const mockRepository: ProductServiceInterface = {
    getProductById: jest.fn(),
    getAllProducts: jest.fn(),
    create: jest.fn(),
  };
  const handler = getProductByIdHandler(mockRepository);
  const spyRepository = jest.spyOn(mockRepository, "getProductById");

  beforeEach(() => {
    spyRepository.mockClear();
  });

  it("should return 200 if product returned", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
    };
    spyRepository.mockResolvedValue({
      count: 4,
      description:
        "Improving the Design of Existing Code ”shed light on the refactoring process, describing the principles and best practices for its implementation.",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      price: 2.4,
      title: "Refactoring by M. Fowler",
    });

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      product: {
        count: 4,
        description:
          "Improving the Design of Existing Code ”shed light on the refactoring process, describing the principles and best practices for its implementation.",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 2.4,
        title: "Refactoring by M. Fowler",
      },
    });
  });

  it("should return 404 if no product returned", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      pathParameters: { productId: "test" },
    };

    spyRepository.mockResolvedValue(undefined);

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Product with id test not found",
    });
  });

  it("should return 500 if server internal error", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      pathParameters: { productId: "1" },
    };

    spyRepository.mockRejectedValue({ message: "Internal server error" });

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal server error",
    });
  });
});
