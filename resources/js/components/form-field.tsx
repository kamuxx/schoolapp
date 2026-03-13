import { AlertCircle, Upload } from 'lucide-react';
import type { ReactNode} from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type FormFieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'search'
    | 'date'
    | 'tel'
    | 'url'
    | 'file';

export interface Option {
    label: string | ReactNode;
    value: string | number;
}

export interface FormFieldProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    'type' | 'required'
> {
    label?: string | ReactNode;
    name: string;
    type?: FormFieldType;
    error?: string;
    options?: Option[]; // Para selects
    onValueChange?: (value: string) => void; // Para select
    description?: string | ReactNode;
    containerClassName?: string;
    required?: boolean;
}

export function FormField({
    label,
    name,
    type = 'text',
    error,
    options = [],
    onValueChange,
    onChange,
    placeholder,
    description,
    className,
    containerClassName,
    value,
    defaultValue,
    required,
    ...props
}: FormFieldProps) {
    // Generar el input correcto según el tipo
    const renderField = () => {
        if (type === 'textarea') {
            return (
                <Textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    defaultValue={defaultValue}
                    className={cn(
                        error &&
                            'border-destructive bg-red-50 focus-visible:ring-destructive',
                        className,
                    )}
                    required={required}
                    onChange={onChange as any}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            );
        }

        if (type === 'select') {
            return (
                <Select
                    name={name}
                    value={value ? String(value) : undefined}
                    defaultValue={
                        defaultValue ? String(defaultValue) : undefined
                    }
                    onValueChange={onValueChange}
                    disabled={props.disabled}
                >
                    <SelectTrigger
                        id={name}
                        className={cn(
                            error &&
                                'border-destructive bg-red-50 focus-visible:ring-destructive',
                            className,
                        )}
                    >
                        <SelectValue
                            placeholder={placeholder || 'Seleccionar...'}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((opt) => (
                            <SelectItem
                                key={opt.value}
                                value={String(opt.value)}
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        if (type === 'file') {
            const [fileName, setFileName] = useState<string>('');
            const fileInputRef = useRef<HTMLInputElement>(null);

            const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                    setFileName(file.name);
                } else {
                    setFileName('');
                }
                if (onChange) onChange(e as any);
            };

            return (
                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        id={name}
                        name={name}
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept={props.accept}
                    />
                    <div 
                        className={cn(
                            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-0 text-sm transition-colors focus-within:ring-1 focus-within:ring-ring overflow-hidden",
                            error && "border-destructive bg-red-50",
                            className
                        )}
                    >
                        <span className={cn(
                            "truncate text-xs flex-1 min-w-0 mr-2",
                            !fileName ? "text-muted-foreground" : "text-foreground font-medium"
                        )}>
                            {fileName || "Ningún archivo seleccionado"}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 text-[10px] font-bold uppercase tracking-tight bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border-l rounded-none shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={props.disabled}
                        >
                            <Upload className="mr-1.5 h-3 w-3" />
                            Seleccionar
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <Input
                id={name}
                name={name}
                type={type as any}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                className={cn(
                    error &&
                        'border-destructive bg-red-50 focus-visible:ring-destructive',
                    className,
                )}
                required={required}
                onChange={onChange as any}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
        );
    };

    return (
        <div className={cn('grid w-full gap-2', containerClassName)}>
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(error && 'text-red-500 font-semibold')}
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-red-600 font-bold">*</span>
                    )}
                </Label>
            )}

            {renderField()}

            {description && !error && (
                <p className="text-[0.8rem] text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <div className="flex items-center gap-2 mt-1.5 px-3 py-2 bg-red-50/80 border border-red-100 rounded-lg text-red-600 text-[0.75rem] font-semibold animate-in fade-in slide-in-from-top-1 shadow-sm select-none">
                    <Icon iconNode={AlertCircle} className="h-3.5 w-3.5 shrink-0 text-red-600/70" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
