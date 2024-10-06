import { Products, Clothing, Appliances } from "../../data/products-class.js";

describe("Test Suite: Products-class", () => {
    let product;
    beforeEach(() => {
        product = new Products({
            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
            rating: {
              stars: 4.5,
              count: 87
            },
            priceCents: 1090,
            keywords: [
              "socks",
              "sports",
              "apparel"
            ]
          });
    });

    it("Has a correct properties:", () => {
        expect(product.id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(product.image).toEqual("images/products/athletic-cotton-socks-6-pairs.jpg");
        expect(product.name).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");
        expect(product.rating).toEqual({
            stars: 4.5,
            count: 87
          });
        expect(product.priceCents).toEqual(1090);
    });

    it("getStarURL:", () => {
        expect(product.getStarURL()).toEqual('images/ratings/rating-45.png');
    });

    it("getPrice:", () => {
        expect(product.getPrice()).toEqual('$10.90');
    });

    it("getSizeChartLink:", () => {
        expect(product.getSizeChartLink()).toEqual('');
    });
});