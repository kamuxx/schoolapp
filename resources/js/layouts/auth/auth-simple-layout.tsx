import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import AnimatedBackground from '@/components/animated-background';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh overflow-hidden bg-white">
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] p-6 md:p-10 lg:w-[55%] xl:w-[55%]">
                <AnimatedBackground
                    variant="light"
                    density="high"
                    showConnections={true}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center gap-6 lg:hidden">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-2xl font-bold text-white">
                                SCHOOLAPP
                            </span>
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
                        <div className="mb-8 text-left">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-2 text-sm text-slate-500">
                                    {description}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd] lg:flex lg:w-[45%] xl:w-[45%]">
                <AnimatedBackground
                    variant="dark"
                    density="high"
                    showConnections={true}
                />

                <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 shadow-2xl backdrop-blur-sm">
                        <AppLogoIcon className="size-16 fill-current text-white" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">
                            SCHOOLAPP
                        </h2>
                        <p className="max-w-md text-lg text-[#1e40af]/80">
                            Gestión educativa moderna
                        </p>
                        <p className="max-w-md text-sm text-[#1e40af]/60">
                            Simplifica la administración de tu institución
                            educativa
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
