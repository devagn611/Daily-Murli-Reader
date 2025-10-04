// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Murli related types
export interface Murli {
  id: string;
  title: string;
  date: string;
  content: string;
  language: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  code: string;
  name: string;
  isActive: boolean;
}

export interface SearchResult {
  title: string;
  date: string;
  excerpt: string;
  relevance: number;
}

export interface SearchResponse {
  query: string;
  language: string;
  results: SearchResult[];
  total: number;
  limit: number;
  offset?: number;
}

// Health check types
export interface HealthCheck {
  status: 'OK' | 'ERROR';
  message: string;
  timestamp: string;
  uptime: number;
}

export interface DetailedHealthCheck extends HealthCheck {
  memory: NodeJS.MemoryUsage;
  version: string;
  environment: string;
}