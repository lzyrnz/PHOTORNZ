import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to photobooth as dashboard is deprecated in favor of studio stage
  redirect('/photobooth');
}
