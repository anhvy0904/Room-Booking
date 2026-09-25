import { shadow } from '../utils/shadow';

export const colors = {
  primary: {
    light: '#CCFBFA',
    main: '#B1E5E6',
  },
  accent: {
    light: '#F7ADAD',
    main: '#F29191',
  },
  neutral: {
    background: '#FFFFFF',
    offWhite: '#F8FAFC',
    textMain: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    border: '#E2E8F0',
    disabled: '#CBD5E1',
  },
  status: {
    success: 'rgba(34, 197, 94, 0.9)',
    error: '#F29191',
    warning: '#F7ADAD',
  }
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.neutral.textMain,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.neutral.textMain,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.neutral.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.neutral.textMain,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
};

export const layout = {
  spacing: {
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadow: {
    soft: shadow(0.05, 12, 4, 2),
  }
};
