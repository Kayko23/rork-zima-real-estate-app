export const T = {
  h1: { fontSize: 30, lineHeight: 36, fontWeight: '800' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '800' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '700' as const },
  title: { fontSize: 16, lineHeight: 20, fontWeight: '700' as const },
  body: { fontSize: 14, lineHeight: 18, fontWeight: '600' as const, color: '#111827' },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  muted: { fontSize: 13, lineHeight: 18, color: '#6B7280' },
} as const;

export const Type = {
  h1: { fontSize: 30, lineHeight: 36, fontWeight: '800' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '800' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '700' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  tiny: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
} as const;

export type TypeKeys = keyof typeof Type;

export const typography = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '800' as const },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  small: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
} as const;
