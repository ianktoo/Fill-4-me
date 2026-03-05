import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Settings, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Check, 
  AlertCircle,
  Download,
  Github as GithubIcon,
  Sparkles,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SocialProfile, Platform, ExtensionSettings, AIProvider } from './types';
import { PLATFORMS } from './constants';
import { cn } from './lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

// --- Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent', size?: 'sm' | 'md' | 'lg', asChild?: boolean }>(
  ({ className, variant = 'primary', size = 'md', asChild, ...props }, ref) => {
    const Component = asChild ? ButtonWithAsChild : 'button';
    const variants = {
      primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
      secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
      accent: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    if (asChild) {
      return <ButtonWithAsChild {...props} variant={variants[variant]} size={sizes[size]} className={className} ref={ref} />;
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);

// --- Main App ---

export default function App() {
  const [profiles, setProfiles] = useState<SocialProfile[]>(() => {
    const saved = localStorage.getItem('fill4me_profiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<ExtensionSettings>(() => {
    const saved = localStorage.getItem('fill4me_settings');
    return saved ? JSON.parse(saved) : {
      autoDetectFields: true,
      theme: 'system',
      aiProvider: 'gemini',
      apiKeys: {}
    };
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isMagicFill, setIsMagicFill] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('fill4me_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('fill4me_settings', JSON.stringify(settings));
  }, [settings]);

  const addProfile = (profile: Omit<SocialProfile, 'id' | 'createdAt'>) => {
    const newProfile: SocialProfile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setProfiles([newProfile, ...profiles]);
    setIsAdding(false);
    setIsMagicFill(false);
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProfiles = profiles.filter(p => 
    p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full glass border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Fill-4-Me</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Social Profile Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search profiles..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setIsMagicFill(true)}
            >
              <Sparkles className="w-4 h-4" />
              AI Magic Fill
            </Button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((profile) => (
              <ProfileCard 
                key={profile.id} 
                profile={profile} 
                onDelete={deleteProfile}
                onCopy={copyToClipboard}
                isCopied={copiedId === profile.id}
              />
            ))}
          </AnimatePresence>

          {filteredProfiles.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No profiles found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">
                {searchQuery ? "Try adjusting your search terms." : "Start by adding your first social media profile."}
              </p>
              {!searchQuery && (
                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setIsAdding(true)} variant="secondary">
                    Add Profile
                  </Button>
                  <Button onClick={() => setIsMagicFill(true)} variant="accent" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Use AI Magic Fill
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer / Extension Promo */}
      <footer className="bg-slate-900 text-white py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get the Extension</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Fill-4-Me works best as a browser extension. It automatically detects social media input fields on websites like LinkedIn, GitHub, and Twitter, allowing you to fill them with a single click.
              </p>
              <div className="flex flex-wrap gap-4">
                <p className="text-sm text-slate-500">
                  Available for Chrome and Firefox.
                </p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold">How it works</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">01.</span>
                  Save your various profiles (Work, Personal, Side Projects).
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">02.</span>
                  Navigate to any website with a social media field.
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">03.</span>
                  Click the Fill-4-Me icon in the input field to select a profile.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-500">© {new Date().getFullYear()} Fill-4-Me. Open Source Extension.</p>
              <div className="flex gap-6 text-xs text-slate-500">
                <button onClick={() => setIsSettingsOpen(true)} className="hover:text-white transition-colors">Settings</button>
                <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy</button>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <GithubIcon className="w-3 h-3" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {isAdding && (
          <Modal title="Add New Profile" onClose={() => setIsAdding(false)}>
            <ProfileForm onSubmit={addProfile} onCancel={() => setIsAdding(false)} />
          </Modal>
        )}

        {isMagicFill && (
          <Modal title="AI Magic Fill" onClose={() => setIsMagicFill(false)} icon={<Sparkles className="w-5 h-5 text-indigo-500" />}>
            <MagicFillForm 
              onSubmit={addProfile} 
              onCancel={() => setIsMagicFill(false)} 
              settings={settings}
            />
          </Modal>
        )}

        {isSettingsOpen && (
          <Modal title="Settings" onClose={() => setIsSettingsOpen(false)} icon={<Settings className="w-5 h-5 text-slate-500" />}>
            <SettingsPanel 
              settings={settings} 
              onUpdateSettings={setSettings} 
              onClose={() => setIsSettingsOpen(false)} 
            />
          </Modal>
        )}

        {isPrivacyOpen && (
          <Modal title="Privacy Policy" onClose={() => setIsPrivacyOpen(false)} icon={<ShieldCheck className="w-5 h-5 text-green-500" />}>
            <PrivacyPanel onClose={() => setIsPrivacyOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function Modal({ title, children, onClose, icon }: { title: string, children: React.ReactNode, onClose: () => void, icon?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function ProfileCard({ 
  profile, 
  onDelete, 
  onCopy, 
  isCopied
}: { 
  profile: SocialProfile, 
  onDelete: (id: string) => void, 
  onCopy: (text: string, id: string) => void,
  isCopied: boolean
}) {
  const platform = PLATFORMS.find(p => p.value === profile.platform) || PLATFORMS[PLATFORMS.length - 1];
  const Icon = platform.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white border border-slate-200 rounded-2xl p-5 card-hover flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl bg-slate-50", platform.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onCopy(profile.url, profile.id)} className="h-8 w-8 p-0">
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />}
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
            <a href={profile.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(profile.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 flex-1">
        <h3 className="font-bold text-slate-900 leading-tight mb-1 truncate">{profile.label}</h3>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">{platform.label}</p>
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <p className="text-xs text-slate-500 font-mono break-all line-clamp-2">{profile.url}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileForm({ onSubmit, onCancel, initialData }: { onSubmit: (p: any) => void, onCancel: () => void, initialData?: any }) {
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    platform: initialData?.platform || 'linkedin' as Platform,
    username: initialData?.username || '',
    url: initialData?.url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Profile Label</label>
        <Input 
          placeholder="e.g. My Personal LinkedIn" 
          value={formData.label}
          onChange={e => setFormData({...formData, label: e.target.value})}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Platform</label>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => setFormData({...formData, platform: p.value})}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                formData.platform === p.value 
                  ? "bg-slate-900 border-slate-900 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <p.icon className={cn("w-5 h-5 mb-1", formData.platform === p.value ? "text-white" : p.color)} />
              <span className="text-[10px] font-bold uppercase">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Username (Optional)</label>
        <Input 
          placeholder="e.g. johndoe" 
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Profile URL</label>
        <Input 
          placeholder="https://..." 
          value={formData.url}
          onChange={e => setFormData({...formData, url: e.target.value})}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Save Profile
        </Button>
      </div>
    </form>
  );
}

function MagicFillForm({ onSubmit, onCancel, settings }: { onSubmit: (p: any) => void, onCancel: () => void, settings: ExtensionSettings }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleMagicFill = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);

    const prompt = `Extract social media profile information from the following text. 
    Text: "${input}"
    
    Return a JSON object with:
    - label: A friendly name for the profile
    - platform: One of [linkedin, github, twitter, instagram, portfolio, other]
    - username: The username if found
    - url: The full URL to the profile`;

    try {
      let data: any;

      if (settings.aiProvider === 'gemini') {
        const apiKey = settings.apiKeys.gemini || process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('Gemini API Key missing. Please add it in Settings.');
        
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                platform: { type: Type.STRING },
                username: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["label", "platform", "url"]
            }
          }
        });
        data = JSON.parse(response.text || '{}');
      } else if (settings.aiProvider === 'openai') {
        const apiKey = settings.apiKeys.openai;
        if (!apiKey) throw new Error('OpenAI API Key missing. Please add it in Settings.');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that extracts social media profile data into JSON.' },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
          })
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error.message);
        data = JSON.parse(result.choices[0].message.content);
      } else if (settings.aiProvider === 'anthropic') {
        const apiKey = settings.apiKeys.anthropic;
        if (!apiKey) throw new Error('Anthropic API Key missing. Please add it in Settings.');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [
              { role: 'user', content: prompt + "\n\nIMPORTANT: Return ONLY the JSON object." }
            ]
          })
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error.message);
        const text = result.content[0].text;
        data = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
      }

      setSuggestion(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to extract profile info. Please try again or fill manually.');
    } finally {
      setIsLoading(false);
    }
  };

  if (suggestion) {
    return (
      <div className="space-y-4">
        <div className="p-6 bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            AI Suggestion
          </div>
          <p className="text-sm text-indigo-600">We've extracted the following details. You can edit them before saving.</p>
        </div>
        <ProfileForm 
          initialData={suggestion} 
          onSubmit={onSubmit} 
          onCancel={() => setSuggestion(null)} 
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Paste a bio, link, or text</label>
        <textarea 
          className="w-full h-32 rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          placeholder="e.g. Check out my GitHub at github.com/johndoe or find me on LinkedIn as John Doe"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <p className="text-[10px] text-slate-400 italic">AI will attempt to find the platform, username, and URL for you.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="accent" 
          className="flex-1 gap-2" 
          onClick={handleMagicFill}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Magic Extract
        </Button>
      </div>
    </div>
  );
}

