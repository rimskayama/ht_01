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
    videos: []
};
const errorsObject = { errorsMessages: [] };
const errorsArray = errorsObject.errorsMessages;
const titleError = {
    message: "error",
    field: "title"
};
const authorError = {
    message: "error",
    field: "author"
};
const availableResolutionsError = {
    message: "error",
    field: "availableResolutions"
};
const canBeDownloadedError = {
    message: "error",
    field: "canBeDownloaded",
};
const minAgeRestrictionError = {
    message: "error",
    field: "minAgeRestriction",
};
const publicationDateError = {
    message: "error",
    field: "publicationDate",
};
const today = new Date().toISOString();
let publicationDate = new Date(today);
publicationDate.setDate(publicationDate.getDate() + 1);
const tomorrow = publicationDate.toISOString();
const checkResolution = (arr1, arr2) => arr2.every(r => arr1.includes(r));
exports.videosRouter = (0, express_1.Router)({});
//GET
exports.videosRouter.get("/", (req, res) => {
    let foundVideos = db.videos;
    if (req.query.title) {
        foundVideos = foundVideos.filter((v) => v.title.indexOf(req.query.title) > -1);
    }
    res.status(200).json(foundVideos);
});
//GET WITH URI
exports.videosRouter.get("/:id", (req, res) => {
    const foundVideo = db.videos.find((c) => c.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    }
    res.json(foundVideo);
});
//POST
exports.videosRouter.post("/", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const createdVideo = {
        id: +new Date(),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: today,
        publicationDate: tomorrow,
        availableResolutions: availableResolutions ? availableResolutions : null,
    };
    //validation
    while (errorsArray.length > 0) {
        errorsArray.splice(0, errorsArray.length);
    }
    if (!title || title.length > 40) {
        errorsArray.push(titleError);
    }
    if (!author || author.length > 20) {
        errorsArray.push(authorError);
    }
    if (!availableResolutions || !checkResolution(Resolutions, availableResolutions)) {
        errorsArray.push(availableResolutionsError);
    }
    if (errorsArray.length === 0) {
        db.videos.push(createdVideo);
        res.status(201).send(createdVideo);
        return;
    }
    else
        res.status(400).send(errorsObject);
});
//PUT
exports.videosRouter.put("/:id", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;
    let foundVideo = db.videos.find((c) => c.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    }
    //validation
    while (errorsArray.length > 0) {
        errorsArray.splice(0, errorsArray.length);
    }
    if (!title || title.length > 40) {
        errorsArray.push(titleError);
    }
    if (!author || author.length > 20) {
        errorsArray.push(authorError);
    }
    if (canBeDownloaded && typeof canBeDownloaded !== 'boolean') {
        errorsArray.push(canBeDownloadedError);
    }
    if (minAgeRestriction && (1 > minAgeRestriction || minAgeRestriction > 18)) {
        errorsArray.push(minAgeRestrictionError);
    }
    if (!availableResolutions || !checkResolution(Resolutions, availableResolutions)) {
        errorsArray.push(availableResolutionsError);
    }
    if (publicationDate && typeof publicationDate !== 'string') {
        errorsArray.push(publicationDateError);
    }
    if (errorsArray.length === 0) {
        foundVideo.title = title;
        foundVideo.author = author;
        foundVideo.canBeDownloaded = canBeDownloaded || foundVideo.canBeDownloaded;
        foundVideo.minAgeRestriction = foundVideo.minAgeRestriction || minAgeRestriction;
        foundVideo.publicationDate = foundVideo.publicationDate || tomorrow;
        foundVideo.availableResolutions = availableResolutions || foundVideo.availableResolutions;
        res.status(204).send(foundVideo);
    }
    else
        res.status(400).send(errorsObject);
});
//DELETE
exports.videosRouter.delete("/:id", (req, res) => {
    for (let i = 0; i < db.videos.length; i++) {
        if (db.videos[i].id === +req.params.id) {
            db.videos.splice(i, 1);
            res.sendStatus(204);
            return;
        }
    }
    res.sendStatus(404);
});
exports.videosRouter.delete("/", (req, res) => {
    while (db.videos.length > 0) {
        db.videos.splice(0, db.videos.length);
    }
    res.sendStatus(204);
});
