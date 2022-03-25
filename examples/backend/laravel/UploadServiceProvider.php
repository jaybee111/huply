<?php

namespace App\Providers;

use App\Libraries\UploadLibrary;
use App\Services\UploadService;
use Illuminate\Support\ServiceProvider;

class UploadServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(UploadService::class, function ($app) {
            return new UploadService(request());
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
