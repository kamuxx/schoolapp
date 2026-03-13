<?php

namespace Database\Seeders;

use App\Models\ScheduleBlock;
use App\Models\School;
use Illuminate\Database\Seeder;

class ScheduleBlockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $school = School::first();
        if (!$school) return;

        $blocks = [
            ['name' => '1ra Hora', 'start_time' => '08:00', 'end_time' => '08:45', 'sort_order' => 1],
            ['name' => '2da Hora', 'start_time' => '08:45', 'end_time' => '09:30', 'sort_order' => 2],
            ['name' => 'Recreo', 'start_time' => '09:30', 'end_time' => '10:00', 'sort_order' => 3],
            ['name' => '3ra Hora', 'start_time' => '10:00', 'end_time' => '10:45', 'sort_order' => 4],
            ['name' => '4ta Hora', 'start_time' => '10:45', 'end_time' => '11:30', 'sort_order' => 5],
            ['name' => '5ta Hora', 'start_time' => '11:30', 'end_time' => '12:15', 'sort_order' => 6],
        ];

        foreach ($blocks as $block) {
            ScheduleBlock::updateOrCreate(
                [
                    'school_id' => $school->id,
                    'name' => $block['name'],
                ],
                [
                    'start_time' => $block['start_time'],
                    'end_time' => $block['end_time'],
                    'sort_order' => $block['sort_order'],
                ]
            );
        }
    }
}
