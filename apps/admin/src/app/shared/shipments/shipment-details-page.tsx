'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PiArrowLeftBold,
  PiSpinnerGapBold,
  PiWarningCircleBold,
} from 'react-icons/pi';
import { routes } from '@/config/routes';
import { getShipmentDetails, getShipments } from './api';
import { shipmentListItemToDetail } from './adapters';
import { demoShipmentDetails, demoShipments } from './demo-data';
import ShipmentAdminDetail from './shipment-admin-detail';
import type { ShipmentDetail } from './types';

function getDemoShipmentDetail(pro: number) {
  const shipment = demoShipments.find((item) => item.pro === pro);
  if (!shipment) return null;
  return demoShipmentDetails[pro] ?? shipmentListItemToDetail(shipment);
}

export default function ShipmentDetailsPage({ pro }: { pro: number }) {
  const [shipment, setShipment] = useState<ShipmentDetail | null>(() =>
    getDemoShipmentDetail(pro)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadShipment() {
      setIsLoading(true);
      try {
        const shipments = await getShipments(controller.signal);
        const listItem = shipments.find((item) => item.pro === pro);
        if (!listItem) {
          throw new Error(`Shipment ${pro} was not found.`);
        }
        const detail = await getShipmentDetails(listItem, controller.signal);
        setShipment(detail);
        setNotice('');
      } catch {
        if (controller.signal.aborted) return;
        const fallback = getDemoShipmentDetail(pro);
        setShipment(fallback);
        setNotice(
          fallback
            ? 'API unavailable — showing attached sample data.'
            : `Shipment ${pro} could not be found.`
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadShipment();
    return () => controller.abort();
  }, [pro]);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={routes.shipments.list}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBlue focus-visible:ring-offset-2"
        >
          <PiArrowLeftBold className="h-4 w-4" />
          Back to shipments
        </Link>
        {isLoading ? (
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <PiSpinnerGapBold className="h-4 w-4 animate-spin text-mainBlue" />
            Loading latest details
          </span>
        ) : null}
      </div>

      {notice ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <PiWarningCircleBold className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice}</p>
        </div>
      ) : null}

      {shipment ? (
        <ShipmentAdminDetail shipment={shipment} loading={isLoading} />
      ) : isLoading ? (
        <section className="flex min-h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <PiSpinnerGapBold className="h-5 w-5 animate-spin text-mainBlue" />
            Loading shipment details
          </span>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <PiWarningCircleBold className="mx-auto h-9 w-9 text-slate-300" />
          <h1 className="mt-3 text-lg font-bold text-slate-900">
            Shipment not found
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Check the PRO number or return to the shipments list.
          </p>
        </section>
      )}
    </div>
  );
}
