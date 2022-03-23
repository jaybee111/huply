import AppStore from "../store/AppStore";
import FileItemInterface from "../interfaces/FileItemInterface";
import HttpRequestService from "./HttpRequestService";

export default class UploadService {
    private store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    upload() {
        const filesWaiting = this.store.getFilesWaiting();
        if(filesWaiting.length) {
            filesWaiting.forEach((fileItem) => {
                // Set uploading status
                fileItem.status = 'uploading';
                fileItem.uploadProcess = 0;
                this.store.updateFileItem(fileItem);

                if(this.store.options.chunkSize) {
                    this.sendChunkedFile(fileItem, 0);
                } else {
                    this.sendFile(fileItem);
                }
            });
        }
    }

    sendChunkedFile(fileItem: FileItemInterface, start: number) {

        if(this.store.options.chunkSize && fileItem.size && fileItem.data) {
            // Slicing file
            const sliceSize = this.store.options.chunkSize * 1000 * 1024;
            const sliceEnd = start + sliceSize;
            const chunkEnd = Math.min(sliceEnd , fileItem.size);
            const chunk = fileItem.data.slice(start, chunkEnd);
            const nextSlice = sliceEnd+1;

            // Check if upload is complete
            let request = new HttpRequestService(this.store).request('POST', this.store.options.uploadUrl);
            request.setRequestHeader('accept', 'application/json');
            const contentRange = "bytes "+ start+"-"+ chunkEnd+"/"+fileItem.size;
            request.setRequestHeader("Content-Range",contentRange);

            // request finished event
            request.addEventListener('load', () => {
                if(request.status === 200) {
                    if(request.response) {
                        const resp = JSON.parse(request.response);
                        if(resp.filename) {
                            fileItem.name = resp.filename;
                        }
                    }

                    if(fileItem.size) {
                        fileItem.uploadProcess = Math.min(Math.ceil((sliceEnd / fileItem.size) * 100), 100);
                    }

                    if(chunkEnd === fileItem.size) {
                        fileItem.status = 'uploaded';
                        this.store.updateFileItem(fileItem);
                        this.upload();
                    } else {
                        this.store.updateFileItem(fileItem);
                        this.sendChunkedFile(fileItem, nextSlice);
                    }

                } else {
                    fileItem.status = 'error';
                    this.store.updateFileItem(fileItem);
                    this.upload();
                }
            });

            let data = new FormData();
            data.append('file', chunk, fileItem.name);
            if(this.store.options?.maxFileSize) {
                // @ts-ignore
                data.append('max_file_size', this.store.options.maxFileSize * 1024);
            }

            request.send(data);
        }
    }

    sendFile(fileItem: FileItemInterface) {
        fileItem.status = 'uploading';
        fileItem.uploadProcess = 0;
        this.store.updateFileItem(fileItem);

        return new Promise((resolve, reject) => {
            let request = new HttpRequestService(this.store).request('POST', this.store.options.uploadUrl);
            request.setRequestHeader('accept', 'application/json');

            // upload progress event
            request.upload.addEventListener('progress', (e) => {
                // upload progress as percentage
                fileItem.uploadProcess = (e.loaded / e.total)*100;
                this.store.updateFileItem(fileItem);
            });

            // request finished event
            request.addEventListener('load', () => {
                if(request.status === 200) {
                    resolve(request.response);
                    if(request.response) {
                        const resp = JSON.parse(request.response);
                        if(resp.filename) {
                            fileItem.name = resp.filename;
                        }
                    }
                    fileItem.status = 'uploaded';
                    this.store.updateFileItem(fileItem);
                    this.upload();
                } else {
                    reject(request.response);
                    fileItem.status = 'error';
                    this.store.updateFileItem(fileItem);
                    this.upload();
                }
            });

            let data = new FormData();
            if(fileItem.data) {
                data.append('file', fileItem.data);
            }
            if(this.store.options?.maxFileSize) {
                // @ts-ignore
                data.append('max_file_size', this.store.options.maxFileSize * 1024);
            }

            request.send(data);
        });
    }

}
