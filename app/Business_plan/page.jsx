import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import BusinessPlanForm from './businessPlanForm';

export default async function BusinessPlanPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in?redirect_url=/business-plan');
  }

  return <BusinessPlanForm userId={user.id} />;
}