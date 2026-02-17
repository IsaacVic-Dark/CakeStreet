import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, type = 'text', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        'block w-full px-4 py-2.5 bg-white border rounded-md',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
                        error
                            ? 'border-accent-red focus:ring-accent-red'
                            : 'border-neutral-300 focus:border-primary focus:ring-primary',
                        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-accent-red">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
