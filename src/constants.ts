import { Platform } from './types';
import { Github, Linkedin, Twitter, Instagram, Globe, Link2 } from 'lucide-react';

export const PLATFORMS: { value: Platform; label: string; icon: any; color: string }[] = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-[#0A66C2]' },
  { value: 'github', label: 'GitHub', icon: Github, color: 'text-[#24292F]' },
  { value: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'text-[#1DA1F2]' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-[#E4405F]' },
  { value: 'portfolio', label: 'Portfolio', icon: Globe, color: 'text-[#10B981]' },
  { value: 'other', label: 'Other', icon: Link2, color: 'text-[#6B7280]' },
];
