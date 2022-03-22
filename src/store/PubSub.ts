import {isset} from "../helpers/TypeHelper";

export default class PubSub {
    private events: {
        // eslint-disable-next-line no-unused-vars
        [key: string]: Array<(data: object) => void>
    } = {};

    constructor() {}

    subscribe(event: string, callback: any) {
        if (!isset(this.events[event])) {
            this.events[event] = [];
        }

        return this.events[event].push(callback);
    }

    publish(event: string, data = {}) {
        if (!isset(this.events[event])) {
            return [];
        }

        return this.events[event].map(callback => callback(data));
    }
}
