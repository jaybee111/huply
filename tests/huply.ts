import Huply from '../src/main.js';
import FileItemInterface from "../src/interfaces/FileItemInterface";

document.addEventListener('DOMContentLoaded', function () {

    const el = document.querySelector('.huply-test');
    const options = {
        uploadUrl: '/api/mock-upload',
        deleteUrl: '/api/mock-upload/{{filename}}',
        sortable: true,
        chunkSize: 5,
        chunkMinSize: 2,
        chunkRetries: 3,
        maxFileSize: 50,
        preloadedFiles: [
            {
                url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
                name: 'test.jpg',
                size: 2000000
            },
            {
                url: 'https://cdn.pixabay.com/photo/2021/12/27/14/39/tulips-6897351_960_720.jpg',
                name: 'test2.jpg',
                size: 1000000
            },
            {
                url: 'https://cdn.pixabay.com/photo/2020/03/26/10/58/norway-4970080_960_720.jpg',
                name: 'test3.jpg',
                size: 1500600
            },
        ]
    };
    const huplyInstance = new Huply(el, options).init();
    huplyInstance.on('fileUploaded', (fileItem: FileItemInterface) => {
       console.log('fileUploaded', fileItem);
    });
    huplyInstance.on('fileDeleted', (fileItem: FileItemInterface) => {
        console.log('fileDeleted', fileItem);
    });
    huplyInstance.on('fileAdded', (fileItem: FileItemInterface) => {
        console.log('fileAdded', fileItem);
    });
    huplyInstance.on('fileItemUpdate', (fileItem: FileItemInterface) => {
        console.log('fileItemUpdate', fileItem);
    });
    huplyInstance.on('filesUploaded', () => {
        console.log('filesUploaded');
    });

    const el2 = document.querySelector('.huply-test2');
    const options2 = {
        uploadUrl: '/api/mock-upload',
        deleteUrl: '/api/mock-upload/{{filename}}',
        maxFiles: 1,
        chunkSize: 5,
        maxFileSize: 50,
        preloadedFiles: [
            {
                url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
                name: 'test.jpg',
                size: 1500600
            },
        ]
    };
    new Huply(el2, options2).init();

    const el3 = document.querySelector('.huply-test3');
    const options3 = {
        uploadUrl: '/api/mock-upload',
        deleteUrl: '/api/mock-upload/{{filename}}',
        Kan: 'sm',
        chunkSize: 5,
        maxFileSize: 50,
        preloadedFiles: [
            {
                url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
                name: 'test.jpg',
                size: 1500600
            },
        ]
    };
    new Huply(el3, options3).init();

    const el4 = document.querySelector('.huply-test4');
    const options4 = {
        uploadUrl: '/api/mock-upload',
        deleteUrl: '/api/mock-upload/{{filename}}',
        dropzoneTheme: 'sm',
        maxFiles: 1,
        chunkSize: 5,
        maxFileSize: 50,
        preloadedFiles: [
            {
                url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
                name: 'test.jpg'
            },
        ]
    };
    new Huply(el4, options4).init();

    const el5 = document.querySelector('.huply-test5');
    el5.setAttribute('headers',JSON.stringify({
        "x-api-key": "123456789"
    }));

    new Huply(el5).init();

    const el6 = document.querySelector('.huply-test6');
    const options6 = {
        uploadUrl: '/api/mock-upload',
        deleteUrl: '/api/mock-upload/{{filename}}',
    };
    const huplyInstance6 = new Huply(el6, options6).init();
    const fileItem = {
        name: 'test123.jpg',
        size: 200000,
        url: ''
    }
    huplyInstance6.addFileItem(fileItem);

    const el7 = document.querySelector('.huply-test7');
    const options7 = {
        uploadUrl: '/api/mock-upload?fail_rate=0.3',
        deleteUrl: '/api/mock-upload/{{filename}}',
        chunkSize: 1,
        chunkMinSize: 1,
        chunkRetries: 3,
        maxFileSize: 50,
    };
    new Huply(el7, options7).init();

    const el8 = document.querySelector('.huply-test8');
    const options8 = {
        uploadUrl: '/api/mock-upload',
        deleteUrl: '/api/mock-upload/{{filename}}',
        sortable: true,
        fileListTheme: 'gallery',
        maxFileSize: 50,
        preloadedFiles: [
            { url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg', name: 'clouds.jpg', size: 2000000 },
            { url: 'https://cdn.pixabay.com/photo/2021/12/27/14/39/tulips-6897351_960_720.jpg', name: 'tulips.jpg', size: 1000000 },
            { url: 'https://cdn.pixabay.com/photo/2020/03/26/10/58/norway-4970080_960_720.jpg', name: 'norway.jpg', size: 1500600 },
        ]
    };
    new Huply(el8, options8).init();

});
