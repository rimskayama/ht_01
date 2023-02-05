"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
describe("/videos", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete("/__test__/data");
    }));
    //GET
    it("should return 200 and db", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).get("/videos").expect(200, [
            {
                "id": 0,
                "title": "string",
                "author": "string",
                "canBeDownloaded": true,
                "minAgeRestriction": null,
                "createdAt": "2023-02-01T18:24:57.804Z",
                "publicationDate": "2023-02-01T18:24:57.804Z",
                "availableResolutions": [
                    "P144"
                ]
            }
        ]);
    }));
    it("should return 404 for not existing video", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).get("/videos/1").expect(404);
    }));
});
