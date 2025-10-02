type PropertyStatus = 'active' | 'paused' | 'draft';
type OwnerPlan = 'pro-monthly' | 'pro-yearly' | 'none';

export interface PropertyWithVisibility {
  status: PropertyStatus;
  ownerPlan: OwnerPlan;
}

export function shouldShowPropertyInPublic(property: PropertyWithVisibility): boolean {
  if (property.status !== 'active') {
    return false;
  }
  
  if (property.ownerPlan === 'none') {
    return false;
  }
  
  return true;
}

export function filterPublicProperties<T extends PropertyWithVisibility>(properties: T[]): T[] {
  return properties.filter(shouldShowPropertyInPublic);
}

export function sortPremiumFirst<T extends { isPremium?: boolean; createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}
