// Import Zod for schema validation and type inference
import { z } from 'zod';

/**
 * SignInRequest
 * -------------
 * Represents User
 */
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * SignInRequest
 * -------------
 * Represents the payload for user sign-in.
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * SignUpRequest
 * -------------
 * Represents the payload for user registration.
 * Includes password confirmation for client-side validation.
 */
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

/**
 * Authentication
 * --------------
 * Represents the authentication response returned after successful login or registration.
 * Includes both tokens and the authenticated expert profile.
 */
export interface Authentication {
  accessToken: string;
  refreshToken: string;
  user: User | null;
}

/**
 * profileSchema
 * --------------
 * Zod validation schema for user profile data.
 * Enforces required and optional fields, string length limits,
 * and proper email formatting.
 */
export const profileSchema = z.object({
  // Full name (required, 1–100 characters)
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),

  // Valid email format required
  email: z.string().email('Must be a valid email address'),

  // Optional job title (nullable, max 200 chars)
  title: z.string().max(200, 'Title must be less than 200 characters').nullable().optional(),

  // Optional biography (nullable, max 1000 chars)
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').nullable().optional(),

  // Optional experience field (nullable, max 50 chars)
  experience: z
    .string()
    .max(50, 'Experience must be less than 50 characters')
    .nullable()
    .optional(),
});

/**
 * ProfileFormData
 * ----------------
 * Combines validated profile schema fields with a unique identifier (`id`).
 * Used for updating or editing a user’s profile.
 */
export type ProfileFormData = z.infer<typeof profileSchema> & { id: string };
