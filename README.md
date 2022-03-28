# Huply
A dependency-free file uploader

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Translation](#translation)
- [Events](#events)
- [Backends](#backends)
- [License](#license)

## Installation

### Installation via npm
Recommended step for projects with integrated module bundler (e.g. Webpack) or task-runner (e.g. Gulp).
1. ``npm install huply --save``
2. Integrate it via the import statement ``import Huply from 'huply'``
3. Import ``[PATH_TO_NODE_MODULES]/huply/dist/style.css`` to your stylesheets / workflow

## Usage

1. Add ``lang`` - Attribute to html-Tag. Otherwise english or the defined fallback language is used as default language.
   ``<html lang="en">``

2. Add input field

````
 <input
   type="file"
   accept=".jpeg,.jpg,.png"
   multiple
   class="huply-test"
 />
````

3. Execute init-function:

````
const el = document.querySelector('.huply-test');
new Huply(el).init();
````

## Configuration

Every Huply-Instance can be modified by parameters:

| Parameter            | Required | Type                         |
|----------------------|----------|------------------------------|
| dropzoneTheme        | false    | string                       |
| maxConcurrentUploads | false    | number                       |
| maxFileSize          | false    | number                       |
| uploadUrl            | true     | string                       |
| deleteUrl            | true     | string                       |  
| headers              | false | object                       |  
| withCredentials      | false | boolean                      |  
| preloadedFiles       | false | PreloadedFileItemInterface[] |  
| translations         | false | object                       |  
| allowedFileTypes     | false | string[]                     |
| chunkSize            | false | number                       |

```
 const options = {
     dropzoneTheme: 'sm',
     maxConcurrentUploads: 3,
     maxFileSize: 3,
     uploadUrl: 'http://huply-be.loc/api/upload',
     deleteUrl: 'http://huply-be.loc/api/upload/{{filename}}',
     headers: {
      'X-API-Key': '123456789'
     },
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
             url: 'data:application/octet-stream;base64, ...',
             name: 'url-as-data-url.jpg'
         },
     ],
     allowedFileTypes: ['.jpeg', '.png', '.jpg'],
     chunkSize: 5
 };
 new Huply(el, options).init();
```

#### dropzoneTheme

**Values:** 'sm' | 'lg'

```
const options = {
  ...
  dropzoneTheme: 'sm',
  ...
};
new Huply(el, options).init();
```

#### maxConcurrentUploads

Number of concurrent uploads.

```
const options = {
  ...
  maxConcurrentUploads: 3,
  ...
};
new Huply(el, options).init();
```

#### maxFileSize

Maximum file size in megabytes (MB)

```
const options = {
  ...
  maxFileSize: 3,
  ...
};
new Huply(el, options).init();
```

#### uploadUrl

Huply sends files to this url by **POST**-Method

```
const options = {
  ...
  uploadUrl: 'https://my-backend.url/upload',
  ...
};
new Huply(el, options).init();
```

#### deleteUrl

Huply sends a request to delete a temporary uploaded file. Request is sent by **DELETE**-Method. The placeholder **{{filename}}** is required and will be replaced with the filename.

```
const options = {
  ...
  deleteUrl: 'https://my-backend.url/upload/{{filename}},
  ...
};
new Huply(el, options).init();
```

#### headers

Add additional headers to request (e.g. CSRF-Token, API-Key).

```
const options = {
  ...
  headers: {
   'X-API-KEY' : '123456789'
  },
  ...
};
new Huply(el, options).init();
```

#### withCredentials

Add ``withCredentials`` to request.

```
const options = {
  ...
  withCredentials : true
  ...
};
new Huply(el, options).init();
```

#### preloadedFiles

Sets the preloaded files (e.g. from database). Size - Value in bytes.

```
const options = {
  ...
  preloadedFiles: [
      {
          url: 'https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg',
          name: 'test.jpg',
          size: 20000000
      },
      {
          url: 'https://cdn.pixabay.com/photo/2021/12/27/14/39/tulips-6897351_960_720.jpg',
          name: 'test2.jpg',
          size: 10000000
      },
      {
          url: 'data:image/jpeg;base64, ...',
          name: 'url-as-data-url.jpg',
          size: 10000000
      },
  ],
  ...
};
new Huply(el, options).init();
```

#### allowedFileTypes

```
const options = {
  ...
  allowedFileTypes: ['.jpg', '.jpeg', '.png'],
  ...
};
new Huply(el, options).init();
```

#### chunkSize

If you need large file size uploads, huply slices the file into chunks. Chunk size in Megabytes (MB).
An additional header (**Content-Range**) will be sent by file upload.

```
const options = {
  ...
  chunkSize: 3,
  ...
};
new Huply(el, options).init();
```

### Data-attributes

Add parameters as data-attributes:

```
 <input
   accept=".jpeg,.jpg,.png"
   multiple
   class="huply-test"
   name="huply-test"
   type="file"
   data-dropzone-theme="sm"
   data-max-concurrent-uploads="2"
   data-max-file-size="5"
   data-max-files="3"
   data-upload-url="http://huply-be.loc/api/upload"
   data-delete-url="http://huply-be.loc/api/upload/{{filename}}"
   data-preloaded-files='base64-encoded string (Decoded: [{"url":"https://cdn.pixabay.com/photo/2022/03/06/05/30/clouds-7050884_960_720.jpg","name":"test.jpg"},{"url":"https://cdn.pixabay.com/photo/2021/12/27/14/39/tulips-6897351_960_720.jpg","name":"test2.jpg"},{"url":"https://cdn.pixabay.com/photo/2020/03/26/10/58/norway-4970080_960_720.jpg","name":"test3.jpg"}])'
   data-chunk-size="3"
 />
```

and initialize it:

```
new Huply(el).init();
```

## Translation

You can choose between english (en) and german (de) as default translations. Add a lang-attribute to HTML-Tag: ``<html lang="en">``.
If you need an individual translation you can use a global variable:

```
window.huplyTranslations {
   chooseFiles: 'Choose files',
   chooseFile: 'Choose file',
   allowedFileTypes: 'Allowed file types: {{allowedFileTypes}}',
   maxFileSize: 'Maximum file size: {{maxFileSize}} MB',
   fileItemStatusWaiting: "In queue",
   fileItemStatusUploading: "Uploading ...",
   fileItemStatusUploaded: "Uploaded",
   fileItemStatusPreloaded: "Already uploaded",
   fileItemStatusError: "An error occured.",
   fileItemStatusErrorFileSize: "The file size exceeds the maximum size: {{maxFileSize}} MB",
   fileItemStatusErrorFileType: "The file type is not allowed. Allowed file types: {{allowedFileTypes}}",
   delete: "Delete"
}
```

## Events

If you need additional functionality, you can subscribe to events published by huply.

#### fileAdded

A file was added.

```
const huply = new Huply(el).init();
huply.on('fileAdded', function(fileItem) {
   
});
```

#### fileUploaded

A file was uploaded.

```
const huply = new Huply(el).init();
huply.on('fileUploaded', function(fileItem) {
   
});
```

#### filesUploaded

All files were uploaded.

```
const huply = new Huply(el).init();
huply.on('filesUploaded', function() {
   
});
```

#### fileDeleted

A file was deleted.

```
const huply = new Huply(el).init();
huply.on('fileDeleted', function(fileItem) {
   
});
```

#### fileItemUpdate

Status of added file changed.

```
const huply = new Huply(el).init();
huply.on('fileDeleted', function(fileItem) {
   
});
```

## Backends

The backend needs two endpoints:

* Processing the file upload (default and chunked)
* Delete temporary uploaded files

### Processing the file upload

**You need to fill the ``uploadUrl`` - Parameter.**

Every new upload will be placed in a temporary upload folder, because the huply upload input is only a part of a form.
After submission of the form the temporary upload folder will be processed by the backend and will be placed in a persistent storage.

#### Request

If it is a chunked upload, the HTTP-Header ```Content-Range``` will be added.

**HTTP-Method**: ``POST``

**HTTP-Body (``JSON``)**:
```
{
 file: FILE-CONTENT
}
```

#### Response

The response includes the filename generated by the backend. It is possible that the backend renames the filename because of special characters in the filename or duplicate filenames.
The frontend needs to know this the new filename. Every successful upload returns the HTTP-Status Code ``200``.

**HTTP-Status Code**: ``200``

**HTTP-Body (``JSON``)**:
```
{
 filename: "test.jpg"
}
```

### Delete temporary uploaded files

**You need to fill the ``deleteUrl`` - Parameter.**

Uploaded files will be stored in a temporary folder. If they are deleted by the frontend, the backend needs to know it.
Every successful deletions returns the HTTP-Status Code ``200``.

#### Request

**HTTP-Method**: ``DELETE``

**HTTP-Parameter**: The filename will be sent as ``GET``-Parameter. The {{filename}} placeholder will be replaced by huply. (e.g. https://my-url.com/upload/{{filename}})

### Response

**HTTP-Status Code**: ``200``

### Examples

* [Laravel](examples/backend/laravel)

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.
