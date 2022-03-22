import AppStore from "../store/AppStore";
import {$t} from "../helpers/LangHelper";
import ErrorInterface from "../interfaces/ErrorInterface";

export default class FileValidationService {
    private store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    checkFileSize(fileItem: File): boolean {
        return !(this.store.options?.maxFileSize && fileItem.size > (this.store.options.maxFileSize * 1024 * 1024));
    }

    checkFileType(fileItem: File): boolean {
        const fileItemParts = fileItem.name.split('.');
        return this.store.options.allowedFileTypes.includes('.'+fileItemParts[fileItemParts.length - 1].toLowerCase());
    }

    isValidFile(fileItem: File): Array<ErrorInterface> {
        const errorBag: Array<ErrorInterface> = [];

        if(!this.checkFileSize(fileItem)) {
            errorBag.push({
                msg: $t('fileItemStatusErrorFileSize', {maxFileSize : this.store.options.maxFileSize})
            });
        }

        if(!this.checkFileType(fileItem)) {
            errorBag.push({
                msg: $t('fileItemStatusErrorFileType', {allowedFileTypes : this.store.options.allowedFileTypes.join(',')})
            });
        }

        return errorBag;
    }
}
