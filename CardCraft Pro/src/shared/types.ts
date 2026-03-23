import z from "zod";

// User types
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["user", "admin", "premium"]),
  isActive: z.boolean(),
  createdAt: z.string(),
  lastLogin: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Template types
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["basic", "luxury"]),
  description: z.string(),
  imageUrl: z.string(),
  price: z.number(),
  features: z.array(z.string()),
});

export type Template = z.infer<typeof TemplateSchema>;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

// Review types
export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  templateName: string;
  templateId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
