"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const Resolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160",
];
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
const today = new Date().toISOString();
let publicationDate = new Date(today);
publicationDate.setDate(publicationDate.getDate() + 1);
const tomorrow = publicationDate.toISOString();
const checkResolution = (arr1, arr2) => arr2.every(r => arr1.includes(r));
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
        createdAt: today,
        publicationDate: tomorrow,
        availableResolutions: availableResolutions || ["P720"],
    };
    if (author.length > 20 || (title.length > 40) || (1 < minAgeRestriction && minAgeRestriction > 18) || checkResolution(availableResolutions, Resolutions)) {
        res.status(400).send(errMessage);
    }
    else {
        db.videos.push(createdVideo);
        res.status(201).json(createdVideo);
    }
});
//PUT
exports.videosRouter.put("/videos/:id", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    let canBeDownloaded = req.body.canBeDownloaded;
    let minAgeRestriction = req.body.minAgeRestriction;
    let publicationDate = req.body.publicationDate;
    const foundVideo = db.videos.find((c) => c.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    }
    else if (author.length > 20
        || (title.length > 40)
        || (minAgeRestriction !== null && 1 <= minAgeRestriction && minAgeRestriction <= 18)
        || checkResolution(availableResolutions, Resolutions)) {
        res.status(400).send(errMessage);
    }
    else {
        const updatedVideo = {
            id: +new Date(),
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded || false,
            minAgeRestriction: minAgeRestriction || null,
            createdAt: today,
            publicationDate: publicationDate || tomorrow,
            availableResolutions: availableResolutions || ["P720"],
        };
        res.sendStatus(204).send(updatedVideo);
    }
});
//DELETE
exports.videosRouter.delete("/:id", (req, res) => {
    db.videos = db.videos.filter((c) => c.id !== +req.params.id);
    res.sendStatus(204);
});
