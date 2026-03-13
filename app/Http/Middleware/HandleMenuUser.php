<?php

namespace App\Http\Middleware;

use App\Models\MenuItem;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class HandleMenuUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return $next($request);
        }

        // 1. Obtener el usuario y sus roles (fuera del closure para la llave)
        $user = auth()->user();
        $roleIds = $user->roles->pluck('id')->sort()->join('-');
        $cacheKey = "menu_user_{$user->id}_roles_{$roleIds}";
        //Cache::forget($cacheKey);

        // 2. Usar config() en lugar de env()
        $ttl = 60 * intval(config('session.lifetime', 120));

        $menuItems = Cache::remember($cacheKey, $ttl, function () use ($user) {
            $roleNames = $user->roles->pluck('name')->toArray();
            return MenuItem::getMenu($roleNames);
        });

        // Compartir menu_items con Inertia
        \Inertia\Inertia::share('menu_items', $menuItems);

        return $next($request);
    }
}
