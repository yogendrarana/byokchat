import { Building, Crown, Gift, Zap } from 'lucide-react';

export const Plan = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  AGENCY: 'agency',
} as const;

export type TPlan = (typeof Plan)[keyof typeof Plan];

export const creditOptions: Record<TPlan, number[]> = {
  free: [],
  starter: [100, 250, 500, 750, 1000],
  pro: [500, 1000, 1500, 2000, 3000],
  agency: [1000, 2000, 3000, 5000, 7500, 10000],
};

export const pricing: Array<{
  id: TPlan;
  name: string;
  basePrice?: number;
  price?: number;
  baseCredits?: number;
  credits?: number;
  icon: React.ElementType;
  description: string;
  color: string;
  recommended?: boolean;
  features: Array<string>;
}> = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    icon: Gift,
    description: 'Try the basics of our AI video creator',
    color: 'slate',
    features: ['Prompt-only generation', 'Watermarked videos', 'SD export only', 'Basic script generation', 'Community support', 'Personal use only'],
  },
  {
    id: 'starter',
    name: 'Starter',
    basePrice: 19,
    baseCredits: 40,
    icon: Zap,
    description: 'Perfect for small teams and creators',
    color: 'emerald',
    recommended: true,
    features: ['Script input', 'No watermark', 'HD export', 'AI script generation', 'Email support', 'Commercial use rights'],
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    basePrice: 49,
    baseCredits: 120,
    icon: Crown,
    description: 'Professional-grade tools and quality',
    color: 'slate',
    features: [
      'Image input support',
      'AI voiceovers',
      'Premium templates',
      'Advanced AI scripting',
      'Priority chat support',
      'Extended licensing',
      'Custom branding',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    basePrice: 129,
    baseCredits: 300,
    icon: Building,
    description: 'Built for large teams and enterprises',
    color: 'slate',
    features: [
      'Brand kit support',
      'Multiple export formats',
      'Bulk video generation',
      'White-label options',
      'Dedicated manager',
      'Team tools & analytics',
      'API access',
    ],
  },
];
