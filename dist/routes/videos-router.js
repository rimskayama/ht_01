"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db = {
    videos: [
        {
            "id": 0,
            "title": "string",
            "author": "string",
            "canBeDownloaded": true,
            "minAgeRestriction": null,
            "createdAt": "2023-02-01T18:24:57.804Z",
            "publicationDate": "2023-02-01T18:24:57.804Z",
            "availableResolutions": ["P144"]
        }
    ]
};
const errMessage = {
    "errorsMessages": [
        {
            "message": "string",
            "field": "string"
        }
    ]
};
const currentDate = new Date().toISOString();
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get("/", (req, res) => {
    let foundVideos = db.videos;
    if (req.query.title) {
        foundVideos = foundVideos.filter((v) => v.title.indexOf(req.query.title) > -1);
    }
    res.json(foundVideos);
});
exports.videosRouter.get("/:id", (req, res) => {
    const foundVideo = db.videos.find((c) => c.id === +req.params.id);
    if (!foundVideo) {
        res.status(404).send(errMessage);
        return;
    }
    res.json(foundVideo);
});
//POST
exports.videosRouter.post("/", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const availableResolutions = req.body.availableResolutions;
    const createdVideo = {
        id: +new Date(),
        title: title,
        author: author,
        canBeDownloaded: canBeDownloaded || false,
        minAgeRestriction: minAgeRestriction || null,
        createdAt: currentDate,
        publicationDate: currentDate,
        availableResolutions: availableResolutions || ["P720"],
    };
    db.videos.push(createdVideo);
    res.status(201).json(createdVideo);
});
//PUT
exports.videosRouter.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const foundVideo = db.videos.find((c) => c.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    }
    foundVideo.title = req.body.title;
    res.sendStatus(204);
});
//DELETE
exports.videosRouter.delete("/:id", (req, res) => {
    db.videos = db.videos.filter((c) => c.id !== +req.params.id);
    res.sendStatus(204);
});
