import ShipmentsWorkspace from '@/app/shared/shipments';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Shipments'),
};

export default function ShipmentsPage() {
  return <ShipmentsWorkspace />;
}
