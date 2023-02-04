import express, { Request, Response } from "express";

import {videosRouter} from "./routes/videos-router";

export const app = express();
const port = 3002;

app.use('/videos', videosRouter )

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});