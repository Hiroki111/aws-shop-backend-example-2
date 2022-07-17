import { getProductById } from "../../../handler";

describe("getProductById Handler", () => {
  it("should pass with mocked get request", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
    };

    const response = await getProductById(event);

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

  it("should return 500 code if params are undefined", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
    };

    const response = await getProductById(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Cannot read property 'productId' of undefined",
    });
  });

  it("should return 404 code if the product does not exist", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
      pathParameters: { productId: "1" },
    };

    const response = await getProductById(event);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Product not found",
    });
  });
});
