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
                sans: ['Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
                display: ['Playfair Display', 'Georgia', 'serif'],
                body: ['Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Primary maroon/brown scale
                primary: {
                    DEFAULT: '#432326',
                    50: '#F6F4F4',
                    75: '#725A5C',
                    100: '#432326',
                    200: '#A19193',
                    300: '#D0C8C9',
                    400: '#ECE9E9',
                },
                // Typography scale (blacks and grays)
                typography: {
                    DEFAULT: '#0A0506',
                    50: '#F3F2F3',
                    75: '#474444',
                    100: '#0A0506',
                    200: '#B4B283',
                    300: '#C2C1C1',
                    400: '#E7E6E6',
                },
                // Accent colors
                accent: {
                    orange: '#F6830F',
                    red: '#FF2F2F',
                },
                // Neutral backgrounds
                neutral: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    400: '#A3A3A3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
            fontSize: {
                // Display sizes
                'display-xl': ['52px', { lineHeight: '1.2', fontWeight: '600' }],
                'display-l': ['42px', { lineHeight: '1.2', fontWeight: '600' }],
                'display-m': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
                'display-s': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
                // Heading sizes
                'heading-xl': ['16px', { lineHeight: '1.5', fontWeight: '700' }],
                'heading-l': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
                'heading-m': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
                'heading-s': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
                // Body sizes
                'body-l': ['14px', { lineHeight: '1.6', fontWeight: '600' }],
                'body-m': ['14px', { lineHeight: '1.6', fontWeight: '500' }],
                'body-s': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
                // Caption
                'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'soft-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
                'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
            },
            borderRadius: {
                'sm': '4px',
                'DEFAULT': '8px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '24px',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
                '112': '28rem',
                '128': '32rem',
            },
        },
    },

    plugins: [forms],
};
