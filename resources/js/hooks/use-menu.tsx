import { usePage } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';

import type { NavItem } from '@/types';

export function useMenu(): NavItem[] {
    const { menu_items } = usePage<any>().props;

    let menu: any[] = [];
    if (!menu_items) return menu;

    menu = menu_items.map((item: any) => {
        const IconComponent =
            (LucideIcons as any)[item.icon] || LucideIcons.LayoutGrid;

        return {
            title: item.label,
            href: item.path,
            icon: IconComponent,
            items:
                item.children?.length > 0
                    ? item.children.map((child: any) => ({
                          title: child.label,
                          href: child.path,
                          icon:
                              (LucideIcons as any)[child.icon] ||
                              LucideIcons.LayoutGrid,
                      }))
                    : undefined,
        };
    });

    return menu;
}