function SettingsPanel({ settings, onUpdateSettings, onClose }: { settings: ExtensionSettings, onUpdateSettings: (s: ExtensionSettings) => void, onClose: () => void }) {
  return (
    <div className="p-6 space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Auto-detect fields</p>
                <p className="text-[10px] text-slate-500">Show fill icon in social inputs</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.autoDetectFields} 
              onChange={e => onUpdateSettings({...settings, autoDetectFields: e.target.checked})}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" 
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">AI Configuration</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">AI Provider</label>
            <select 
              value={settings.aiProvider}
              onChange={e => onUpdateSettings({...settings, aiProvider: e.target.value as AIProvider})}
              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="gemini">Google Gemini (Default)</option>
              <option value="openai">OpenAI (GPT-4o mini)</option>
              <option value="anthropic">Anthropic (Claude 3 Haiku)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              {settings.aiProvider.charAt(0).toUpperCase() + settings.aiProvider.slice(1)} API Key
            </label>
            <Input 
              type="password"
              placeholder={`Enter your ${settings.aiProvider} API key`}
              value={settings.apiKeys[settings.aiProvider] || ''}
              onChange={e => onUpdateSettings({
                ...settings, 
                apiKeys: { ...settings.apiKeys, [settings.aiProvider]: e.target.value }
              })}
            />
            <p className="text-[10px] text-slate-400 italic">
              Keys are stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Data Management</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm" className="w-full" onClick={() => {
            const data = localStorage.getItem('fill4me_profiles');
            const blob = new Blob([data || '[]'], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fill4me_profiles.json';
            a.click();
          }}>Export JSON</Button>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e: any) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (re: any) => {
                try {
                  const data = JSON.parse(re.target.result);
                  localStorage.setItem('fill4me_profiles', JSON.stringify(data));
                  window.location.reload();
                } catch (err) {
                  alert('Invalid JSON file');
                }
              };
              reader.readAsText(file);
            };
            input.click();
          }}>Import JSON</Button>
          <Button variant="danger" size="sm" className="col-span-2 w-full" onClick={() => {
            if (confirm('Are you sure you want to clear all profiles? This cannot be undone.')) {
              localStorage.removeItem('fill4me_profiles');
              window.location.reload();
            }
          }}>Clear All Data</Button>
        </div>
      </section>

      <Button onClick={onClose} className="w-full">Done</Button>
    </div>
  );
}

function PrivacyPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="prose prose-slate prose-sm max-w-none">
        <h3 className="text-lg font-bold">Privacy Policy</h3>
        <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-4 text-sm text-slate-600">
          <p>
            <strong>1. Introduction:</strong> Fill-4-Me is committed to protecting your privacy. This policy explains how we handle your data.
          </p>
          <p>
            <strong>2. Data Collection:</strong> We do <strong>not</strong> collect or store any of your personal data on our servers. All social media profile information you save is stored locally in your browser's storage.
          </p>
          <p>
            <strong>3. AI Magic Fill:</strong> When you use the "AI Magic Fill" feature, the text you provide is sent to Google's Gemini API for processing. This data is used only for extraction and is not stored by Fill-4-Me.
          </p>
          <p>
            <strong>4. Third-Party Services:</strong> We do not share your data with any third parties. The extension interacts only with the websites you visit to provide auto-fill functionality.
          </p>
          <p>
            <strong>5. Security:</strong> Since your data is stored locally, its security depends on your device's security. We recommend keeping your browser and OS updated.
          </p>
          <p>
            <strong>6. Changes:</strong> We may update this policy from time to time. Any changes will be reflected here.
          </p>
        </div>
      </div>
      <Button onClick={onClose} className="w-full">Close</Button>
    </div>
  );
}

const ButtonWithAsChild = React.forwardRef<any, any>(({ children, variant, size, className, ...props }, ref) => {
  const child = React.Children.only(children) as React.ReactElement<any>;
  return React.cloneElement(child, {
    ...props,
    className: cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50',
      variant,
      size,
      className,
      child.props.className
    ),
    ref
  } as any);
});

