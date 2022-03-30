import './assets/css/style.scss';
import HuplyOptionsInterface from "./interfaces/HuplyOptionsInterface";
import {isElement, isObject} from "./helpers/TypeHelper";
import WrapperComponent from "./components/WrapperComponent";
import de from "./lang/de";
import en from "./lang/en";
import AppStore from "./store/AppStore";
import { CustomWindowInterface } from "./interfaces/CustomWindowInterface";
import FileService from "./services/FileService";
import OptionsService from "./services/OptionsService";
declare let window: CustomWindowInterface;

// eslint-disable-next-line no-unused-vars
export default class Huply {

    public options?: HuplyOptionsInterface;
    public el: HTMLElement | null;
    private store: AppStore;

    public constructor(el: HTMLElement, options?: HuplyOptionsInterface) {
        if(!isElement(el)) {
            throw new Error('Selected element is not type of "Element". Current type: '+ typeof el);
        }

        this.el = el;

        // Initialize options service
        const optionsService = new OptionsService(el);

        // Initialize store
        this.store = new AppStore();

        // Parse options
        this.options = optionsService.parseOptions(options);

        // Set options to store
        if(this.options) {
            this.store.setOptions(this.options);
        }

        // Validate options
        optionsService.validateOptions(this.options);

        // Available Translations
        const defaultTranslations = {
            'de': de,
            'en': en,
        };

        // Set translations
        // Check if translations set
        // * via options global window object
        // * via options attribute
        if(isObject(window.huplyTranslations)) {
            this.store.setTranslations(window.huplyTranslations);
        } else {
            const lang = document.querySelector('html')?.getAttribute('lang');
            if(lang === 'en' || lang === 'de') {
                // @ts-ignore
                window.huplyTranslations = defaultTranslations[this.options.lang];
                // @ts-ignore
                this.store.setTranslations(defaultTranslations[this.options.lang]);
            } else {
                window.huplyTranslations = defaultTranslations['en'];
                this.store.setTranslations(defaultTranslations['en']);
            }
        }

        return this;
    }

    public init() {
        // Render Layout
        // Replace input with wrapper
        if(this.el) {
            const wrapper = new WrapperComponent(this.el, this.store).render();
            if(this.el?.parentNode) {
                this.el.parentNode.replaceChild(wrapper, this.el);
            }

            // Get the new generated input element
            this.el = wrapper.querySelector(this.el.tagName);
        }

        // Add preloaded files
        if(this.options?.preloadedFiles?.length) {
            const fileService = new FileService(this.store);
            this.options.preloadedFiles.forEach((fileItem) => {
                fileService.generateFileItemFromPreloaded(fileItem).then((newItem) => {
                    this.store.addFileItem( newItem);
                    newItem.status = 'preloaded';
                    this.store.updateFileItem( newItem);
                });
            });
        }

        return this;
    }

    public on(eventName: string, listener: any) {
        this.store.events.subscribe(eventName, listener);
    }
}
