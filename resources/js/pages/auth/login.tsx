import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Login"
            description="Ingresa tus credenciales para acceder a tu cuenta"
        >
            <Head title="Iniciar sesión - SchoolApp" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Email"
                                    className="border-0 border-b-2 border-slate-300 bg-transparent px-0 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#3b82f6] focus:ring-0"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="border-0 border-b-2 border-slate-300 bg-transparent px-0 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#3b82f6] focus:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-slate-400 data-[state=checked]:border-[#3b82f6] data-[state=checked]:bg-[#3b82f6]"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-slate-600"
                                    >
                                        Recordarme
                                    </Label>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-sm font-medium text-[#3b82f6] transition-colors hover:text-[#1e40af]"
                                        tabIndex={5}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </TextLink>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full bg-[#2563eb] text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-blue-500/50 focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4" />}
                            <span className={processing ? 'opacity-70' : ''}>
                                {processing
                                    ? 'Ingresando...'
                                    : 'Iniciar sesión'}
                            </span>
                        </Button>

                        {canRegister && (
                            <div className="text-center text-sm text-slate-600">
                                ¿No tienes una cuenta?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-medium text-[#2563eb] transition-colors hover:text-[#1d4ed8]"
                                >
                                    Regístrate gratis
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
