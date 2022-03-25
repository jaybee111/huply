<?php
namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadService {
    private $request;
    private $allowedFileTypes;

    public function __construct(Request $request) {
        $this->request = $request;
        $this->allowedFileTypes = 'jpeg,jpg,png,svg,doc,docx,pdf,mp4';
    }

    public function processUpload($attr): \Illuminate\Http\JsonResponse
    {
        if ($this->request->header('Content-Range')) {
            $this->request->validate([
                'file' => ['required','mimes:'.$this->allowedFileTypes, 'max:'.$this->request->input('max_file_size')]
            ]);

            if(
                !empty($attr['base_path']) &&
                !Storage::disk($attr['disk'])->exists($attr['base_path'])
            ) {
                Storage::disk($attr['disk'])->makeDirectory($attr['base_path']);
            }

            $filenameWithExt = basename(Str::ascii($this->request->file('file')->getClientOriginalName()));
            if (Storage::disk($attr['disk'])->exists($attr['base_path'].'/'.$filenameWithExt)) {
                $pathParts = pathinfo($filenameWithExt);
                if (!empty($pathParts['filename']) && !empty($pathParts['extension'])) {
                    $filenameWithExt = $pathParts['filename'].'_'.uniqid().'.'.$pathParts['extension'];
                }
            }
            $filenameWithExtChunked = $filenameWithExt.'.chunked';

            $contentRange = explode('-', $this->request->header('Content-Range'));
            $chunkStartSize = explode(' ', $contentRange[0])[1];
            list($chunkSizeUploaded, $fileSize) = explode('/', $contentRange[1]);

            if($chunkStartSize == 0) {
                Storage::disk($attr['disk'])->put($attr['base_path'].'/'.$filenameWithExtChunked, $this->request->file('file')->get());
            } else {
                Storage::disk($attr['disk'])->append($attr['base_path'].'/'.$filenameWithExtChunked, $this->request->file('file')->get(), null);
            }

            if ($chunkSizeUploaded === $fileSize) {
                Storage::disk($attr['disk'])->move($attr['base_path'].'/'.$filenameWithExtChunked, $attr['base_path'].'/'.$filenameWithExt);
            }

        } else {
            $this->request->validate([
                'file' => ['required','mimes:'.$this->allowedFileTypes, 'max:'.$this->request->input('max_file_size')]
            ]);

            $filenameWithExt = basename(Str::ascii($this->request->file('file')->getClientOriginalName()));

            if (Storage::disk($attr['disk'])->exists($attr['base_path'].'/'.$filenameWithExt)) {
                $pathParts = pathinfo($filenameWithExt);
                if (!empty($pathParts['filename']) && !empty($pathParts['extension'])) {
                    $filenameWithExt = $pathParts['filename'].'_'.uniqid().'.'.$pathParts['extension'];
                }
            }
            $this->request->file('file')->storeAs($attr['base_path'],$filenameWithExt, $attr['disk']);
        }

        return response()->json(['filename' => $filenameWithExt]);
    }

    public function deleteUploadedFile($attr): \Illuminate\Http\JsonResponse
    {
        $filename = basename(urldecode($attr['filename']));
        if (Storage::disk($attr['disk'])->exists($attr['base_path'].'/'.$filename)) {
            Storage::disk($attr['disk'])->delete($attr['base_path'].'/'.$filename);
        }

        return response()->json();
    }
}
