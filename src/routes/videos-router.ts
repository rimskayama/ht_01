
import {Response, Router} from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryVideosModel} from "../models/QueryVideosModel";
import {VideoViewModel} from "../models/VideoViewModel";
import {URIParamsVideoIDModel} from "../models/URIParamsVideoIDModel";
import {CreateVideoInputModel} from "../models/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";

type VideosType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: null | number;
    createdAt: string;
    publicationDate: string;
    availableResolutions: availableResolutions;
};

type availableResolutions = string[] | null;
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

const db: { videos: VideosType[] } = {
    videos: [ ]
}

const errorsObject = { errorsMessages: [] };
const errorsArray: errorMessageType[] = errorsObject.errorsMessages;

type errorMessageType = {
    message: string;
    field: string;
};


let errorsMessages: errorMessageType[] = [];
const titleError = {
            message: "error",
            field: "title"
        }

const authorError = {
            message: "error",
            field: "author"
        }

const availableResolutionsError = {
            message: "error",
            field: "availableResolutions"
        }
const canBeDownloadedError = {
    message: "error",
    field: "canBeDownloaded",
};

const minAgeRestrictionError = {
    message: "error",
    field: "minAgeRestriction",
};


const today =  new Date().toISOString();
let publicationDate = new Date(today);
publicationDate.setDate(publicationDate.getDate() + 1);
const tomorrow = publicationDate.toISOString();
const checkResolution = (arr1: string[], arr2: string[]) => arr2.every(r => arr1.includes(r));

export const videosRouter = Router({})

//GET
videosRouter.get(
    "/",
    (
        req: RequestWithQuery<QueryVideosModel>,
        res: Response<VideoViewModel[]>
    ) => {
        let foundVideos = db.videos;
        if (req.query.title) {
            foundVideos = foundVideos.filter(
                (v) => v.title.indexOf(req.query.title) > -1
            );
        }
        res.status(200).json(foundVideos)
    }
)

//GET WITH URI
videosRouter.get(
    "/:id",
    (
        req: RequestWithParams<URIParamsVideoIDModel>,
        res: Response
    ) => {
        const foundVideo = db.videos.find((c) => c.id === +req.params.id);
        if (!foundVideo) {
            res.sendStatus(404);
            return;
        }
        res.json(foundVideo);
    }
);

//POST
videosRouter.post(
    "/",
    (req: RequestWithBody<CreateVideoInputModel>, res: Response) => {

    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;

    const createdVideo: VideosType = {
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

        if (!availableResolutions || !checkResolution (Resolutions, availableResolutions)) {
            errorsArray.push(availableResolutionsError);
        }

        if (errorsArray.length === 0) {
            db.videos.push(createdVideo);
            res.status(201).send(createdVideo);
            return;
        } else res.status(400).send(errorsObject);
    })

//PUT
videosRouter.put(
    "/:id",
    (
        req: RequestWithParamsAndBody<URIParamsVideoIDModel, UpdateVideoInputModel>,
        res
    ) => {

        const title = req.body.title;
        const author = req.body.author;
        const availableResolutions = req.body.availableResolutions;
        const canBeDownloaded = req.body.canBeDownloaded;
        const minAgeRestriction = req.body.minAgeRestriction;

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
        if (minAgeRestriction && (1 > minAgeRestriction && minAgeRestriction > 18)) {
            errorsArray.push(minAgeRestrictionError);
        }
        if (availableResolutions && !checkResolution(Resolutions, availableResolutions)) {
            errorsArray.push(availableResolutionsError);
        }

        foundVideo = {
            id: foundVideo.id,
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded || foundVideo.canBeDownloaded,
            minAgeRestriction: minAgeRestriction || foundVideo.minAgeRestriction,
            createdAt: foundVideo.createdAt,
            publicationDate: tomorrow,
            availableResolutions: availableResolutions || foundVideo.availableResolutions,
        };

        if (errorsArray.length === 0) {
            db.videos.push(foundVideo);
            res.status(201).send(foundVideo);
            return;
        }
        res.status(400).send(errorsObject);

    })

//DELETE
videosRouter.delete(
    "/:id",
    (req: RequestWithParams<URIParamsVideoIDModel>, res) => {
        for (let i = 0; i < db.videos.length; i++) {
            if (db.videos[i].id === +req.params.id) {
                db.videos.splice(i, 1);
                res.sendStatus(204);
                return;
            }
        }
        res.sendStatus(404);
    });

videosRouter.delete("/", (req: RequestWithParams<URIParamsVideoIDModel>, res: Response) => {
    while (db.videos.length > 0) {
        db.videos.splice(0, db.videos.length);
    }
    res.sendStatus(204);
})

