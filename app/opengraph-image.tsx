import {ImageResponse} from 'next/og';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {CONTENT} from '@/lib/quiz-data';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function Image() {
    const gerhaus = await readFile(
        join(process.cwd(), 'public/fonts/gerhaus/Gerhaus.ttf'),
    );

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#0E1117',
                    color: '#E8ECF4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '64px',
                    fontFamily: 'Gerhaus, serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontFamily: 'monospace',
                        fontSize: 22,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        color: '#9AA3B5',
                    }}
                >
                    СИЛОВЫЕ ТРЕНИРОВКИ · ПРИМОРСКИЙ ПР., 56
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                    <div style={{fontSize: 64, lineHeight: 1.05, maxWidth: 1000}}>
                        {CONTENT.meta.ogTitle}
                    </div>
                    <div style={{fontSize: 30, color: '#9AA3B5', maxWidth: 1000}}>
                        {CONTENT.meta.ogDescription}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        fontSize: 22,
                        color: '#2CE6FF',
                    }}
                >
          <div
              style={{
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  background: '#2CE6FF',
                  flexShrink: 0,
              }}
          />
                    тренер у дома · разбор за 60 секунд
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {name: 'Gerhaus', data: gerhaus, style: 'normal', weight: 400},
            ],
        },
    );
}
