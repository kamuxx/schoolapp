<?php

namespace App\Repositories;

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\Level;
use App\Models\School;
use App\Models\SchoolLevel;
use Illuminate\Database\Eloquent\Collection;

class LevelRepository extends BaseRepository
{
    public function __construct(SchoolLevel $model)
    {
        parent::__construct($model);
    }

    public function find($id): ?SchoolLevel
    {
        return $this->model->find($id);
    }

    /**
     * Get all school-associated levels for a specific year.
     */
    public function getSchoolLevels(int $schoolId, int $academicYearId): Collection
    {
        $school = School::find($schoolId);
        $stages = $school?->educational_stages ?? [];

        return $this->model::with(['level', 'academicYear'])
            ->with('sections')
            ->where('school_id', $schoolId)
            ->where('academic_year_id', $academicYearId)
            ->whereHas('level', function ($q) use ($stages) {
                $q->whereIn('stage', $stages);
            })
            ->get();
    }

    /**
     * Find a single school level with all details.
     */
    public function findDetailed(int $id): ?SchoolLevel
    {
        return $this->model::with(['level', 'academicYear'])
            ->with(['sections' => function ($q) {
                $q->withCount(['enrollments as students_count' => function ($query) {
                    $query->where('status', Enrollment::STATUS_ACTIVE);
                }]);
            }])
            ->find($id);
    }

    /**
     * Get the global catalog of levels.
     */
    public function getGlobalCatalog(): Collection
    {
        return Level::orderBy('order')->get();
    }

    /**
     * Get academic years for a school.
     */
    public function getAcademicYears(int $schoolId): Collection
    {
        return AcademicYear::where('school_id', $schoolId)->get();
    }

    /**
     * Resolve the best academic year to show (active or most recent).
     */
    public function resolveActiveYear(int $schoolId): ?AcademicYear
    {
        $active = AcademicYear::where('school_id', $schoolId)->where('is_active', true)->first();

        if (! $active) {
            $active = AcademicYear::where('school_id', $schoolId)->orderBy('name', 'desc')->first();
        }

        return $active;
    }

    /**
     * Sync parallels (sections) for a specific school level.
     */
    public function syncParallels(int $schoolLevelId, array $parallels, int $schoolId): void
    {
        $schoolLevel = $this->model::findOrFail($schoolLevelId);

        $currentSectionIds = $schoolLevel->sections->pluck('id')->toArray();
        $inputSectionIds = array_filter(array_column($parallels, 'id'));

        // 1. Soft-delete sections not in the input
        $toDelete = array_diff($currentSectionIds, $inputSectionIds);
        if (! empty($toDelete)) {
            \App\Models\Section::whereIn('id', $toDelete)->update([
                'deleted_by' => auth()->id(),
            ]);
            \App\Models\Section::whereIn('id', $toDelete)->delete();
        }

        // 2. Update or Create sections
        foreach ($parallels as $parallel) {
            $sectionData = [
                'name' => $parallel['name'],
                'school_id' => $schoolId,
                'school_level_id' => $schoolLevelId,
                'updated_by' => auth()->id(),
            ];

            if (isset($parallel['id']) && ! empty($parallel['id'])) {
                // Update existing (might need to restore if it was soft-deleted)
                $section = \App\Models\Section::withTrashed()->find($parallel['id']);
                if ($section) {
                    if ($section->trashed()) {
                        $section->restore();
                    }
                    $section->update($sectionData);
                }
            } else {
                // Create new
                $sectionData['created_by'] = auth()->id();
                \App\Models\Section::create($sectionData);
            }
        }
    }
}
