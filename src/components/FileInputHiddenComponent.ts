import AppStore from "../store/AppStore";

class FileInputHiddenComponent {
    private el: HTMLElement;
    private input: HTMLInputElement;

    constructor(el: HTMLElement, store: AppStore) {
        this.el = el;
        this.input = document.createElement('input');

        store.events.subscribe('fileItemUpdate', () => {
            this.input.setAttribute('value', JSON.stringify(store.getCategorizedFiles()));
        });

        store.events.subscribe('fileDeleted', () => {
            this.input.setAttribute('value', JSON.stringify(store.getCategorizedFiles()));
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
}


export default FileInputHiddenComponent;
