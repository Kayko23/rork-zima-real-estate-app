export type Plan = { 
  id: string; 
  name: string; 
  price: number; 
  currency: 'XOF' | 'XAF' | 'USD'; 
  interval: 'month' | 'year';
  features: string[];
};

export type PaymentMethod = { 
  id: string; 
  brand: 'visa' | 'mastercard' | 'momo' | 'orange_money'; 
  last4: string; 
  exp: string;
  isDefault: boolean;
};

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export type Subscription = { 
  id: string; 
  planId: string; 
  status: SubscriptionStatus;
  currentPeriodEnd?: string;
  renewsAt?: string;
  canceledAt?: string;
};

export type BillingHistory = {
  id: string;
  type: 'subscription' | 'boost' | 'adjustment';
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'pending' | 'failed';
};

export async function listPlans(): Promise<Plan[]> {
  return [
    { 
      id: 'pro-month', 
      name: 'Pro Mensuel', 
      price: 15000, 
      currency: 'XOF', 
      interval: 'month',
      features: [
        'Annonces illimitées',
        'Badge Vérifié',
        'Support prioritaire',
        'Statistiques avancées',
      ],
    },
    { 
      id: 'pro-year', 
      name: 'Pro Annuel', 
      price: 150000, 
      currency: 'XOF', 
      interval: 'year',
      features: [
        'Annonces illimitées',
        'Badge Vérifié',
        'Badge Premium',
        'Support prioritaire',
        'Statistiques avancées',
        '2 mois gratuits',
      ],
    },
  ];
}

export async function getSubscription(): Promise<Subscription | null> {
  return null;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return [];
}

export async function setDefaultMethod(id: string): Promise<void> {
  console.log('Setting default payment method:', id);
}

export async function addCard(token: string): Promise<PaymentMethod> {
  console.log('Adding card with token:', token);
  return {
    id: 'pm_' + Date.now(),
    brand: 'visa',
    last4: '4242',
    exp: '04/28',
    isDefault: false,
  };
}

export async function removeCard(id: string): Promise<void> {
  console.log('Removing card:', id);
}

export async function subscribe(planId: string, methodId: string): Promise<Subscription> {
  console.log('Subscribing to plan:', planId, 'with method:', methodId);
  return {
    id: 'sub_' + Date.now(),
    planId,
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export async function cancelSubscription(): Promise<void> {
  console.log('Canceling subscription');
}

export async function getBillingHistory(): Promise<BillingHistory[]> {
  return [
    {
      id: '1',
      type: 'boost',
      description: 'Boost annonce #A-3291',
      amount: 5000,
      currency: 'FCFA',
      date: '12/09/2025',
      status: 'paid',
    },
    {
      id: '2',
      type: 'subscription',
      description: 'Abonnement Pro (mois)',
      amount: 15000,
      currency: 'FCFA',
      date: '01/09/2025',
      status: 'paid',
    },
  ];
}
