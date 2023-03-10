export type CreateVideoInputModel = {
    /**
     * Video title
     */
    title: string;

    /**
     * Video author
     */
    author: string;

    id: number;
    canBeDownloaded: null | boolean;
    minAgeRestriction: null | number;
    createdAt: null | string;
    publicationDate: null | string;
    availableResolutions: string[];

}