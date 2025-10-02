import { ProStatus } from '@/types/pro';

export class PublicationGuardError extends Error {
  constructor(
    message: string,
    public action?: { label: string; route: string }
  ) {
    super(message);
    this.name = 'PublicationGuardError';
  }
}

export function assertCanPublish(
  proStatus: ProStatus,
  hasAllDocs: boolean = true
): void {
  if (proStatus === 'none' || proStatus === 'draft') {
    throw new PublicationGuardError(
      'Vous devez compléter votre vérification KYC pour publier des annonces.',
      { label: 'Compléter maintenant', route: '/pro/onboarding' }
    );
  }

  if (proStatus === 'pending_review') {
    throw new PublicationGuardError(
      'Votre profil est en cours de vérification. Vous pourrez publier une fois validé.',
      { label: 'Voir le statut', route: '/pro/status?status=pending_review' }
    );
  }

  if (proStatus === 'rejected') {
    throw new PublicationGuardError(
      'Votre profil a été refusé. Veuillez corriger les informations.',
      { label: 'Corriger maintenant', route: '/pro/onboarding' }
    );
  }

  if (!hasAllDocs) {
    throw new PublicationGuardError(
      'Veuillez ajouter tous les justificatifs requis pour ce bien.',
      { label: 'Ajouter les documents', route: '' }
    );
  }
}

export function canAccessProFeatures(proStatus: ProStatus): boolean {
  return proStatus === 'verified';
}

export function getProStatusMessage(proStatus: ProStatus): string {
  switch (proStatus) {
    case 'none':
      return 'Complétez votre vérification pour accéder aux fonctionnalités pro';
    case 'draft':
      return 'Finalisez votre demande de vérification';
    case 'pending_review':
      return 'Votre profil est en cours de vérification';
    case 'verified':
      return 'Profil vérifié';
    case 'rejected':
      return 'Votre demande a été refusée. Veuillez corriger les informations.';
    default:
      return '';
  }
}
