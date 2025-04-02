import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import BusinessPlanForm from './businessPlanForm';

export default async function BusinessPlanPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/auth?callbackUrl=/business-plan');
  }

  return <BusinessPlanForm />;
}