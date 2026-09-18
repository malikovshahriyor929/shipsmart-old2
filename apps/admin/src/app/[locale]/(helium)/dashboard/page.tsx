import AdminDashboard from '@/app/shared/admin-dashboard/dashboard';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Dashboard'),
};

export default function DashboardPage() {
  return <AdminDashboard />;
}
