<?php

namespace App\Events;

use App\Models\Section;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SectionAutoCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $section;

    /**
     * Create a new event instance.
     */
    public function __construct(Section $section)
    {
        $this->section = $section;
    }
}
