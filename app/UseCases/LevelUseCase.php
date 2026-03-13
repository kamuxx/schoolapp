<?php

namespace App\UseCases;

use App\Repositories\LevelRepository;
use Illuminate\Http\Request;
use App\Models\SchoolLevel;
use App\Models\Section;

class LevelUseCase
{
    private $repository;

    public function __construct(LevelRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all data required for the Levels Index page.
     */
    public function getListLevels(Request $request): array
    {
        $schoolId = $request->user()->school_id;
        
        $academicYear = $this->repository->resolveActiveYear($schoolId);
        
        if (!$academicYear) {
            return [
                'levels' => [],
                'catalogLevels' => $this->repository->getGlobalCatalog(),
                'academicYears' => $this->repository->getAcademicYears($schoolId),
                'activeYearId' => null
            ];
        }

        $levels = $this->repository->getSchoolLevels($schoolId, $academicYear->id)
            ->map(function ($sl) {
                return [
                    'id' => $sl->id,
                    'level_id' => $sl->level_id,
                    'name' => $sl->level->name,
                    'stage' => $sl->level->stage,
                    'academic_year_id' => $sl->academic_year_id,
                    'educational_stage_name' => ucfirst($sl->level->stage),
                    'academic_year_name' => $sl->academicYear->name ?? '-',
                    'sections' => $sl->sections->map(fn($s) => [
                        'id' => $s->id,
                        'name' => $s->name,
                        'students_count' => $s->students_count
                    ])
                ];
            });

        return [
            'levels' => $levels,
            'catalogLevels' => $this->repository->getGlobalCatalog(),
            'academicYears' => $this->repository->getAcademicYears($schoolId),
            'activeYearId' => $academicYear->id
        ];
    }

    /**
     * Get a detailed level for show action.
     */
    public function getDetailedLevel(int $id): ?array
    {
        $sl = $this->repository->findDetailed($id);
        if (!$sl) return null;

        return [
            'id' => $sl->id,
            'level_name' => $sl->level->name,
            'stage' => ucfirst($sl->level->stage),
            'academic_year' => $sl->academicYear->name,
            'sections' => $sl->sections->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'students_count' => $s->students_count,
            ])
        ];
    }

    /**
     * Sync parallels for a specific school level.
     */
    public function syncParallels(int $schoolLevelId, array $parallels, int $schoolId): void
    {
        $this->repository->syncParallels($schoolLevelId, $parallels, $schoolId);
    }
}
