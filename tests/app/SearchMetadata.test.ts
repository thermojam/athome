import {describe, expect, it} from 'vitest';
import robots, {dynamic as robotsDynamic} from '@/app/robots';
import sitemap, {dynamic as sitemapDynamic} from '@/app/sitemap';

describe('search metadata routes', () => {
    it('allows crawling and points to the absolute sitemap URL', () => {
        expect(robotsDynamic).toBe('force-static');
        expect(robots()).toEqual({
            rules: [{userAgent: '*', allow: '/'}],
            sitemap: 'https://trenerprimorskiy.ru/sitemap.xml',
        });
    });

    it('lists only the canonical home page in the sitemap', () => {
        expect(sitemapDynamic).toBe('force-static');

        const entries = sitemap();
        expect(entries).toEqual([
            {
                url: 'https://trenerprimorskiy.ru/',
                changeFrequency: 'monthly',
                priority: 1,
            },
        ]);
        expect(entries).toHaveLength(1);
        expect(entries.some(({url}) => url.includes('/privacy/') || url.includes('/cookies/'))).toBe(false);
    });
});
