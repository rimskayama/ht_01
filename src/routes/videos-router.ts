
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

type availableResolutions = string[];

const db: { videos: VideosType[] } = {
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
    ]}

const errMessage = {
    "errorsMessages": [
        {
            "message": "string",
            "field": "string"
        }
    ]
}

const currentDate =  new Date().toISOString();

export const videosRouter = Router({})

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
        res.json(foundVideos)
    }
)

videosRouter.get(
    "/:id",
    (
        req: RequestWithParams<URIParamsVideoIDModel>,
        res: Response
    ) => {
        const foundVideo = db.videos.find((c) => c.id === +req.params.id);
        if (!foundVideo) {
            res.status(404).send(errMessage);
            return;
        }
        res.json(foundVideo);
    }
);

//POST
videosRouter.post("/", (req: RequestWithBody<CreateVideoInputModel>, res: Response<VideoViewModel>) => {

    const title = req.body.title;
    const author = req.body.author;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const availableResolutions = req.body.availableResolutions;

    const createdVideo: VideosType = {
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
})

//PUT
videosRouter.put(
    "/courses/:id",
    (
        req: RequestWithParamsAndBody<URIParamsVideoIDModel, UpdateVideoInputModel>,
        res
    ) => {
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
    }
);

//DELETE
videosRouter.delete(
    "/:id",
    (req: RequestWithParams<URIParamsVideoIDModel>, res) => {
        db.videos = db.videos.filter((c) => c.id !== +req.params.id);
        res.sendStatus(204);
    }
);