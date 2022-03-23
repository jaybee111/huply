import PreloadedFileItemInterface from "./PreloadedFileItemInterface";

interface HuplyOptionsInterface {
    multiple?: boolean,
    dropzoneTheme: string,
    maxConcurrentUploads?: number,
    maxFileSize?: number,
    uploadUrl: string,
    deleteUrl?: string,
    headers?: object,
    withCredentials?: boolean,
    preloadedFiles?: PreloadedFileItemInterface[],
    lang?: string,
    translations?: object,
    allowedFileTypes: Array<string>,
    chunkSize?: number
}

export default HuplyOptionsInterface;
