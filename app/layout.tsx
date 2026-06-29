import type {Metadata, Viewport} from 'next';
import localFont from 'next/font/local';
import {Nunito, JetBrains_Mono} from 'next/font/google';
import {CONTENT} from '@/lib/quiz-data';
import {ConsentProvider} from '@/components/analytics/ConsentProvider';
import './globals.css';

const gerhaus = localFont({
    src: '../public/fonts/gerhaus/Gerhaus.ttf',
    variable: '--font-gerhaus',
    display: 'swap',
    fallback: ['Georgia', 'serif'],
});

const nunito = Nunito({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '600', '700', '800'],
    variable: '--font-nunito',
    display: 'swap',
});

const jbm = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
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
            className={`${gerhaus.variable} ${nunito.variable} ${jbm.variable} antialiased`}
        >
        <body className="min-h-screen flex flex-col">
        <ConsentProvider>{children}</ConsentProvider>
        </body>
        </html>
    );
}
