import AppStore from "../store/AppStore";
import UploadService from "../services/UploadService";
import FileValidationService from "../services/FileValidationService";
import FileService from "../services/FileService";

class FileInputComponent {
    private el: HTMLInputElement;

    constructor(el: Element, store: AppStore) {
        this.el = el.cloneNode(true) as HTMLInputElement;

        // Add default class to input
        this.el.setAttribute('name', `${el.getAttribute('name')}_real`);

        // Add default class to input
        this.el.classList.add('huply-input');

        // Add accept - Attribute
        if(store.options?.allowedFileTypes) {
            this.el.setAttribute('accept', store.options?.allowedFileTypes.join(','));
        }

        // File added
        this.el.addEventListener('change', (e) => {
            e.preventDefault();

            if(e.target) {
                // @ts-ignore
                [...e.target.files].forEach((item) => {
                    // Validate file
                    const validationService = new FileValidationService(store);
                    const validationMsg = validationService.isValidFile(item);
                    new FileService(store).generateFileItemFromFile(item).then((fileItem) => {
                        store.addFileItem(fileItem);

                        // Check for errors
                        if(validationMsg.length !== 0) {
                            fileItem.status = 'error';
                            fileItem.statusMsg = validationMsg.map((item) => item.msg).join(', ');
                            store.updateFileItem(fileItem);
                        }

                        new UploadService(store).upload();
                    });
                });
            }

        });
    }

    render(): HTMLInputElement {
        return this.el;
    }
}


export default FileInputComponent;
