import {CONTENT} from '@/lib/quiz-data';

export function StickyCta() {
    return (
        <div
            className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-[--line] bg-bg2/95 px-4 py-3 backdrop-blur-[--blur-md]">
            <a
                href="#test"
                className="block w-full rounded-full bg-cyan px-5 py-3 text-center text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
            >
                {CONTENT.stickyCta}
            </a>
        </div>
    );
}
