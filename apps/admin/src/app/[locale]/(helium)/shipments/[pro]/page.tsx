import { notFound } from 'next/navigation';
import ShipmentDetailsPage from '@/app/shared/shipments/shipment-details-page';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Shipment Details'),
};

export default async function ShipmentDetailRoute({
  params,
}: {
  params: Promise<{ pro: string }>;
}) {
  const { pro } = await params;
  const shipmentPro = Number(pro);

  if (!Number.isInteger(shipmentPro) || shipmentPro <= 0) {
    notFound();
  }

  return <ShipmentDetailsPage pro={shipmentPro} />;
}
