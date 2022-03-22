import AppStore from "../store/AppStore";
import {$t} from "../helpers/LangHelper";
import FileItemInterface from "../interfaces/FileItemInterface";
import UploadService from "../services/UploadService";
import FileValidationService from "../services/FileValidationService";
import FileService from "../services/FileService";

class FileDropzoneSmallComponent {
    private store: AppStore;
    private dropzone: HTMLElement | undefined;
    private headline: HTMLElement | undefined;
    private subline: HTMLElement | undefined;
    private uploadIcon: HTMLElement | undefined;
    private deleteIcon: HTMLElement | undefined;
    private descWrapper: HTMLElement | undefined;

    constructor(store: AppStore) {
        this.store = store;

        // Check if file is added and add new file item to list
        // Show list, if more than 1 file allowed
        if(!this.store.options.multiple) {
            store.events.subscribe('fileItemUpdate', (fileItem: FileItemInterface) => {
                this.updateHeadline(fileItem);
                this.updateSubline(fileItem);
                this.updateUploadIcon(fileItem);
                this.updateDeleteIcon(fileItem);
                this.updateWrapper(fileItem);
            });

            store.events.subscribe('fileDeleted', (fileItem: FileItemInterface) => {
                this.updateHeadline(fileItem);
                this.updateSubline(fileItem);
                this.updateUploadIcon(fileItem);
                this.updateDeleteIcon(fileItem);
                this.updateWrapper(fileItem);
            });
        }
    }

