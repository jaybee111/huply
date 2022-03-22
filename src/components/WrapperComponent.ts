import FileInputComponent from "./FileInputComponent";
import FileListComponent from "./FileListComponent";
import FileDropzoneComponent from "./FileDropzoneComponent";
import FileDropzoneSmallComponent from "./FileDropzoneSmallComponent";
import FileInputHiddenComponent from "./FileInputHiddenComponent";
import AppStore from "../store/AppStore";

class WrapperComponent {
    private el: HTMLElement;
    private store: AppStore;

    constructor(el: HTMLElement, store: AppStore) {
        this.el = el;
        this.store = store;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('huply-wrapper');

        // Add input file field
        // Clone input / Identical input element cannot be replaced if it is an anchestor of parent
        const inputComponent = new FileInputComponent(this.el, this.store).render();
        wrapper.appendChild(inputComponent);

        // Add input hidden field with file information
        const inputHiddenComponent = new FileInputHiddenComponent(this.el, this.store).render();
        wrapper.appendChild(inputHiddenComponent);

        // Add dropzone
        let dropzoneComponent;
        if(this.store.options.dropzoneTheme === 'sm') {
            dropzoneComponent = new FileDropzoneSmallComponent(this.store);
            wrapper.appendChild(dropzoneComponent.render());
        } else {
            dropzoneComponent = new FileDropzoneComponent(this.store);
            wrapper.appendChild(dropzoneComponent.render());
        }

        // Add file list
        const fileListComponent = new FileListComponent(this.store);
        wrapper.appendChild(fileListComponent.render());

        // Add elements to store
        this.store.setComponent('input', inputComponent);
        this.store.setComponent('dropzone', dropzoneComponent);
        this.store.setComponent('fileList', fileListComponent);

        return wrapper;
    }
}


export default WrapperComponent;
