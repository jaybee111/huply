import AppStore from "../store/AppStore";
import FileDropzoneComponent from "./FileDropzoneComponent";
import FileItemInterface from "../interfaces/FileItemInterface";

class FileDropzoneSmallComponent extends FileDropzoneComponent {
    protected baseCssClass = 'huply-dropzone-sm';

    constructor(store: AppStore) {
        super(store);

        if(!this.store.options.multiple) {
            store.events.subscribe('fileItemUpdate', (fileItem: FileItemInterface) => {
                this.updateWrapper(fileItem);
            });

            store.events.subscribe('fileDeleted', (fileItem: FileItemInterface) => {
                this.updateWrapper(fileItem);
            });
        }
    }

    getTemplate(): HTMLElement | void {
        if(this.dropzone) {
            // Wrapper
            const dropzoneWrapper = this.getWrapper();

            // Headline
            dropzoneWrapper.appendChild(this.getHeadline());

            // Subline
            dropzoneWrapper.appendChild(this.getSubline());

            // Icon upload
            dropzoneWrapper.appendChild(this.getUploadIcon());

            // Icon delete
            dropzoneWrapper.appendChild(this.getDeleteIcon());

            this.dropzone.appendChild(dropzoneWrapper);

            return this.dropzone;
        }
    }


    getWrapper() {
        this.descWrapper = document.createElement('div');
        this.descWrapper.classList.add('huply-dropzone-sm-wrapper');

        return this.descWrapper;
    }

    updateWrapper(fileItem: FileItemInterface) {
        if(this.descWrapper) {
            this.descWrapper.classList.remove('is-uploading');
            this.descWrapper.classList.remove('is-preloaded');
            this.descWrapper.classList.remove('is-error');
            this.descWrapper.classList.remove('is-uploaded');

            if(fileItem.status === 'uploading') {
                this.descWrapper.classList.add('is-uploading');
            } else if(fileItem.status === 'preloaded') {
                this.descWrapper.classList.add('is-preloaded');
            } else if(fileItem.status === 'error') {
                this.descWrapper.classList.add('is-error');
            } else if(fileItem.status === 'uploaded') {
                this.descWrapper.classList.add('is-uploaded');
            }
        }
    }
}

export default FileDropzoneSmallComponent;
