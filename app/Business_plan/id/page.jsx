import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import BusinessPlanDetail from './BusinessPlanDetail';

export default async function BusinessPlanDetailPage({ params }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  
  return <BusinessPlanDetail id={params.id} userId={user.id} />;
}