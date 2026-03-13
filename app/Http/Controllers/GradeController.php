<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Term;
use App\Models\EvaluationActivity;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function index(Request $request) {
        $sections = Section::with(['level:id,name'])->get()->map(fn($s) => ['id' => $s->id, 'name' => $s->name, 'level' => $s->level?->name]);
        $terms = Term::with(['academicYear:id,name'])->get()->map(fn($t) => ['id' => $t->id, 'name' => $t->name, 'academic_year' => $t->academicYear?->name]);
        
        $sectionId = $request->input('section_id');
        $termId = $request->input('term_id');
        
        $activities = [];
        $grades = [];
        
        if ($sectionId && $termId) {
            $activities = EvaluationActivity::where('term_id', $termId)
                ->whereHas('courseSubjectTeacher', fn($q) => $q->where('section_id', $sectionId))
                ->get()
                ->map(fn($a) => ['id' => $a->id, 'dimension' => $a->dimension, 'description' => $a->description, 'max_score' => $a->max_score]);
            
            $grades = Grade::whereHas('evaluationActivity', fn($q) => $q->where('term_id', $termId))
                ->whereHas('student.enrollments', fn($q) => $q->where('section_id', $sectionId)->where('status', 'active'))
                ->with(['student:id,first_name,last_name,student_code', 'evaluationActivity:id,dimension,description,max_score'])
                ->get()
                ->map(fn($g) => [
                    'student_id' => $g->student_id,
                    'student_name' => $g->student->first_name . ' ' . $g->student->last_name,
                    'student_code' => $g->student->student_code,
                    'activity_id' => $g->evaluation_activity_id,
                    'activity_dimension' => $g->evaluationActivity->dimension,
                    'activity_description' => $g->evaluationActivity->description,
                    'score' => $g->score,
                ]);
        }

        return Inertia::render('gestion-escolar/notas/index', [
            'sections' => $sections,
            'terms' => $terms,
            'activities' => $activities,
            'grades' => $grades,
            'filters' => $request->only(['section_id', 'term_id']),
        ]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|integer|exists:students,id',
            'grades.*.evaluation_activity_id' => 'required|integer|exists:evaluation_activities,id',
            'grades.*.score' => 'required|numeric|min:0',
        ]);

        foreach ($data['grades'] as $gradeData) {
            Grade::updateOrCreate(
                ['student_id' => $gradeData['student_id'], 'evaluation_activity_id' => $gradeData['evaluation_activity_id']],
                ['score' => $gradeData['score'], 'graded_at' => now()]
            );
        }

        return redirect()->back()->with('success', 'Notas guardadas.');
    }
}
