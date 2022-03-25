<?php

namespace App\Http\Controllers;

use App\Services\UploadService;

class UploadController extends Controller
{
    private $uploadService;

    public function __construct(UploadService $uploadService) {
        $this->uploadService = $uploadService;
    }

    public function index(): \Illuminate\Http\JsonResponse
    {
        $attr = [
            'base_path' => '',
            'disk' => 'local',
        ];
        return $this->uploadService->processUpload($attr);
    }

    public function delete($filename): \Illuminate\Http\JsonResponse
    {
        $attr = [
            'base_path' => '',
            'disk' => 'local',
            'filename' => $filename
        ];
        return $this->uploadService->deleteUploadedFile($attr);
    }
}
