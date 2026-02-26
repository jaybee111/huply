import FileItemInterface from "../interfaces/FileItemInterface";
import {$t} from "../helpers/LangHelper";
import AppStore from "../store/AppStore";
import FileService from "../services/FileService";
import {getHumanNumber} from "../helpers/OutputHelper";

class FileListComponent {
    private fileItem: FileItemInterface;
    private listElement!: HTMLElement;
    private store: AppStore;

    constructor(fileItem: FileItemInterface, store: AppStore) {
        this.fileItem = fileItem;
        this.store = store;

        // Listen to status changes
        this.store.events.subscribe('fileItemUpdate', (fileItem: FileItemInterface) => {
            if(this.fileItem.id === fileItem.id) {
                this.updateHeadline(fileItem);
                this.updateSubline(fileItem);
                this.updateListEl(fileItem);
            }
        });

        this.store.events.subscribe('fileDeleted', (fileItem: FileItemInterface) => {
            if(this.fileItem.id === fileItem.id) {
                this.listElement.remove();
            }
        });
    }

    private isGallery(): boolean {
        return this.store.options.fileListTheme === 'gallery';
    }

    render(): HTMLElement {
        if (this.isGallery()) {
            return this.renderGallery();
        }

        const li = this.getListEl();

        // Drag handle (only when sortable is enabled)
        if (this.store.options.sortable) {
            li.appendChild(this.getDragHandle());
        }

        // Image or icon
        li.appendChild(this.getVisual())

        // Description
        const descriptionEl = document.createElement('div');
        descriptionEl.classList.add('huply-file-item-description');

        // Generate name tag
        descriptionEl.appendChild(this.getHeadline());

        // Generate subline tag
        descriptionEl.appendChild(this.getSubline());

        li.appendChild(descriptionEl);

        // Actions
        li.appendChild(this.getActions());

        this.listElement = li;

        return li;
    }

    private renderGallery(): HTMLElement {
        const li = this.getListEl();
        li.appendChild(this.getVisual());

        const overlayEl = document.createElement('div');
        overlayEl.classList.add('huply-file-item-gallery-overlay');

        const progressEl = document.createElement('span');
        progressEl.classList.add('huply-file-item-gallery-progress');
        overlayEl.appendChild(progressEl);

        overlayEl.appendChild(this.getDeleteAction());
        li.appendChild(overlayEl);

        this.listElement = li;
        return li;
    }

    getListEl(): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('huply-file-item');

