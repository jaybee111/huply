<?php

namespace App\Http\Controllers;

use App\Services\UploadService;
use Illuminate\Http\Request;
class UploadController extends Controller
{
    private $uploadService;

    public function __construct(Request $request, UploadService $uploadService) {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        return $this->uploadService->processUpload();
    }

    public function delete($filename, Request $request): \Illuminate\Http\JsonResponse
    {
        return $this->uploadService->deleteUploadedFile(urldecode($filename));
    }
}
