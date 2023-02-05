"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete("/all-data", (req, res) => {
    while (db.videos.length > 0) {
        db.videos.splice(0, db.videos.length);
    }
    res.sendStatus(204);
});
