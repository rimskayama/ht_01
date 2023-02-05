
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

const today =  new Date().toISOString();
let publicationDate = new Date(today)
publicationDate.setDate(publicationDate.getDate() + 1);
const tomorrow = publicationDate.toISOString();
const checkResolution = (arr1: string[], arr2: string[]) => arr2.every(r => arr1.includes(r));

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
videosRouter.post("/", (req: RequestWithBody<CreateVideoInputModel>, res: Response) => {

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
        createdAt: today,
        publicationDate: tomorrow,
        availableResolutions: availableResolutions || ["P720"],
    };


    if (author.length > 20 || (title.length > 40) || (1 < minAgeRestriction && minAgeRestriction > 18) || checkResolution (availableResolutions, Resolutions) ) {
        res.status(400).send(errMessage);
    } else {
        db.videos.push(createdVideo);
        res.status(201).json(createdVideo);
    }

})

//PUT
videosRouter.put(
    "/videos/:id",
    (
        req: RequestWithParamsAndBody<URIParamsVideoIDModel, UpdateVideoInputModel>,
        res
    ) => {

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
        } else if
        (author.length > 20
            || (title.length > 40)
            || (minAgeRestriction !== null && 1 <= minAgeRestriction && minAgeRestriction <= 18)
            || checkResolution (availableResolutions, Resolutions) ) {
            res.status(400).send(errMessage);
        } else {
            const updatedVideo: VideosType = {
                id: +new Date(),
                title: title,
                author: author,
                canBeDownloaded: canBeDownloaded || false,
                minAgeRestriction: minAgeRestriction || null,
                createdAt: today,
                publicationDate: publicationDate || tomorrow,
                availableResolutions: availableResolutions || ["P720"],
            };
            res.sendStatus(204).send(updatedVideo)

        }
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