<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory;
    
    protected $table = "menu_items";

    protected $fillable = [
        'parent_id',
        'label',
        'path',
        'icon',
        'roles',
        'sort_order',
        'is_active',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoot($query)
    {
        return $query->where('parent_id', null);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public static function getMenu($userRoles = [])
    {
        return static::query()
            ->where(function ($query) use ($userRoles) {
                // Menús públicos (roles = null)
                $query->whereNull('roles');

                // O menús donde exista AL MENOS UNO de los roles del usuario
                if (!empty($userRoles)) {
                    foreach ($userRoles as $role) {
                        $query->orWhereJsonContains('roles', $role);
                    }
                }
            })           
            ->active()
            ->root()
            ->ordered()
            ->get()
            ->map(function ($item) {
                return [
                    'label' => $item->label,
                    'path' => $item->path ?? '#',
                    'icon' => $item->icon,
                    'children' => $item->children->map(function ($child) {
                        return [
                            'label' => $child->label,
                            'path' => $child->path ?? '#',
                            'icon' => $child->icon,
                        ];
                    })->toArray(),
                ];
            });
    }

    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->ordered()->active();
    }

    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }
}
