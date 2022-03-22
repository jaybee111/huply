interface FileItemInterface {
    id: string,
    name: string,
    size?: number,
    sizeMb: number,
    sizeKb: number,
    status: string,
    statusMsg?: string,
    deleteUrl?: string,
    uploadProcess?: number,
    url?: string,
    data?: File,
    dataChunked?: []
}

export default FileItemInterface;
