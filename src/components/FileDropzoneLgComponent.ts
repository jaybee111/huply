import AppStore from "../store/AppStore";
import FileDropzoneComponent from "./FileDropzoneComponent";

class FileDropzoneLgComponent extends FileDropzoneComponent{
    protected baseCssClass = 'huply-dropzone-lg';

    constructor(store: AppStore) {
        super(store);
    }

    getTemplate(): HTMLElement | void {

        if(this.dropzone) {
            // Delete icon
            this.dropzone.appendChild(this.getDeleteIcon());

            // Wrapper
            const dropzoneDescriptionWrapper = this.getDescriptionWrapper();

            // Icon
            dropzoneDescriptionWrapper.appendChild(this.getUploadIcon());

            // Headline
            dropzoneDescriptionWrapper.appendChild(this.getHeadline());

            // Subline
            dropzoneDescriptionWrapper.appendChild(this.getSubline());

            this.dropzone.appendChild(dropzoneDescriptionWrapper);

            return this.dropzone;
        }
    }
}

export default FileDropzoneLgComponent;
