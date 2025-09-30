import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildQuickReplies, UserRole, ThreadContext } from '@/components/chat/quickReplies';

type QuickReply = { id: string; text: string };

const STORAGE_KEY = (role: UserRole) => `qr:last:${role}`;

type UseQuickRepliesArgs = {
  role: UserRole;
  ctx: ThreadContext;
  locale?: 'fr' | 'en';
  hasAppointment?: boolean;
  hasDocs?: boolean;
  listingTitle?: string;
};

export function useQuickReplies(args: UseQuickRepliesArgs) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY(args.role)).then((val) => {
      if (val) {
        try {
          setRecent(JSON.parse(val));
        } catch {
          setRecent([]);
        }
      }
    });
  }, [args.role]);

  const contextual = useMemo(() => {
    const base = buildQuickReplies({
      role: args.role,
      ctx: args.ctx,
      locale: args.locale || 'fr',
      hasAppointment: args.hasAppointment,
      hasDocs: args.hasDocs,
    });

    if (args.listingTitle && args.role === 'client') {
      base.unshift({
        id: 'interested',
        text: args.locale === 'en' 
          ? `Interested in "${args.listingTitle}"` 
          : `Intéressé par "${args.listingTitle}"`,
      });
    }

    return base;
  }, [args]);

  const merged = useMemo(() => {
    const seen = new Set<string>();
    const all = [...recent, ...contextual.map(c => c.text)];
    return all.filter((t) => (seen.has(t) ? false : (seen.add(t), true)));
  }, [recent, contextual]);

  async function remember(text: string) {
    const next = [text, ...recent.filter((t) => t !== text)].slice(0, 8);
    setRecent(next);
    await AsyncStorage.setItem(STORAGE_KEY(args.role), JSON.stringify(next));
  }

  const replies: QuickReply[] = merged.map((t, i) => ({ 
    id: `${i}-${t.slice(0, 6)}`, 
    text: t 
  }));

  return { replies, remember };
}
