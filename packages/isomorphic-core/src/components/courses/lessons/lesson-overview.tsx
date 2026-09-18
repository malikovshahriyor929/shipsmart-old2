'use client';

import {
  PiTarget,
  PiClock,
  PiPushPin,
  PiQuotes,
  PiListChecks,
} from 'react-icons/pi';

type Block = {
  title?: string | null;
  sections?: Array<{
    inner_title?: string | null;
    sub_titles?: string[] | null;
  }> | null;
};

function iconFor(title?: string | null) {
  const t = (title || '').toLowerCase();
  if (t.includes('objective')) return <PiTarget className="h-5 w-5" />;
  if (t.includes('estimated')) return <PiClock className="h-5 w-5" />;
  if (t.includes('takeaway') || t.includes('key'))
    return <PiPushPin className="h-5 w-5" />;
  if (t.includes('quote')) return <PiQuotes className="h-5 w-5" />;
  return <PiListChecks className="h-5 w-5" />;
}

export default function LessonOverview({ content }: { content: Block[] }) {
  return (
    <div className="space-y-5">
      {content.map((block, idx) => (
        <section
          key={idx}
          className="rounded-xl border border-mainBlue/15 bg-white dark:bg-gray-100 shadow-sm ring-1 ring-gray-50"
        >
          {/* Title */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mainBlue/10 dark:bg-gray-200 text-mainBlue dark:text-gray-700">
              {iconFor(block.title)}
            </div>
            <h3 className="text-base font-semibold text-mainBlue">
              {block.title || 'Section'}
            </h3>
          </div>

          {/* Sections */}
          <div className="space-y-4 p-4">
            {(block.sections || []).map((sec, sIdx) => (
              <div key={sIdx} className="space-y-2">
                {sec?.inner_title ? (
                  <p className="text-sm font-medium text-gray-700">
                    {sec.inner_title}
                  </p>
                ) : null}

                {Array.isArray(sec?.sub_titles) &&
                sec!.sub_titles!.length > 0 ? (
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    {sec!.sub_titles!.map((line, lIdx) => (
                      <li key={lIdx} className="pl-1 leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
