import type { BridgeContent } from '@/lib/types';

export function Bridge({ data }: { data: BridgeContent }) {
  return (
    <div className="my-12 flex flex-col items-center gap-3 text-center">
      <p className="font-display text-xl text-tx2 md:text-2xl">{data.question}</p>
      <a
        href={data.href}
        className="inline-flex items-center gap-2 rounded-full border border-[--line] bg-[--glass] px-5 py-2 text-sm text-tx transition-colors hover:border-cyan hover:text-cyan"
      >
        {data.cta} <span aria-hidden>→</span>
      </a>
    </div>
  );
}
