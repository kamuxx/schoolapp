<?php
namespace App\UseCases;

use App\Models\School;

class ProfileUseCase {
    public function getProfile() {
        $schoolId = auth()->check() ? auth()->user()->school_id : null;
        if (!$schoolId) {
            return null;
        }
        return School::with(['levels', 'academicYears'])->find($schoolId);
    }
}
