import FileListItemComponent from "./FileListItemComponent";
import FileItemInterface from "../interfaces/FileItemInterface";
import AppStore from "../store/AppStore";

class FileListComponent {

    private fileList: Element;
    private store: AppStore;

    constructor(store: AppStore) {
        this.store = store;

        // Generate ul element
        this.fileList = document.createElement('ul');
        this.fileList.classList.add('huply-file-list');

        // Check if file is added and add new file item to list
        // Show list, if more than 1 file allowed
        if(this.store.options.multiple) {
            store.events.subscribe('fileAdded', (fileItem: FileItemInterface) => {
                this.addChild(fileItem);
            });
        }
    }

    render() {
        return this.fileList;
    }

    addChild(fileItem: FileItemInterface) {
        const fileListItemComponent = new FileListItemComponent(fileItem, this.store);
        this.fileList.appendChild(fileListItemComponent.render());
    }
}

export default FileListComponent;
