import { z } from "zod";

export const accountSchema = z.object({
  role: z.enum(["user", "provider"]),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
}).refine(d => !!d.email || !!d.phone, { 
  message: "Email ou téléphone requis", 
  path: ["email"] 
});

export const profileSchema = z.object({
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(1, "La ville est requise"),
  birthdate: z.string().optional(), // ISO format
  companyName: z.string().optional(),
  category: z.string().optional(), // pour prestataire
  languages: z.array(z.string()).optional(),
});

// Schéma conditionnel pour le profil selon le rôle
export const createProfileSchemaForRole = (role: "user" | "provider") => {
  const baseSchema = {
    country: z.string().min(2, "Le pays est requis"),
    city: z.string().min(1, "La ville est requise"),
    birthdate: z.string().optional(),
    languages: z.array(z.string()).optional(),
  };
  
  if (role === "provider") {
    return z.object({
      ...baseSchema,
      companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
      category: z.string().min(1, "La catégorie de services est requise"),
    });
  }
  
  return z.object({
    ...baseSchema,
    companyName: z.string().optional(),
    category: z.string().optional(),
  });
};

// Schéma pour les documents - tous optionnels pour les particuliers
export const docsSchema = z.object({
  idFront: z.object({ 
    uri: z.string(), 
    name: z.string(), 
    type: z.string() 
  }).nullable().optional(),
  idBack: z.object({ 
    uri: z.string(), 
    name: z.string(), 
    type: z.string() 
  }).nullable().optional(),
  proofAddress: z.object({ 
    uri: z.string(), 
    name: z.string(), 
    type: z.string() 
  }).nullable().optional(),
  proRegistration: z.object({ 
    uri: z.string(), 
    name: z.string(), 
    type: z.string() 
  }).nullable().optional(), // RCCM/CC
  proLicense: z.object({ 
    uri: z.string(), 
    name: z.string(), 
    type: z.string() 
  }).nullable().optional(),
});

// Schéma conditionnel pour les prestataires
export const createDocsSchemaForRole = (role: "user" | "provider") => {
  if (role === "provider") {
    return z.object({
      idFront: z.object({ 
        uri: z.string(), 
        name: z.string(), 
        type: z.string() 
      }).nullable(),
      idBack: z.object({ 
        uri: z.string(), 
        name: z.string(), 
        type: z.string() 
      }).nullable(),
      proofAddress: z.object({ 
        uri: z.string(), 
        name: z.string(), 
        type: z.string() 
  }).nullable(),
      proRegistration: z.object({ 
        uri: z.string(), 
        name: z.string(), 
        type: z.string() 
      }).nullable().optional(),
      proLicense: z.object({ 
        uri: z.string(), 
        name: z.string(), 
        type: z.string() 
      }).nullable().optional(),
    });
  }
  // Pour les particuliers, tous les documents sont optionnels
  return docsSchema;
};

export type AccountForm = z.infer<typeof accountSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type DocsForm = z.infer<typeof docsSchema>;

// Types pour la validation complète
export type CompleteSignupData = {
  account: AccountForm;
  profile: ProfileForm;
  documents: DocsForm;
};