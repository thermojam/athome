import type {Metadata, Viewport} from 'next';
import localFont from 'next/font/local';
import {Nunito, JetBrains_Mono} from 'next/font/google';
import {CONTENT} from '@/lib/quiz-data';
import { YandexMetrika } from '@/components/analytics/YandexMetrika';
import './globals.css';

const gerhaus = localFont({
    src: '../public/fonts/gerhaus/Gerhaus.ttf',
    variable: '--font-gerhaus',
    display: 'swap',
    fallback: ['Georgia', 'serif'],
});

const nunito = Nunito({
    subsets: ['latin', 'cyrillic'],
    variable: '--font-nunito',
    display: 'swap',
});

const jbm = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jbm',
    display: 'swap',
});

export const metadata: Metadata = {
    title: CONTENT.meta.title,
    description: CONTENT.meta.description,
    openGraph: {
        title: CONTENT.meta.ogTitle,
        description: CONTENT.meta.ogDescription,
        type: 'website',
        locale: 'ru_RU',
    },
};

export const viewport: Viewport = {
    themeColor: '#0E1117',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html
            lang="ru"
            className={`${gerhaus.variable} ${nunito.variable} ${jbm.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">
          {children}
          <YandexMetrika />
        </body>
        </html>
    );
}
