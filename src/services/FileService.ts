import FileItemInterface from "../interfaces/FileItemInterface";
import {generateUniqueId} from "../helpers/OutputHelper";
import AppStore from "../store/AppStore";
import HttpRequestService from "./HttpRequestService";
import PreloadedFileItemInterface from "../interfaces/PreloadedFileItemInterface";

export default class FileService {

    private store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    generateFileItemFromFile(file: File): Promise<FileItemInterface> {
        return new Promise<FileItemInterface>((resolve) => {
            let fileItem: FileItemInterface = {
                id: generateUniqueId(),
                name: file.name,
                size: file.size ?? 0,
                sizeMb: file.size ? (file.size / 1024 / 1024) : 0,
                sizeKb: file.size ? Number((file.size / 1024).toFixed(0)) : 0,
                status: 'waiting',
                uploadProcess: 0,
                data: file,
            }

            // Get data url of image
            if (
                this.checkIfIsImage(file.name)
                && fileItem.size
                && fileItem.size <= this.store.maxSizeImageView
            ) {
                this.getDataUrlFromFile(file).then((dataUrl) => {
                    fileItem.url = dataUrl;
                    resolve(fileItem);
                });
            } else  {
                resolve(fileItem);
            }
        });
    }

    generateFileItemFromPreloaded(file: PreloadedFileItemInterface): Promise<FileItemInterface> {
        return new Promise<FileItemInterface>((resolve) => {
            let fileItem: FileItemInterface = {
                id: generateUniqueId(),
                name: file.name,
                size: file.size ?? 0,
                sizeMb: file.size ? (file.size / 1024 / 1024) : 0,
                sizeKb: file.size ? Number((file.size / 1024).toFixed(0)) : 0,
                uploadProcess: 0,
                status: 'preloaded'
            }

            // Get data url of image
            if (
                this.checkIfIsImage(file.name)
                && fileItem.size
                && fileItem.size <= this.store.maxSizeImageView
                && file.url
            ) {
                this.getBlobFromUrl(file.url).then((blob) => {
                    this.getDataUrlFromFile(blob).then((dataUrl) => {
                        fileItem.url = dataUrl;
                        resolve(fileItem);
                    });
                });
            } else  {
                resolve(fileItem);
            }
        });
    }

    getDataUrlFromFile(file: File | Blob): Promise<string> {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.addEventListener("load", function () {
                // @ts-ignore
                resolve(reader.result);
            }, false);
        });
    }

    getBlobFromUrl(url: string): Promise<Blob> {

        return new Promise<Blob>((resolve, reject) => {
            const request = new HttpRequestService(this.store).request('GET', url);
            request.responseType = 'blob';
            request.send();
            request.addEventListener('load', () => {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(false);
                }
            });
        });
    }

    checkIfIsImage(filename: string): boolean {
        const splittedFilename = filename.split('.');
        const imgExt = this.store.imgExt;

        return imgExt.includes('.'+splittedFilename[splittedFilename.length - 1]);
    }
}
