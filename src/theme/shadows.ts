import { colors } from './colors';

export const shadows = {
  soft: {
    shadowColor: '#020617',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  card: {
    shadowColor: '#020617',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  floating: {
    shadowColor: '#020617',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 9
  },
  glow: {
    shadowColor: colors.secondary,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8
  }
};
