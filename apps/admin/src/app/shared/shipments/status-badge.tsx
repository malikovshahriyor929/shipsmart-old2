import cn from '@core/utils/class-names';

const statusStyles: Record<string, string> = {
  OPEN: 'border-red-200 bg-red-50 text-red-700',
  RELEASED: 'border-sky-200 bg-sky-50 text-sky-700',
  COVERED: 'border-amber-200 bg-amber-50 text-amber-800',
  DISPATCHED: 'border-orange-200 bg-orange-50 text-orange-700',
  DEPARTED: 'border-blue-200 bg-blue-50 text-blue-700',
  DELIVERED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  VOIDED: 'border-slate-200 bg-slate-100 text-slate-600',
};

export default function ShipmentStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex min-w-[96px] items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide',
        statusStyles[status] ?? 'border-slate-200 bg-slate-50 text-slate-700',
        className
      )}
    >
      {status}
    </span>
  );
}
