export type UserRole = "client" | "provider" | "admin";
export type ThreadContext = "property" | "service" | "trip";

type Reply = { id: string; text: string };
type BuildArgs = {
  role: UserRole;
  ctx: ThreadContext;
  hasAppointment?: boolean;
  hasDocs?: boolean;
  locale?: "fr" | "en";
};

export function buildQuickReplies(a: BuildArgs): Reply[] {
  const t = (fr: string, en: string) => (a.locale === "en" ? en : fr);

  if (a.role === "client") {
    if (a.ctx === "property") {
      const base: Reply[] = [
        { id: "docs",  text: t("Puis-je voir la documentation ?", "Could I see the paperwork?") },
        { id: "visit", text: t("Puis-je avoir un rendez-vous ?", "Can I book a viewing?") },
        { id: "price", text: t("Quel est le prix ?", "What's the price?") },
        { id: "avail", text: t("Est-ce disponible ?", "Is it available?") },
      ];
      if (a.hasAppointment) base.unshift({ id: "confirm", text: t("Confirmer le rendez-vous 👍", "Confirm the appointment 👍") });
      return base;
    }
    if (a.ctx === "trip") {
      return [
        { id: "dates", text: t("Ces dates sont-elles libres ?", "Are these dates available?") },
        { id: "policy", text: t("Conditions d'annulation ?", "What's the cancellation policy?") },
        { id: "priceNight", text: t("Prix par nuit & frais ?", "Nightly price & fees?") },
        { id: "amenities", text: t("Équipements inclus ?", "Which amenities are included?") },
      ];
    }
    // service
    return [
      { id: "scope", text: t("Que comprend la prestation ?", "What's included in the service?") },
      { id: "quote", text: t("Pouvez-vous m'envoyer un devis ?", "Could you send a quote?") },
      { id: "when", text: t("Vos disponibilités ?", "Your availability?") },
    ];
  }

  // provider
  if (a.ctx === "property") {
    const r: Reply[] = [
      { id: "shareDocs", text: t("Voici la documentation 📎", "Here are the documents 📎") },
      { id: "slots",     text: t("Créneaux de visite proposés", "Suggested viewing slots") },
      { id: "location",  text: t("Partager l'emplacement", "Share location") },
    ];
    if (!a.hasAppointment) r.unshift({ id: "invite", text: t("Souhaitez-vous une visite ?", "Would you like a viewing?") });
    return r;
  }
  if (a.ctx === "trip") {
    return [
      { id: "offer", text: t("Proposer une offre spéciale", "Send special offer") },
      { id: "rules", text: t("Rappel des règles du séjour", "House rules reminder") },
      { id: "checkin", text: t("Infos check-in / check-out", "Check-in / out info") },
    ];
  }
  // service
  return [
    { id: "scopeProv", text: t("Détails de la prestation", "Service scope details") },
    { id: "priceProv", text: t("Tarif & modalités", "Price & terms") },
    { id: "slotProv",  text: t("Proposer un créneau", "Propose a time") },
  ];
}