    render() {
        this.dropzone = document.createElement('div');
        this.dropzone.classList.add('huply-dropzone-sm');

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

        // Click event
        this.dropzone.addEventListener('click', () => {
            this.store.components.input?.click();
        });

        // Dragover
        this.dropzone.addEventListener('dragover', () => {
            this.dropzone?.classList.add('is-dragover');
        });

        // Dragleave
        this.dropzone.addEventListener('dragleave', () => {
            this.dropzone?.classList.remove('is-dragover');
        });

        // Drop
        this.dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            const uploadService = new UploadService(this.store);
            if(e.dataTransfer) {
                for (var i=0; i < e.dataTransfer.items.length; i++) {
                    const item = e.dataTransfer.items[i].getAsFile();
                    if(item) {
                        // Validate file
                        const validationService = new FileValidationService(this.store);
                        const validationMsg = validationService.isValidFile(item);
                        new FileService(this.store).generateFileItem(item).then((fileItem) => {
                            this.store.addFileItem(fileItem);

                            // Check for errors
                            if(validationMsg.length !== 0) {
                                fileItem.status = 'error';
                                fileItem.statusMsg = validationMsg.map((item) => item.msg).join(', ')
                                this.store.updateFileItem(fileItem);
                            }

                            uploadService.upload();
                        });
                    }
                }
            }
        });

        return this.dropzone;
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

    getDeleteIcon(): HTMLElement {
        this.deleteIcon = document.createElement('a');
        this.deleteIcon.setAttribute('href', '#');
        this.deleteIcon.classList.add('huply-dropzone-sm-icon-delete');
        this.deleteIcon.classList.add('is-hidden');
        this.deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M424 80C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H412.4L388.4 452.7C385.9 486.1 358.1 512 324.6 512H123.4C89.92 512 62.09 486.1 59.61 452.7L35.56 128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94L354.2 80H424zM177.1 48C174.5 48 171.1 49.34 170.5 51.56L151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1zM364.3 128H83.69L107.5 449.2C108.1 457.5 115.1 464 123.4 464H324.6C332.9 464 339.9 457.5 340.5 449.2L364.3 128z"/></svg>`;
        this.deleteIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const fileIndex = this.store.files.findIndex((currentItem) => this.deleteIcon?.getAttribute('data-file-id') == currentItem.id);
            if(fileIndex !== -1) {
                this.store.deleteFileItem(this.store.files[fileIndex]);
            }
        });

        return this.deleteIcon;
    }

    updateDeleteIcon(fileItem: FileItemInterface) {
        if(this.deleteIcon) {
            if(fileItem.status === 'uploaded' || fileItem.status === 'preloaded') {
                this.deleteIcon.classList.remove('is-hidden');
                this.deleteIcon.setAttribute('data-file-id', fileItem.id);
            } else {
                this.deleteIcon.classList.add('is-hidden');
            }
        }
    }

    getUploadIcon(): HTMLElement {
        this.uploadIcon = document.createElement('div');
        this.uploadIcon.classList.add('huply-dropzone-sm-icon-upload');
        this.uploadIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M303 175C312.4 165.7 327.6 165.7 336.1 175L416.1 255C426.3 264.4 426.3 279.6 416.1 288.1C407.6 298.3 392.4 298.3 383 288.1L344 249.9V384C344 397.3 333.3 408 320 408C306.7 408 296 397.3 296 384V249.9L256.1 288.1C247.6 298.3 232.4 298.3 223 288.1C213.7 279.6 213.7 264.4 223 255L303 175zM144 480C64.47 480 0 415.5 0 336C0 273.3 40.07 219.1 96 200.2V200C96 107.2 171.2 32 264 32C314.9 32 360.4 54.6 391.3 90.31C406.2 83.68 422.6 80 440 80C506.3 80 560 133.7 560 200C560 206.6 559.5 213 558.5 219.3C606.5 240.3 640 288.3 640 344C640 416.4 583.4 475.6 512 479.8V480H144zM264 80C197.7 80 144 133.7 144 200L144 234.1L111.1 245.5C74.64 258.7 48 294.3 48 336C48 389 90.98 432 144 432H506.6L509.2 431.8C555.4 429.2 592 390.8 592 344C592 308 570.4 276.9 539.2 263.3L505.1 248.4L511.1 211.7C511.7 207.9 512 204 512 200C512 160.2 479.8 128 440 128C429.5 128 419.6 130.2 410.8 134.2L378.2 148.7L354.9 121.7C332.8 96.08 300.3 80 263.1 80L264 80z"/></svg>`;

        return this.uploadIcon;
    }

    updateUploadIcon(fileItem: FileItemInterface) {
        if(this.uploadIcon) {
            if(fileItem.status === 'uploading' && fileItem.uploadProcess === 0) {
                this.uploadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M264 24C264 10.75 274.7 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C503.1 395.5 488.4 399.4 476.9 392.8C465.5 386.2 461.5 371.5 468.2 360C485.9 329.4 496 293.9 496 255.1C496 141.1 402.9 47.1 288 47.1C274.7 47.1 264 37.25 264 23.1V24z"/></svg>';
            } else if(fileItem.status === 'error') {
                this.uploadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 304c13.25 0 24-10.75 24-24v-128C280 138.8 269.3 128 256 128S232 138.8 232 152v128C232 293.3 242.8 304 256 304zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44C224.6 385.9 238.6 400 256 400s31.44-14.08 31.44-31.44C287.4 351.2 273.4 337.1 256 337.1z"/></svg>';
            } else if(fileItem.status === 'uploaded') {
                this.uploadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>';
            } else if(fileItem.status === 'deleted' && this.store.getFilesUploading().length === 0) {
                this.uploadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M303 175C312.4 165.7 327.6 165.7 336.1 175L416.1 255C426.3 264.4 426.3 279.6 416.1 288.1C407.6 298.3 392.4 298.3 383 288.1L344 249.9V384C344 397.3 333.3 408 320 408C306.7 408 296 397.3 296 384V249.9L256.1 288.1C247.6 298.3 232.4 298.3 223 288.1C213.7 279.6 213.7 264.4 223 255L303 175zM144 480C64.47 480 0 415.5 0 336C0 273.3 40.07 219.1 96 200.2V200C96 107.2 171.2 32 264 32C314.9 32 360.4 54.6 391.3 90.31C406.2 83.68 422.6 80 440 80C506.3 80 560 133.7 560 200C560 206.6 559.5 213 558.5 219.3C606.5 240.3 640 288.3 640 344C640 416.4 583.4 475.6 512 479.8V480H144zM264 80C197.7 80 144 133.7 144 200L144 234.1L111.1 245.5C74.64 258.7 48 294.3 48 336C48 389 90.98 432 144 432H506.6L509.2 431.8C555.4 429.2 592 390.8 592 344C592 308 570.4 276.9 539.2 263.3L505.1 248.4L511.1 211.7C511.7 207.9 512 204 512 200C512 160.2 479.8 128 440 128C429.5 128 419.6 130.2 410.8 134.2L378.2 148.7L354.9 121.7C332.8 96.08 300.3 80 263.1 80L264 80z"/></svg>';
            } else if(fileItem.status === 'preloaded') {
                this.uploadIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M454.7 288.1c-12.78-3.75-26.06 3.594-29.75 16.31C403.3 379.9 333.8 432 255.1 432c-66.53 0-126.8-38.28-156.5-96h100.4c13.25 0 24-10.75 24-24S213.2 288 199.9 288h-160c-13.25 0-24 10.75-24 24v160c0 13.25 10.75 24 24 24s24-10.75 24-24v-102.1C103.7 436.4 176.1 480 255.1 480c99 0 187.4-66.31 215.1-161.3C474.8 305.1 467.4 292.7 454.7 288.1zM472 16C458.8 16 448 26.75 448 40v102.1C408.3 75.55 335.8 32 256 32C157 32 68.53 98.31 40.91 193.3C37.19 206 44.5 219.3 57.22 223c12.84 3.781 26.09-3.625 29.75-16.31C108.7 132.1 178.2 80 256 80c66.53 0 126.8 38.28 156.5 96H312C298.8 176 288 186.8 288 200S298.8 224 312 224h160c13.25 0 24-10.75 24-24v-160C496 26.75 485.3 16 472 16z"/></svg>';
            }
        }
    }

    getHeadline(): HTMLElement {
        this.headline = document.createElement('p');
        this.headline.classList.add('huply-dropzone-sm-headline');
        this.headline.innerHTML = this.getHeadlineText();

        return this.headline;
    }

    getHeadlineText(): string {
        return `<strong>${this.store?.options.multiple ? $t('chooseFiles') : $t('chooseFile')}</strong>`;
    }

    updateHeadline(fileItem: FileItemInterface) {
        if(this.headline) {
            if(fileItem.status === 'deleted') {
                this.headline.innerHTML = this.getHeadlineText();
            } else {
                this.headline.innerHTML = `<strong>${fileItem.name}</strong>`;
            }
        }
    }

    getSubline(): HTMLElement {
        this.subline = document.createElement('p');
        this.subline.innerText = this.getSublineText();
        this.subline.classList.add('huply-dropzone-sm-subline');

        return this.subline;
    }

    getSublineText(): string {
        const sublineParts = [];
        sublineParts.push($t('allowedFileTypes', {allowedFileTypes: this.store?.options.allowedFileTypes}));
        sublineParts.push($t('maxFileSize', {maxFileSize: this.store?.options.maxFileSize}));

        return sublineParts.join(', ');
    }

    updateSubline(fileItem: FileItemInterface) {
        if(this.subline) {
            this.subline.classList.remove('is-uploading');
            this.subline.classList.remove('is-preloaded');
            this.subline.classList.remove('is-error');
            this.subline.classList.remove('is-uploaded');

            if(fileItem.status === 'uploading' && fileItem.uploadProcess) {
                this.subline.innerHTML = $t('fileItemStatusUploading') + ' ('+fileItem.uploadProcess.toFixed(0)+'%)';
            } else if(fileItem.status === 'error') {
                this.subline.innerHTML = fileItem.statusMsg ?? $t('fileItemStatusError');
            } else if(fileItem.status === 'uploaded' || fileItem.status === 'preloaded') {
                this.subline.textContent = fileItem.sizeMb && fileItem.sizeMb < 1 ? `${fileItem.sizeKb} KB` : `${fileItem.sizeMb} MB`;
            } else {
                this.subline.innerHTML = this.getSublineText();
            }
        }
    }
}

export default FileDropzoneSmallComponent;
