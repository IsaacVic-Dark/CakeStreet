import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
    children,
    hover = false,
    padding = 'md',
    className,
    ...props
}: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={cn(
                'bg-white rounded-lg shadow-card transition-shadow duration-200',
                hover && 'hover:shadow-card-hover cursor-pointer',
                paddingStyles[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
