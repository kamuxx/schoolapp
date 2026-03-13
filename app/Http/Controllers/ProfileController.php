<?php
namespace App\Http\Controllers;

use App\UseCases\ProfileUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    private $usecase;
    public function __construct(ProfileUseCase $usecase) { $this->usecase = $usecase; }

    public function index(Request $request) {
        return Inertia::render('institucional/perfil/index', [
            'profile' => $this->usecase->getProfile(),
        ]);
    }
}
