import type { Metadata } from 'next';
import LandingLayout from '@/layouts/landing/landing-layout';
import PublicShipmentTracker from './public-shipment-tracker';

export const metadata: Metadata = {
  title: 'Track Shipment | ShipSmart',
  description:
    'Track a ShipSmart load by number and open its live MacroPoint tracking view.',
};

export default function Page() {
  return (
    <LandingLayout className="bg-[#f2f2f2]">
      <PublicShipmentTracker />
    </LandingLayout>
  );
}
