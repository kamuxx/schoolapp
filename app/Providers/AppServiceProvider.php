<?php

namespace App\Providers;

use App\Listeners\ClearUserMenuCache;
use App\Repositories\Contracts\CourseSubjectTeacherRepositoryInterface;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Repositories\Contracts\ScheduleBlockRepositoryInterface;
use App\Repositories\Contracts\SectionRepositoryInterface;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use App\Repositories\Eloquent\EloquentCourseSubjectTeacherRepository;
use App\Repositories\Eloquent\EloquentEmployeeRepository;
use App\Repositories\Eloquent\EloquentScheduleBlockRepository;
use App\Repositories\Eloquent\EloquentSectionRepository;
use App\Repositories\Eloquent\EloquentSubjectRepository;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
// Eventos y listeners para el cierre de sesion
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            CourseSubjectTeacherRepositoryInterface::class,
            EloquentCourseSubjectTeacherRepository::class
        );

        $this->app->bind(
            EmployeeRepositoryInterface::class,
            EloquentEmployeeRepository::class
        );

        $this->app->bind(
            SectionRepositoryInterface::class,
            EloquentSectionRepository::class
        );

        $this->app->bind(
            SubjectRepositoryInterface::class,
            EloquentSubjectRepository::class
        );

        $this->app->bind(
            ScheduleBlockRepositoryInterface::class,
            EloquentScheduleBlockRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );

        Event::listen(
            Logout::class,
            ClearUserMenuCache::class,
        );
    }
}
