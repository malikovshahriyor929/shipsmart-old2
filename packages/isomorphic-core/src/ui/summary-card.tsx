export function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 p-4 shadow-sm dark:border-gray-200/80">
      <div className="mb-2 flex items-center gap-2 text-gray-600">
        <span className="rounded-xl bg-primary/10 p-2 text-primary dark:bg-gray-200 dark:text-gray-700">
          {icon}
        </span>
        <span className="text-sm font-semibold text-primary dark:text-gray-700">
          {title}
        </span>
      </div>
      <div className="text-lg font-medium text-primary dark:text-gray-600">
        {value || 'N/A'}
      </div>
    </div>
  );
}
