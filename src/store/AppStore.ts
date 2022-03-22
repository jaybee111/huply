import PubSub from "./PubSub";
import FileItemInterface from "../interfaces/FileItemInterface";
import FileDropzoneComponent from "../components/FileDropzoneComponent";
import FileListComponent from "../components/FileListComponent";
import HuplyOptionsInterface from "../interfaces/HuplyOptionsInterface";
import FileDropzoneSmallComponent from "../components/FileDropzoneSmallComponent";
import HttpRequestService from "../services/HttpRequestService";

class AppStore {
    events: PubSub;
    files: Array<FileItemInterface>;
    components: {
        input?: HTMLInputElement,
        dropzone?: HTMLElement,
        fileList?: HTMLElement
    };
    translations: Object;
    options: HuplyOptionsInterface;
    maxSizeImageView: number;
    imgExt: Array<string>;

    constructor() {
        this.events = new PubSub();
        this.components = {};
        this.files = [];
        this.translations = {};
        this.options = {
            allowedFileTypes: [],
            multiple: false,
            uploadUrl: '',
            dropzoneTheme: 'lg'
        };
        this.maxSizeImageView = 2000000;
        this.imgExt = ['.jpg', '.jpeg', '.png'];
    }

    addFileItem(fileItem: FileItemInterface) {
        if (
            !this.options.multiple &&
            this.files.length
        ) {
            this.files.forEach((fileItem) => {
               this.deleteFileItem(fileItem);
            });
        }
        this.files.push(fileItem);
        this.events.publish('fileAdded', fileItem);
    }

    updateFileItem(fileItem: FileItemInterface) {
        const fileIndex = this.files.findIndex((findItem) => findItem.id === fileItem.id);
        if(fileIndex !== -1) {
            this.files[fileIndex] = fileItem;
            this.events.publish('fileItemUpdate', fileItem);

            // Check if file is uploaded
            if(fileItem.status === 'uploaded') {
                this.events.publish('fileUploaded', fileItem);

                // Check if all files are uploaded
                if(this.getFilesUploading().length === 0) {
                    this.events.publish('filesUploaded', fileItem);
                }
            }
        }
    }

    deleteFileItem(fileItem: FileItemInterface) {
        if(this.options.deleteUrl && fileItem.status === 'uploaded') {
            let request = new HttpRequestService(this).request('DELETE', this.options.deleteUrl.replace('{{filename}}', encodeURI(fileItem.name)));
            request.setRequestHeader('accept', 'application/json');

            let data = new FormData();
            data.append('filename', fileItem.name);
            request.send(data);

            // request finished event
            request.addEventListener('load', () => {
                if(request.status === 200) {
                    this.files = this.files.filter((item) => fileItem.id !== item.id);

                    fileItem.status = 'deleted';
                    this.events.publish('fileDeleted', fileItem);
                } else {
                    fileItem.status = 'error';
                    this.events.publish('fileItemUpdate', fileItem);
                }
            });
        } else {
            fileItem.status = 'deleted';
            this.events.publish('fileDeleted', fileItem);
        }
    }

    getCategorizedFiles() {
        return {
            uploaded: this.getFilesUploaded(),
            preloaded: this.getFilesPreloaded(),
            deleted: this.getFilesDeleted(),
        };
    }

    getFilesDeleted() {
        return this.files.filter((item) => item.status === 'deleted');
    }

    getFilesPreloaded() {
        return this.files.filter((item) => item.status === 'preloaded');
    }

    getFilesUploaded() {
        return this.files.filter((item) => item.status === 'uploaded');
    }

    getFilesWaiting() {
        return this.files.filter((item) => item.status === 'waiting');
    }

    getFilesUploading() {
        return this.files.filter((item) => item.status === 'uploading');
    }

    setComponent(key: string, component: FileListComponent | FileDropzoneComponent | FileDropzoneSmallComponent | Node) {
        // @ts-ignore
        this.components[key] = component;
    }

    setTranslations(translations: Object) {
        this.translations = translations
    }

    setOptions(options: HuplyOptionsInterface) {
        this.options = options;
    }
}

export default AppStore;
