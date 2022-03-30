import HuplyOptionsInterface from "../interfaces/HuplyOptionsInterface";
import {isObject} from "../helpers/TypeHelper";

export default class OptionsService {
    private el: HTMLElement;

    constructor(el: HTMLElement) {
        this.el = el;
    }

    public parseOptions(options: HuplyOptionsInterface | undefined): HuplyOptionsInterface {

        // Set default options
        let defaultOptions: HuplyOptionsInterface = {
            multiple: false,
            maxConcurrentUploads: 3,
            maxFileSize: 5,
            lang: 'de',
            uploadUrl: '',
            deleteUrl: '',
            allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.zip', '.mp4'],
            dropzoneTheme: 'lg'
        };

        // Merge default options with individual options
        if(isObject(options)) {
            defaultOptions = {...defaultOptions, ...options};
        }

        // Check for data-attributes
        defaultOptions.multiple = this.el?.hasAttribute('multiple');

        const dropzoneTheme = this.el?.getAttribute('data-dropzone-theme');
        if(dropzoneTheme) {
            defaultOptions.dropzoneTheme = dropzoneTheme;
        }

        const maxConcurrentUploads = this.el?.getAttribute('data-max-concurrent-uploads');
        if(maxConcurrentUploads) {
            defaultOptions.maxConcurrentUploads = Number(maxConcurrentUploads);
        }

        const maxFileSize = this.el?.getAttribute('data-max-file-size');
        if(maxFileSize) {
            defaultOptions.maxFileSize = Number(maxFileSize);
        }

        const uploadUrl = this.el?.getAttribute('data-upload-url');
        if(uploadUrl) {
            defaultOptions.uploadUrl = uploadUrl;
        }

        const deleteUrl = this.el?.getAttribute('data-delete-url');
        if(deleteUrl) {
            defaultOptions.deleteUrl = deleteUrl;
        }

        const headers = this.el?.getAttribute('data-headers');
        if(headers) {
            defaultOptions.headers = JSON.parse(headers);
        }

        const preloadedFiles = this.el?.getAttribute('data-preloaded-files');
        if(preloadedFiles) {
            try {
                const decodedFiles = atob(preloadedFiles);
                defaultOptions.preloadedFiles = JSON.parse(decodedFiles);
            } catch {
                defaultOptions.preloadedFiles = [];
            }
        }

        const lang = this.el?.getAttribute('data-lang');
        if(lang) {
            defaultOptions.lang = lang;
        }

        const translations = this.el?.getAttribute('data-translations');
        if(translations) {
            defaultOptions.translations = JSON.parse(translations);
        }

        const allowedFileTypes = this.el?.getAttribute('accept');
        if(allowedFileTypes) {
            defaultOptions.allowedFileTypes = allowedFileTypes.split(',');
        }

        const chunkSize = this.el?.getAttribute('data-chunk-size');
        if(chunkSize) {
            defaultOptions.chunkSize = Number(chunkSize);
        }

        return defaultOptions;
    }

    public validateOptions(options: HuplyOptionsInterface) {
        // Check for uploadUrl existence
        if(!options.uploadUrl || options.uploadUrl.length === 0) {
            throw new Error('Option "uploadUrl" not set');
        }

        // Check for deleteUrl existence
        if(!options.deleteUrl || options.deleteUrl.length === 0) {
            throw new Error('Option "deleteUrl" not set');
        }
    }
}
