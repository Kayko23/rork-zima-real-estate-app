export function shouldShowPropertyInPublic(p: {
  status: 'active' | 'paused' | 'draft';
  ownerPlan: 'pro-monthly' | 'pro-yearly' | 'none';
}): boolean {
  if (p.status !== 'active') return false;
  if (p.ownerPlan === 'none') return false;
  return true;
}
