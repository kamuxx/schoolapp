import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { useCallback, useRef } from 'react';

interface PropsAppToolbar {
    paginate?: boolean;
    limit?: number;
    search?: boolean;
    onLimitChange?: (limit: number) => void;
    onSearch?: (term: string) => void;
    buttons?: any[];
}

type PropsSelectOptions = {
    value: number;
    label: string;
};

const items: PropsSelectOptions[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];
export function AppToolbar({
    paginate = false,
    limit,
    onLimitChange,
    search = false,
    onSearch,
    buttons = [],
}: PropsAppToolbar) {
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedSearch = useCallback(
        (term: string) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                onSearch?.(term);
            }, 350);
        },
        [onSearch],
    );

    const handleChangeLimit = (value: string) => {
        const newLimit = parseInt(value);
        if (onLimitChange) {
            onLimitChange(newLimit);
        }
    };
    return (
        <div className="flex justify-between gap-2">
            {paginate && limit ? (
                <div className="flex items-center gap-2">
                    <span>Mostrar</span>
                    <Select
                        value={limit?.toString() || '10'}
                        onValueChange={handleChangeLimit}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value.toString()}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>registros</span>
                </div>
            ) : null}
            {search && (
                <div className="flex-1">
                    <Input
                        type="search"
                        className="w-full"
                        placeholder="Buscar..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                        onInput={(e) =>
                            debouncedSearch(
                                (e.target as HTMLInputElement).value,
                            )
                        }
                    />
                </div>
            )}
            {/* Actions Buttons */}
            <div className="flex max-w-[400px] gap-2">
                {buttons.map((action: any) => (
                    <Button
                        title={action.label}
                        key={action.label}
                        onClick={action.onClick}
                        variant={action.variant}
                    >
                        {action.icon}
                    </Button>
                ))}
            </div>
        </div>
    );
}
