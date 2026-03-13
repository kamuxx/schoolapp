<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\UseCases\UserUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    private $usecase;

    public function __construct(UserUseCase $usecase)
    {
        $this->usecase = $usecase;
    }

    public function index(Request $request)
    {
        $users = $this->usecase->listUsers($request);

        $roles = Role::orderBy('name')->get();
        $groupedRoles = $roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name, 'guard_name' => $r->guard_name])->toArray();

        $permissions = Permission::orderBy('group')->orderBy('name')->get();
        $groupedPermissions = $permissions->groupBy('group')->map(function ($perms) {
            return $perms->map(fn($p) => ['id' => $p->id, 'name' => $p->name, 'guard_name' => $p->guard_name]);
        })->toArray();

        return Inertia::render('config/users/index', [
            'users' => $users,
            'roles' => $groupedRoles,
            'permissions' => $groupedPermissions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'is_active' => 'boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $user = $this->usecase->createUser($data);

        if (!empty($data['roles'])) {
            $user->assignRole($data['roles']);
        }

        if (!empty($data['permissions'])) {
            $user->givePermissionTo($data['permissions']);
        }

        return redirect()->back()->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'is_active' => 'boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user = $this->usecase->updateUser($id, $data);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        if (isset($data['permissions'])) {
            $user->syncPermissions($data['permissions']);
        }

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy($id)
    {
        $this->usecase->deleteUser($id);

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }
}
