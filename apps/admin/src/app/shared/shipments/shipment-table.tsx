import Link from 'next/link';
import { routes } from '@/config/routes';
import type { ShipmentListItem } from './types';
import ShipmentStatusBadge from './status-badge';
import { PiEyeBold } from 'react-icons/pi';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function ShipmentTable({
  shipments,
}: {
  shipments: ShipmentListItem[];
}) {
  return (
    <div
      role="region"
      aria-label="Shipments table"
      tabIndex={0}
      className="shipment-table-scroll w-full max-w-full overflow-x-scroll overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mainBlue"
    >
      <table className="w-full min-w-[1520px] table-fixed border-separate border-spacing-0 text-left">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            <th className="w-[140px] border-b border-slate-200 px-3 py-3">
              Status
            </th>
            <th className="w-[90px] border-b border-slate-200 px-3 py-3">
              Pro #
            </th>
            <th className="w-[250px] border-b border-slate-200 px-3 py-3">
              Customer
            </th>
            <th className="w-[260px] border-b border-slate-200 px-3 py-3">
              Carrier
            </th>
            <th className="w-[210px] border-b border-slate-200 px-3 py-3">
              Description
            </th>
            <th className="w-[140px] border-b border-slate-200 px-3 py-3 text-right">
              Customer rate
            </th>
            <th className="w-[135px] border-b border-slate-200 px-3 py-3 text-right">
              Carrier rate
            </th>
            <th className="w-[110px] border-b border-slate-200 px-3 py-3 text-right">
              Margin
            </th>
            <th className="w-[130px] border-b border-slate-200 px-3 py-3">
              Mode
            </th>
            <th className="sticky right-0 z-[2] w-20 border-b border-l border-slate-200 bg-slate-50 px-3 py-3 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => {
            const margin = shipment.customerTotal - shipment.carrierTotal;
            return (
              <tr
                key={shipment.pro}
                className="group text-xs transition-colors odd:bg-white even:bg-slate-50/55 hover:bg-blue-50/60"
              >
                <td className="border-b border-slate-100 px-3 py-2.5">
                  <ShipmentStatusBadge status={shipment.status} />
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 font-bold text-blue-600">
                  {shipment.pro}
                </td>
                <td className="max-w-[220px] truncate border-b border-slate-100 px-3 py-2.5 font-semibold text-slate-800">
                  {shipment.customer.name}
                </td>
                <td className="max-w-[220px] truncate border-b border-slate-100 px-3 py-2.5 text-slate-600">
                  {shipment.carrier?.name ?? (
                    <span className="italic text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="max-w-[190px] truncate border-b border-slate-100 px-3 py-2.5 text-slate-600">
                  {shipment.loadDescription}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-right tabular-nums text-slate-700">
                  {currencyFormatter.format(shipment.customerTotal)}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 text-right tabular-nums text-slate-700">
                  {currencyFormatter.format(shipment.carrierTotal)}
                </td>
                <td
                  className={`border-b border-slate-100 px-3 py-2.5 text-right font-semibold tabular-nums ${
                    margin < 0 ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {currencyFormatter.format(margin)}
                </td>
                <td className="border-b border-slate-100 px-3 py-2.5 font-medium text-slate-500">
                  {shipment.mode}
                </td>
                <td className="sticky right-0 z-[1] border-b border-l border-slate-100 bg-inherit px-3 py-2.5 text-center group-hover:bg-blue-50/60">
                  <Link
                    href={routes.shipments.details(shipment.pro)}
                    aria-label={`View shipment ${shipment.pro} details`}
                    title="View shipment"
                    className="mx-auto flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-mainBlue hover:text-mainBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBlue focus-visible:ring-offset-2"
                  >
                    <PiEyeBold className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
