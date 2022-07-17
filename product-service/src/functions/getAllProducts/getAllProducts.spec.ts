import { getAllProducts } from "../../../handler";

describe("getAllProducts Handler", () => {
  it("should pass with mocked get request", async () => {
    const event = {
      headers: { "Content-Type": "application/json" },
    };

    const response = await getAllProducts(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toBe(8);
  });
});
