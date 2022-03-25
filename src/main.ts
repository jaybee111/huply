import './assets/css/style.scss';
import HuplyOptionsInterface from "./interfaces/HuplyOptionsInterface";
import {isElement, isObject} from "./helpers/TypeHelper";
import WrapperComponent from "./components/WrapperComponent";
import de from "./lang/de";
import en from "./lang/en";
import AppStore from "./store/AppStore";
import { CustomWindowInterface } from "./interfaces/CustomWindowInterface";
import FileService from "./services/FileService";
declare let window: CustomWindowInterface;

// eslint-disable-next-line no-unused-vars
export default class Huply {

    public options?: HuplyOptionsInterface;
    public el: HTMLElement | null;
    private store: AppStore;

    public constructor(el: HTMLElement, options?: HuplyOptionsInterface) {
        if(!isElement(el)) {
            throw new Error('Selected element is not type of "Element". Current type: '+ typeof el);
        }

        this.el = el;

        // Initialize store
        this.store = new AppStore();

        // Parse options
        this.options = this.parseOptions(options);

        // Set options to store
        if(this.options) {
            this.store.setOptions(this.options);
        }

        // Validate options
        this.validateOptions(this.options);

        // Available Translations
        const defaultTranslations = {
            'de': de,
            'en': en,
        };

        // Set translations
        // Check if translations set
        // * via options global window object
        // * via options attribute
        if(isObject(window.huplyTranslations)) {
            this.store.setTranslations(window.huplyTranslations);
        } else {
            const lang = document.querySelector('html')?.getAttribute('lang');
            if(lang === 'en' || lang === 'de') {
                // @ts-ignore
                window.huplyTranslations = defaultTranslations[this.options.lang];
                // @ts-ignore
                this.store.setTranslations(defaultTranslations[this.options.lang]);
            } else {
                window.huplyTranslations = defaultTranslations['en'];
                this.store.setTranslations(defaultTranslations['en']);
            }
        }

        return this;
    }

    init() {
        // Render Layout
        // Replace input with wrapper
        if(this.el) {
            const wrapper = new WrapperComponent(this.el, this.store).render();
            if(this.el?.parentNode) {
                this.el.parentNode.replaceChild(wrapper, this.el);
            }

            // Get the new generated input element
            this.el = wrapper.querySelector(this.el.tagName);
        }

        // Add preloaded files
        if(this.options?.preloadedFiles?.length) {
            const fileService = new FileService(this.store);
            this.options.preloadedFiles.forEach((fileItem) => {
                if(fileItem.url) {
                    fileService.getBlobFromUrl(fileItem.url).then((blob) => {
                        fileService.generateFileItem(new File([blob], fileItem.name)).then((newItem) => {
                            this.store.addFileItem( newItem);
                            newItem.status = 'preloaded';
                            this.store.updateFileItem( newItem);
                        });
                    });
                }
            });
        }

        return this;
    }

    parseOptions(options: HuplyOptionsInterface | undefined): HuplyOptionsInterface {

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

    validateOptions(options: HuplyOptionsInterface) {
        // Check for uploadUrl existence
        if(!options.uploadUrl || options.uploadUrl.length === 0) {
            throw new Error('Option "uploadUrl" not set');
        }

        // Check for deleteUrl existence
        if(!options.deleteUrl || options.deleteUrl.length === 0) {
            throw new Error('Option "deleteUrl" not set');
        }
    }

    on(eventName: string, listener: any) {
        this.store.events.subscribe(eventName, listener);
    }
}
