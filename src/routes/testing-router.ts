import { Request, Response, Router } from "express";
export const testingRouter = Router({});


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

testingRouter.delete("/all-data", (req: Request, res: Response) => {
    while (db.videos.length > 0) {
        db.videos.splice(0, db.videos.length);
    }
    res.sendStatus(204)
});