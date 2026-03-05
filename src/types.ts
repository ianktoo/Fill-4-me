export type Platform = 'linkedin' | 'github' | 'twitter' | 'instagram' | 'portfolio' | 'other';

export interface SocialProfile {
  id: string;
  label: string; // e.g., "Work GitHub", "Personal LinkedIn"
  platform: Platform;
  username: string;
  url: string;
  createdAt: number;
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic';

export interface ExtensionSettings {
  autoDetectFields: boolean;
  theme: 'light' | 'dark' | 'system';
  aiProvider: AIProvider;
  apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };
}
