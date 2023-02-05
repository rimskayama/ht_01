import express, { Request, Response } from "express";
import {videosRouter} from "./routes/videos-router";
import bodyParser from "body-parser";

export const app = express();
const port = 3001;

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/videos', videosRouter )

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});