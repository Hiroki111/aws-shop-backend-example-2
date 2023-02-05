import { winstonLogger } from "../../libs/winstonLogger";
import { ProductServiceInterface } from "../../models/product-service-interface";
import { createProductHandler } from "./createProduct";

describe("createProduct Handler", () => {
  jest.spyOn(winstonLogger, "LOG").mockImplementation(jest.fn);
  jest.spyOn(winstonLogger, "ERROR").mockImplementation(jest.fn);
  const mockRepository: ProductServiceInterface = {
    getProductById: jest.fn(),
    getAllProducts: jest.fn(),
    create: jest.fn(),
  };
  const handler = createProductHandler(mockRepository);
  const spyRepository = jest.spyOn(mockRepository, "create");

  beforeEach(() => {
    spyRepository.mockClear();
  });

  it("should return 200 if product created", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "test",
        description: "test",
        price: 2,
        count: 3,
      }),
    };
    spyRepository.mockResolvedValue({
      id: "test",
      title: "test",
      description: "test",
      price: 2,
      count: 3,
    });
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      id: "test",
      title: "test",
      description: "test",
      price: 2,
      count: 3,
    });
  });

  it("should return 400 if no product created", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "test",
        description: "test",
        price: null,
        count: null,
      }),
    };

    spyRepository.mockRejectedValue({});

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: `Could not create a product with payload ${event.body}`,
    });
  });

  it("should return 500 if internal server error", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      body: {} as any,
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Unexpected token o in JSON at position 1",
    });
  });
});
