import Huply from '../src/main.js';

document.addEventListener('DOMContentLoaded', function () {

    const el = document.querySelector('.huply-test');
    const options = {
        uploadUrl: 'http://huply-be.loc/api/upload',
        deleteUrl: 'http://huply-be.loc/api/upload/{{filename}}',
        chunkSize: 5,
        maxFileSize: 50,
        preloadedFiles: [
            {
                url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
                name: 'test.jpg'
            },
            {
                url: 'https://cdn.pixabay.com/photo/2021/12/27/14/39/tulips-6897351_960_720.jpg',
                name: 'test2.jpg'
            },
            {
                url: 'https://cdn.pixabay.com/photo/2020/03/26/10/58/norway-4970080_960_720.jpg',
                name: 'test3.jpg'
            },
        ]
    };
    const huplyInstance = new Huply(el, options).init();
    huplyInstance.on('fileUploaded', (fileItem) => {
       console.log('fileUploaded', fileItem);
    });
    huplyInstance.on('fileDeleted', (fileItem) => {
        console.log('fileDeleted', fileItem);
    });
    huplyInstance.on('fileAdded', (fileItem) => {
        console.log('fileAdded', fileItem);
    });
    huplyInstance.on('fileItemUpdate', (fileItem) => {
        console.log('fileItemUpdate', fileItem);
    });
    huplyInstance.on('filesUploaded', () => {
        console.log('filesUploaded');
    });

    const el2 = document.querySelector('.huply-test2');
    const options2 = {
        uploadUrl: 'http://huply-be.loc/api/upload',
        deleteUrl: 'http://huply-be.loc/api/upload/{{filename}}',
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
    const huplyInstance2 = new Huply(el2, options2).init();

    const el3 = document.querySelector('.huply-test3');
    const options3 = {
        uploadUrl: 'http://huply-be.loc/api/upload',
        deleteUrl: 'http://huply-be.loc/api/upload/{{filename}}',
        dropzoneTheme: 'sm',
        chunkSize: 5,
        maxFileSize: 50,
        preloadedFiles: [
            {
                url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
                name: 'test.jpg'
            },
        ]
    };
    const huplyInstance3 = new Huply(el3, options3).init();

    const el4 = document.querySelector('.huply-test4');
    const options4 = {
        uploadUrl: 'http://huply-be.loc/api/upload',
        deleteUrl: 'http://huply-be.loc/api/upload/{{filename}}',
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
    const huplyInstance4 = new Huply(el4, options4).init();

    const el5 = document.querySelector('.huply-test5');
    el5.setAttribute('headers',JSON.stringify({
        "x-api-key": "123456789"
    }));

    const huplyInstance5 = new Huply(el5).init();


});
