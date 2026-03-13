<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\UseCases\RoleUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    private $usecase;

    public function __construct(RoleUseCase $usecase)
    {
        $this->usecase = $usecase;
    }

    public function index(Request $request)
    {
        $roles = $this->usecase->listRoles($request);

        $permissions = Permission::orderBy('group')->orderBy('name')->get();
        $groupedPermissions = $permissions->groupBy('group')->map(function ($perms) {
            return $perms->map(fn($p) => ['id' => $p->id, 'name' => $p->name, 'guard_name' => $p->guard_name]);
        })->toArray();

        return Inertia::render('config/roles/index', [
            'roles' => $roles,
            'permissions' => $groupedPermissions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'guard_name' => 'required|string|in:web,api',
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role = $this->usecase->createRole($data);

        if (!empty($data['permissions'])) {
            $role->givePermissionTo($data['permissions']);
        }

        return redirect()->back()->with('success', 'Rol creado correctamente.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'guard_name' => 'required|string|in:web,api',
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role = $this->usecase->updateRole($id, $data);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return redirect()->back()->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy($id)
    {
        $this->usecase->deleteRole($id);

        return redirect()->back()->with('success', 'Rol eliminado correctamente.');
    }
}
