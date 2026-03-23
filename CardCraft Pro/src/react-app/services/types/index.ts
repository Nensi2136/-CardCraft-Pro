export interface CardTemplate {
  id: number;
  name: string;
  description: string;
  templateData: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
  filePath?: string;
  isPremium?: boolean;
  title?: string;
}

export interface CreateCardTemplate {
  name: string;
  description: string;
  templateData: string;
  categoryId: number;
  isPremium: boolean;
}

export interface UpdateCardTemplate {
  name?: string;
  description?: string;
  templateData?: string;
  categoryId?: number;
  isPremium?: boolean;
}

export interface TemplateCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}
