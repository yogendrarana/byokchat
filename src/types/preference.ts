export type AppearanceSettings = {
  theme: 'light' | 'dark';
  accentColor?: string;
  fontFamily?: string;
};

export type NotificationSettings = {
  email: {
    campaignReady: boolean;
    renderingComplete: boolean;
    billingAlerts: boolean;
  };
  push: {
    renderingComplete: boolean;
    campaignPerformance: boolean;
  };
};

export type AiDefaults = {
  voice?: string;
  avatar?: string;
  resolution?: '720p' | '1080p' | '4k';
  aspectRatio?: '16:9' | '9:16' | '1:1';
  language?: string;
  model?: string;
  scriptStyle?: 'formal' | 'casual' | 'promo' | 'storytelling';
};

export type BrandingPreferences = {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  watermark?: boolean;
  outro?: {
    text?: string;
    logoUrl?: string;
  };
};

export type ExportPreferences = {
  format: 'mp4' | 'mov' | 'webm';
  includeCaptions: boolean;
  captionStyle?: {
    fontSize: number;
    fontColor: string;
    backgroundColor?: string;
  };
  compression?: 'high' | 'medium' | 'low';
};

export type TeamSettings = {
  inviteOnly: boolean;
  maxMembers: number;
  roles: {
    name: string;
    permissions: string[];
  }[];
};
