import type {ReactNode} from 'react';

/**
 * Премиум-карточка — тонкая обёртка над .card из @layer components.
 * Принимает optional variant: 'sm' | 'md' | 'lg' | 'xl' (default 'xl' = .card).
 */
type Variant = 'sm' | 'md' | 'lg' | 'xl';

const variantClass: Record<Variant, string> = {
    sm: 'card-sm',
    md: 'card-md',
    lg: 'card-lg',
    xl: 'card',
};

export function GlassCard({
    children,
    className = '',
    variant = 'xl',
}: {
    children: ReactNode;
    className?: string;
    variant?: Variant;
}) {
    return (
        <div className={`${variantClass[variant]} ${className}`.trim()}>
            {children}
        </div>
    );
}
