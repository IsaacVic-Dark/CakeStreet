import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Arial Black', 'sans-serif'],
            },
            colors: {
                primary: {
                    yellow: '#FFD700',
                    pink: '#FF69B4',
                    blue: '#00B8D4',
                },
            },
            boxShadow: {
                brutal: '8px 8px 0 0 #000',
                'brutal-sm': '4px 4px 0 0 #000',
                'brutal-lg': '12px 12px 0 0 #000',
            },
        },
    },

    plugins: [forms],
};
