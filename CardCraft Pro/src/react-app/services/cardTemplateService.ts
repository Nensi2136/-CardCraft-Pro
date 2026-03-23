import { apiClient } from './api/client';
import { API_CONFIG } from './api/config';
import { 
  CardTemplate, 
  CreateCardTemplate, 
  UpdateCardTemplate, 
  PaginatedResponse 
} from './types';
import { ApiResponse } from './types/api';

export class CardTemplateService {
  async getTemplates(params?: {
    page?: number;
    pageSize?: number;
    categoryId?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<CardTemplate>>> {
    const searchParams: Record<string, string> = {};
    
    if (params?.page) searchParams.page = params.page.toString();
    if (params?.pageSize) searchParams.pageSize = params.pageSize.toString();
    if (params?.categoryId) searchParams.categoryId = params.categoryId.toString();
    if (params?.search) searchParams.search = params.search;

    return apiClient.get<PaginatedResponse<CardTemplate>>(
      API_CONFIG.ENDPOINTS.TEMPLATES.BASE,
      Object.keys(searchParams).length > 0 ? searchParams : undefined
    );
  }

  async getTemplate(id: number): Promise<ApiResponse<CardTemplate>> {
    return apiClient.get<CardTemplate>(API_CONFIG.ENDPOINTS.TEMPLATES.BY_ID(id.toString()));
  }

  async createTemplate(template: CreateCardTemplate): Promise<ApiResponse<CardTemplate>> {
    return apiClient.post<CardTemplate>(API_CONFIG.ENDPOINTS.TEMPLATES.BASE, template);
  }

  async updateTemplate(id: number, template: UpdateCardTemplate): Promise<ApiResponse<void>> {
    return apiClient.put<void>(API_CONFIG.ENDPOINTS.TEMPLATES.BY_ID(id.toString()), template);
  }

  async deleteTemplate(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_CONFIG.ENDPOINTS.TEMPLATES.BY_ID(id.toString()));
  }

  async saveLuxuryCard(cardData: {
    name: string;
    [key: string]: unknown;
  }): Promise<ApiResponse<CardTemplate>> {
    const templateData = JSON.stringify(cardData);
    const template: CreateCardTemplate = {
      name: `${cardData.name} - Luxury Card`,
      description: `Custom luxury business card for ${cardData.name}`,
      templateData,
      categoryId: 1, // Default category
    };

    return this.createTemplate(template);
  }

  async loadLuxuryCard(id: number): Promise<ApiResponse<unknown>> {
    const response = await this.getTemplate(id);
    if (response.data) {
      try {
        const cardData = JSON.parse(response.data.templateData);
        return {
          success: true,
          data: cardData,
          statusCode: response.statusCode,
        };
      } catch (error) {
        return {
          success: false,
          message: 'Invalid template data format',
          statusCode: 400,
        };
      }
    }
    return response;
  }
}

export const cardTemplateService = new CardTemplateService();
