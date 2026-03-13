<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;

class ClearUserMenuCache
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        if($user = $event->user){
            $roleIds = $user->roles->pluck('id')->sort()->join('-');
            $cacheKey = "menu_user_{$user->id}_roles_{$roleIds}";
            Cache::forget($cacheKey);
        }
    }
}
