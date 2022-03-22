import {isset} from "./TypeHelper";
import {CustomWindowInterface} from "../interfaces/CustomWindowInterface";
declare let window: CustomWindowInterface;

function $t(key: string, replacer?: object) {
    if(isset(window.huplyTranslations[key])) {
        let translation = window.huplyTranslations[key];
        if(replacer) {
            Object.entries(replacer).forEach((value) => {
                translation = translation.replace('{{'+value[0]+'}}', value[1]);
            });
        }

        return translation;
    } else {
        return '{{'+key+'}}';
    }


}

export {$t};
