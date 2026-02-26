import FileListItemComponent from "./FileListItemComponent";
import FileItemInterface from "../interfaces/FileItemInterface";
import AppStore from "../store/AppStore";

class FileListComponent {

    private fileList: HTMLElement;
    private store: AppStore;
    private dragSrcEl: HTMLElement | null = null;

    constructor(store: AppStore) {
        this.store = store;

        this.fileList = document.createElement('ul');
        this.fileList.classList.add('huply-file-list');

        if (this.store.options.sortable) {
            this.fileList.classList.add('is-sortable');
        }

        if (this.store.options.fileListTheme === 'gallery') {
            this.fileList.classList.add('is-gallery');
        }

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
        const li = fileListItemComponent.render();

        if (this.store.options.sortable) {
            this.makeSortable(li, fileItem);
        }

        this.fileList.appendChild(li);
    }

    private makeSortable(li: HTMLElement, fileItem: FileItemInterface) {
        li.setAttribute('draggable', 'true');
        li.dataset.fileId = fileItem.id;

        li.addEventListener('dragstart', (e: DragEvent) => {
            this.dragSrcEl = li;
            li.classList.add('is-dragging');
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', fileItem.id);
            }
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('is-dragging');
            this.fileList.querySelectorAll('.huply-file-item').forEach(el => {
                el.classList.remove('is-drag-over');
            });
            this.dragSrcEl = null;
        });

        li.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'move';
            }
            if (this.dragSrcEl && this.dragSrcEl !== li) {
                li.classList.add('is-drag-over');
            }
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('is-drag-over');
        });

        li.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            li.classList.remove('is-drag-over');

            if (this.dragSrcEl && this.dragSrcEl !== li) {
                const allItems = Array.from(this.fileList.children);
                const srcIndex = allItems.indexOf(this.dragSrcEl);
                const targetIndex = allItems.indexOf(li);

                if (srcIndex < targetIndex) {
                    this.fileList.insertBefore(this.dragSrcEl, li.nextSibling);
                } else {
                    this.fileList.insertBefore(this.dragSrcEl, li);
                }

                const newOrder = Array.from(this.fileList.children)
                    .map(el => (el as HTMLElement).dataset.fileId ?? '')
                    .filter(id => id !== '');
                this.store.reorderFiles(newOrder);
            }
        });
    }
}

export default FileListComponent;
