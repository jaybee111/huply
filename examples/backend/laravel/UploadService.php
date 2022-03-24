<?php
namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadService {
    private $request;
    private $settings;

    public function __construct(\Illuminate\Http\Request $request, $settings = []) {
        $this->request = $request;
        $this->allowedFileTypes = 'jpeg,jpg,png,svg,doc,docx,pdf,mp4';

        $request->user();
        $defaultSettings = [
            'base_path' => '',
            'disk' => 'local',
        ];
        $this->settings = array_merge($defaultSettings, $settings);
    }

    public function processUpload(): \Illuminate\Http\JsonResponse
    {
        if ($this->request->header('Content-Range')) {
            $this->request->validate([
                'file' => ['required', 'max:'.$this->request->input('max_file_size')]
            ]);

            if(
                strlen($this->settings['base_path']) &&
                !Storage::disk($this->settings['disk'])->exists($this->settings['base_path'])
            ) {
                Storage::disk($this->settings['disk'])->makeDirectory($this->settings['base_path']);
            }

            $filenameWithExt = basename(Str::ascii($this->request->file('file')->getClientOriginalName()));
            if (Storage::disk($this->settings['disk'])->exists($this->settings['base_path'].'/'.$filenameWithExt)) {
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
                Storage::disk($this->settings['disk'])->put($this->settings['base_path'].'/'.$filenameWithExtChunked, $this->request->file('file')->get());
            } else {
                Storage::disk($this->settings['disk'])->append($this->settings['base_path'].'/'.$filenameWithExtChunked, $this->request->file('file')->get(), null);
            }

            if ($chunkSizeUploaded === $fileSize) {
                Storage::disk($this->settings['disk'])->move($this->settings['base_path'].'/'.$filenameWithExtChunked, $this->settings['base_path'].'/'.$filenameWithExt);
            }

        } else {
            $this->request->validate([
                'file' => ['required','mimes:'.$this->allowedFileTypes, 'max:'.$this->request->input('max_file_size')]
            ]);

            $filenameWithExt = basename(Str::ascii($this->request->file('file')->getClientOriginalName()));

            if (Storage::disk($this->settings['disk'])->exists($this->settings['base_path'].'/'.$filenameWithExt)) {
                $pathParts = pathinfo($filenameWithExt);
                if (!empty($pathParts['filename']) && !empty($pathParts['extension'])) {
                    $filenameWithExt = $pathParts['filename'].'_'.uniqid().'.'.$pathParts['extension'];
                }
            }
            $this->request->file('file')->storeAs($this->settings['base_path'],$filenameWithExt, $this->settings['disk']);
        }

        return response()->json(['filename' => $filenameWithExt]);
    }

    public function deleteUploadedFile($filename): \Illuminate\Http\JsonResponse
    {
        $filename = basename($filename);
        if (Storage::disk($this->settings['disk'])->exists($this->settings['base_path'].'/'.$filename)) {
            Storage::disk($this->settings['disk'])->delete($this->settings['base_path'].'/'.$filename);
        }

        return response()->json();
    }
}