        return li;
    }

    updateListEl(fileItem: FileItemInterface) {
        this.listElement.classList.remove('is-uploading');
        this.listElement.classList.remove('is-preloaded');
        this.listElement.classList.remove('is-error');
        this.listElement.classList.remove('is-deleted');

        if(fileItem.status === 'uploading') {
            this.listElement.classList.add('is-uploading');
        } else if(fileItem.status === 'preloaded') {
            this.listElement.classList.add('is-preloaded');
        } else if(fileItem.status === 'error') {
            this.listElement.classList.add('is-error');
        } else if(fileItem.status === 'uploaded') {
            this.listElement.classList.add('is-uploaded');
        } else if(fileItem.status === 'deleted') {
            this.listElement.classList.add('is-deleted');
        }
    }

    getSubline(): HTMLElement {
        const sublineEl = document.createElement('p');
        sublineEl.classList.add('huply-file-item-subline');
        sublineEl.textContent = $t('fileItemStatusWaiting');

        return sublineEl;
    }

    updateSubline(fileItem: FileItemInterface) {
        if (this.isGallery()) {
            const progressEl = this.listElement?.querySelector('.huply-file-item-gallery-progress');
            if (progressEl) {
                progressEl.textContent = fileItem.status === 'uploading' && fileItem.uploadProcess
                    ? `${fileItem.uploadProcess.toFixed(0)}%`
                    : '';
            }
            return;
        }

        const sublineEl = this.listElement.querySelector('.huply-file-item-subline');
        if (sublineEl) {
            if (fileItem.status === 'uploading') {
                if (fileItem.uploadProcess) {
                    sublineEl.textContent = $t('fileItemStatusUploading') + ' (' + fileItem.uploadProcess.toFixed(0) + '%)';
                }
            } else if (fileItem.status === 'error') {
                sublineEl.textContent = fileItem.statusMsg ?? $t('fileItemStatusError');
            } else if (fileItem.status === 'uploaded' || fileItem.status === 'preloaded') {
                if(fileItem.size && fileItem.size > 0) {
                    sublineEl.textContent = fileItem.sizeMb && fileItem.sizeMb < 1 ? `${fileItem.sizeKb} KB` : `${getHumanNumber(fileItem.sizeMb)} MB`;
                } else {
                    sublineEl.innerHTML = '&nbsp;';
                }
            }
        }
    }

    getHeadline(): HTMLElement {
        const nameEl = document.createElement('p');
        nameEl.textContent = this.fileItem.name;
        nameEl.classList.add('huply-file-item-headline');

        return nameEl;
    }

    updateHeadline(fileItem: FileItemInterface) {
        const headline = this.listElement.querySelector('.huply-file-item-headline');
        if(headline) {
            headline.textContent = fileItem.name;
        }
    }

    getDragHandle(): HTMLElement {
        const handleEl = document.createElement('div');
        handleEl.classList.add('huply-file-item-drag-handle');
        handleEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16"><circle cx="3" cy="2" r="1.5"/><circle cx="7" cy="2" r="1.5"/><circle cx="3" cy="6" r="1.5"/><circle cx="7" cy="6" r="1.5"/><circle cx="3" cy="10" r="1.5"/><circle cx="7" cy="10" r="1.5"/></svg>';
        return handleEl;
    }

    getVisual(): HTMLElement {
        const visiualEl = document.createElement('div');
        visiualEl.classList.add('huply-file-item-visual');
        const fileService = new FileService(this.store);

        // Check if file is image
        if(fileService.checkIfIsImage(this.fileItem.name)) {
            if(this.fileItem.url) {
                const imgEl = document.createElement('img');
                imgEl.setAttribute('draggable', 'false');
                imgEl.classList.add('is-hidden');
                visiualEl.appendChild(imgEl);
                imgEl.setAttribute('src', this.fileItem.url);
                setTimeout(() => {
                    imgEl.classList.remove('is-hidden');
                }, 5);
            } else {
                visiualEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg>';
            }
        } else {
            visiualEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.743 262.3 0 245.4 0L64-.0001c-35.35 0-64 28.65-64 64l.0065 384c0 35.35 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM320 464H64.02c-8.836 0-15.1-7.163-16-15.1L48 64.13c-.0004-8.837 7.163-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v288C336 456.8 328.8 464 320 464z"/></svg>';
        }

        return visiualEl;
    }

    getActions(): HTMLElement {
        const actionsEl = document.createElement('div');
        actionsEl.classList.add('huply-file-item-actions');
        const deleteEl = this.getDeleteAction();
        actionsEl.appendChild(deleteEl);

        return actionsEl;
    }

    getDeleteAction(): HTMLElement {
        const deleteEl = document.createElement('a');
        deleteEl.setAttribute('href', '#');
        deleteEl.setAttribute('draggable', 'false');
        deleteEl.classList.add('huply-file-item-actions-delete');
        deleteEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M424 80C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H412.4L388.4 452.7C385.9 486.1 358.1 512 324.6 512H123.4C89.92 512 62.09 486.1 59.61 452.7L35.56 128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94L354.2 80H424zM177.1 48C174.5 48 171.1 49.34 170.5 51.56L151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1zM364.3 128H83.69L107.5 449.2C108.1 457.5 115.1 464 123.4 464H324.6C332.9 464 339.9 457.5 340.5 449.2L364.3 128z"/></svg>';
        deleteEl.addEventListener('click',  (e) => {
            e.preventDefault();
            this.store.deleteFileItem(this.fileItem);
        });

        return deleteEl;
    }

}

export default FileListComponent;
