import AppStore from "../store/AppStore";
import {isObject} from "../helpers/TypeHelper";

export default class HttpRequestService {
    private store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    request(method: string, url: string): XMLHttpRequest {
        let request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open(method, url);
        if(isObject(this.store.options.headers)) {
            // @ts-ignore
            Object.entries(this.store.options.headers).forEach((item) => {
                // @ts-ignore
                request.setRequestHeader(item[0], item[1]);
            });
        }

        return request;
    }
}
