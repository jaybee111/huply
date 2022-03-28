import AppStore from "../store/AppStore";

class FileInputHiddenComponent {
    private el: HTMLElement;
    private store: AppStore;
    private input: HTMLInputElement;

    constructor(el: HTMLElement, store: AppStore) {
        this.el = el;
        this.store = store;
        this.input = document.createElement('input');

        store.events.subscribe('fileItemUpdate', () => {
            this.input.setAttribute('value', this.getValue());
        });

        store.events.subscribe('fileDeleted', () => {
            this.input.setAttribute('value', this.getValue());
        });
    }

    render(): HTMLInputElement {
        this.input.setAttribute('type', 'hidden');
        const nameAttr = this.el.getAttribute('name');
        if(nameAttr) {
            this.input.setAttribute('name', nameAttr);
        }
        return this.input;
    }

    getValue() {
        const categorizedFiles = this.store.getCategorizedFiles();
        categorizedFiles.uploaded = categorizedFiles.uploaded.map((fileItem) => {
            fileItem.data = undefined;
            return fileItem;
        });
        categorizedFiles.deleted = categorizedFiles.deleted.map((fileItem) => {
            fileItem.data = undefined;
            return fileItem;
        });
        categorizedFiles.preloaded = categorizedFiles.preloaded.map((fileItem) => {
            fileItem.url = undefined;
            return fileItem;
        });

        return JSON.stringify(categorizedFiles);
    }
}


export default FileInputHiddenComponent;
