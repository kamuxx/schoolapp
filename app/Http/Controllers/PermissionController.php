<?php

namespace App\Http\Controllers;

use App\UseCases\PermissionUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    private $usecase;

    public function __construct(PermissionUseCase $usecase)
    {
        $this->usecase = $usecase;
    }

    public function index(Request $request)
    {
        //$this->authorize('viewAny', Permission::class);
        $permissions = $this->usecase->listPermissions($request);

        return Inertia::render('config/permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'guard_name' => 'required|string|in:web,api',
            'group' => 'nullable|string',
        ]);

        $this->usecase->createPermission($data);

        return redirect()->back()->with('success', 'Permiso creado correctamente.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $id,
            'guard_name' => 'required|string|in:web,api',
            'group' => 'nullable|string',
        ]);

        $this->usecase->updatePermission($id, $data);

        return redirect()->back()->with('success', 'Permiso actualizado correctamente.');
    }

    public function destroy($id)
    {
        $this->usecase->deletePermission($id);

        return redirect()->back()->with('success', 'Permiso eliminado correctamente.');
    }
}
