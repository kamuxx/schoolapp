import { Head, useForm } from '@inertiajs/react';
import { 
    Building2Icon, 
    MapPinIcon, 
    UserCheckIcon, 
    ChevronRightIcon, 
    ChevronLeftIcon,
    CheckCircle2Icon,
    ShieldCheckIcon
} from 'lucide-react';
import { useState } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface Role {
    id: number;
    name: string;
}

interface Stage {
    id: string;
    name: string;
}

interface Props {
    stages: Stage[];
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Institucional', href: '#' },
    { title: 'Planteles', href: '/institucional/planteles' },
    { title: 'Nuevo', href: '/institucional/planteles/nuevo' },
];

export default function CreateSchool({ stages, roles }: Props) {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        // Paso 1
        name: '',
        email: '',
        phone: '',
        city: '',
        province: '',
        district: '',
        locality: '',
        address: '',
        // Paso 2
        selected_stages: [] as string[],
        // Paso 3
        rep_name: '',
        rep_email: '',
        rep_password: '',
        rep_role: 'admin', // Default admin
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const toggleStage = (id: string) => {
        const current = [...data.selected_stages];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('selected_stages', current);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/institucional/planteles', {
            onSuccess: () => toast.success('¡Plantel y administrador creados con éxito!'),
            onError: () => toast.error('Por favor, revise los errores en el formulario.'),
        });
    };

    const renderStepHeader = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                        ${step === s 
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg scale-110' 
                            : step > s 
                                ? 'bg-emerald-500 text-white shadow-sm' 
                                : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}
                    `}>
                        {step > s ? <CheckCircle2Icon className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && (
                        <div className={`w-16 h-1 mx-2 rounded-full transition-colors duration-500 ${step > s ? 'bg-emerald-400' : 'bg-zinc-100'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Plantel" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-3">
                            <Building2Icon className="w-8 h-8 text-blue-600" />
                            Registro de Nuevo Plantel
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                            Configura la identidad, alcance y administración principal de la escuela.
                        </p>
                    </div>

                    <div className="p-8">
                        {renderStepHeader()}

                        <form onSubmit={submit} className="space-y-8 min-h-[400px]">
                            {/* PASO 1: DATOS DE LA ESCUELA */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                                        <Building2Icon className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Datos Institucionales</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Nombre del Plantel"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            error={errors.name}
                                            placeholder="Ej. Colegio San Miguel Arcángel"
                                            required
                                        />
                                        <FormField
                                            label="Email Institucional"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            error={errors.email}
                                            placeholder="info@colegio.edu"
                                            required
                                        />
                                        <FormField
                                            label="Teléfono"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            error={errors.phone}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        <FormField
                                            label="Ciudad / Localidad"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                            error={errors.city}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                                        <MapPinIcon className="w-5 h-5 text-emerald-500" />
                                        <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Ubicación Administrativa</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            label="Provincia / Estado"
                                            value={data.province}
                                            onChange={e => setData('province', e.target.value)}
                                            error={errors.province}
                                            required
                                        />
                                        <FormField
                                            label="Distrito"
                                            value={data.district}
                                            onChange={e => setData('district', e.target.value)}
                                            error={errors.district}
                                            required
                                        />
                                        <FormField
                                            label="LocaliDAD"
                                            value={data.locality}
                                            onChange={e => setData('locality', e.target.value)}
                                            error={errors.locality}
                                        />
                                    </div>
                                    <FormField
                                        label="Dirección Completa"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        error={errors.address}
                                        required
                                    />
                                </div>
                            )}

                            {/* PASO 2: NIVELES EDUCATIVOS */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-8">
                                        <ShieldCheckIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Alcance Educativo</h3>
                                        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
                                            Selecciona los niveles que atiende este plantel. Esto habilitará los módulos correspondientes.
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {stages.map(stage => (
                                            <div 
                                                key={stage.id}
                                                onClick={() => toggleStage(stage.id)}
                                                className={`
                                                    relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                                    ${data.selected_stages.includes(stage.id)
                                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-md ring-1 ring-blue-500/20'
                                                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'}
                                                `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="block text-lg font-bold text-zinc-900 dark:text-white">{stage.name}</span>
                                                        <span className="text-xs text-zinc-500 mt-1 block">Habilitar gestión para {stage.name.toLowerCase()}</span>
                                                    </div>
                                                    <div className={`
                                                        w-12 h-6 rounded-full p-1 transition-colors duration-300
                                                        ${data.selected_stages.includes(stage.id) ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800'}
                                                    `}>
                                                        <div className={`
                                                            w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300
                                                            ${data.selected_stages.includes(stage.id) ? 'translate-x-6' : 'translate-x-0'}
                                                        `} />
                                                    </div>
                                                </div>
                                                {data.selected_stages.includes(stage.id) && (
                                                    <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg ring-4 ring-white dark:ring-zinc-900">
                                                        <CheckCircle2Icon className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.selected_stages && (
                                        <p className="text-red-500 text-sm font-medium text-center">{errors.selected_stages}</p>
                                    )}
                                </div>
                            )}

                            {/* PASO 3: REPRESENTANTE LEGAL (ADMIN) */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-8">
                                        <UserCheckIcon className="w-5 h-5 text-indigo-500" />
                                        <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Usuario Administrador Principal</h3>
                                    </div>
                                    
                                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl mb-6">
                                        <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                                            <span className="font-bold">Nota Importante:</span> Este usuario será el representante legal y el primer administrador con acceso total al nuevo plantel. Asegúrese de ingresar un correo electrónico institucional válido.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Nombre del Representante"
                                            value={data.rep_name}
                                            onChange={e => setData('rep_name', e.target.value)}
                                            error={errors.rep_name}
                                            required
                                        />
                                        <FormField
                                            label="Email de Acceso"
                                            type="email"
                                            value={data.rep_email}
                                            onChange={e => setData('rep_email', e.target.value)}
                                            error={errors.rep_email}
                                            required
                                        />
                                        <FormField
                                            label="Contraseña de Acceso"
                                            type="password"
                                            value={data.rep_password}
                                            onChange={e => setData('rep_password', e.target.value)}
                                            error={errors.rep_password}
                                            required
                                        />
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Posición / Rol en el Colegio</label>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {roles.map(role => (
                                                    <button
                                                        key={role.id}
                                                        type="button"
                                                        onClick={() => setData('rep_role', role.name)}
                                                        className={`
                                                            px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 border-2
                                                            ${data.rep_role === role.name 
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' 
                                                                : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'}
                                                        `}
                                                    >
                                                        {role.name.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.rep_role && <p className="text-red-500 text-xs mt-1 font-medium">{errors.rep_role}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CONTROLES DEL WIZARD */}
                            <div className="flex justify-between items-center pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-12">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={step === 1 || processing}
                                    className="px-6 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                                >
                                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                    Atrás
                                </Button>

                                {step < 3 ? (
                                    <Button 
                                        type="button" 
                                        onClick={nextStep}
                                        disabled={processing}
                                        className="px-8 bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all active:scale-95"
                                    >
                                        Siguiente
                                        <ChevronRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-10 bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 font-bold"
                                    >
                                        {processing ? 'Registrando...' : 'Finalizar Registro'}
                                        <ShieldCheckIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
