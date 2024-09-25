import { moneyFormat } from "../../others/money-format.js";

describe("Test Suite: Money format conversion", () => {
    it("Convert cents to dollar", () => {
        expect(moneyFormat(2024)).toEqual('20.24');
    });

    it("Conversion with zero", () => {
        expect(moneyFormat(0)).toEqual('0.00');
    });

    it("Conversion with floating point value", () => {
        expect(moneyFormat(2000.5)).toEqual('20.01');
    });

    it("Rounds down to nearest cent", () => {
        expect(moneyFormat(2000.4)).toEqual('20.00');
    });
});