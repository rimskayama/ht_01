"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_router_1 = require("./routes/videos-router");
const testing_router_1 = require("./routes/testing-router");
exports.app = (0, express_1.default)();
const port = 3001;
exports.app.use(express_1.default.json());
exports.app.use("/testing", testing_router_1.testingRouter);
exports.app.use("/videos", videos_router_1.videosRouter);
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
