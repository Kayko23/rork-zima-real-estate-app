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
  country: z.string().min(2),
  city: z.string().min(1),
  birthdate: z.string().optional(), // ISO format
  companyName: z.string().optional(),
  category: z.string().optional(), // pour prestataire
  languages: z.array(z.string()).optional(),
});

export const docsSchema = z.object({
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
  }).nullable(), // RCCM/CC
  proLicense: z.object({ 
    uri: z.string(), 
    name: z.string(), 
    type: z.string() 
  }).nullable(),
});

export type AccountForm = z.infer<typeof accountSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type DocsForm = z.infer<typeof docsSchema>;