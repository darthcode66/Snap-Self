/**
 * Application-wide constants
 */

export const APP_NAME = 'Snap-Self';
export const APP_DESCRIPTION =
  'Sistema Inteligente para Fotógrafos - Plataforma all-in-one com IA';

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// File Upload Limits
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILES_PER_UPLOAD = 100;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/raw',
  'image/x-canon-cr2',
  'image/x-nikon-nef',
  'image/x-sony-arw',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    storage: 5 * 1024 * 1024 * 1024, // 5GB
    maxProjects: 3,
    features: ['5GB storage', '3 projects', 'Basic AI', 'Events mode only'],
  },
  STARTER: {
    name: 'Starter',
    price: 39,
    storage: 50 * 1024 * 1024 * 1024, // 50GB
    maxProjects: 50,
    features: [
      '50GB storage',
      '50 projects',
      'Basic AI',
      'Events mode',
      'Galleries',
      'Payments',
    ],
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 89,
    storage: 250 * 1024 * 1024 * 1024, // 250GB
    maxProjects: -1, // Unlimited
    features: [
      '250GB storage',
      'Unlimited projects',
      'Advanced AI',
      'Events + School modes',
      'Tethering',
      'CRM',
      'Priority support',
    ],
  },
  BUSINESS: {
    name: 'Business',
    price: 149,
    storage: 1024 * 1024 * 1024 * 1024, // 1TB
    maxProjects: -1, // Unlimited
    features: [
      '1TB storage',
      'Unlimited projects',
      'Advanced AI',
      'All modes',
      'Advanced tethering',
      'White-label',
      'API access',
      '5 team members',
      'Priority support',
    ],
  },
} as const;

// AI Configuration
export const AI_ANALYSIS_TIMEOUT = 30000; // 30 seconds
export const AI_QUALITY_THRESHOLD = 70; // Minimum quality score

// School Mode
export const SCHOOL_MAX_STUDENTS_PER_CLASS = 50;
export const SCHOOL_MAX_CLASSES_PER_SCHOOL = 100;

// Events Mode
export const GALLERY_MAX_PHOTOS = 1000;
export const GALLERY_SLUG_LENGTH = 8;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Você precisa estar autenticado para acessar este recurso',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso',
  NOT_FOUND: 'Recurso não encontrado',
  INTERNAL_SERVER: 'Erro interno do servidor. Tente novamente mais tarde.',
  INVALID_FILE_TYPE: 'Tipo de arquivo não suportado',
  FILE_TOO_LARGE: `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  STORAGE_LIMIT: 'Limite de armazenamento atingido. Faça upgrade do seu plano.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PHOTO_UPLOADED: 'Foto enviada com sucesso',
  GALLERY_CREATED: 'Galeria criada com sucesso',
  PROJECT_CREATED: 'Projeto criado com sucesso',
  SCHOOL_CREATED: 'Escola criada com sucesso',
  SESSION_STARTED: 'Sessão iniciada com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EVENTS: '/dashboard/events',
  SCHOOL: '/dashboard/school',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/profile',
} as const;
