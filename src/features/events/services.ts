import * as Schemas from './schemas';
import { env } from '@/lib/env';

/**
 * Service for fetching events from the internal API
 */
export const eventService = {
  /**
   * Fetches a list of events with optional filters and pagination
   */
  async getEvents(options: { page?: number; limit?: number; search?: string; city?: string } = {}) {
    try {
      const { page = 1, limit = 10, search, city } = options;
      const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (city) params.append('city', city);

      const response = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      
      const json = await response.json();
      const result = Schemas.eventListResponseSchema.safeParse(json);
      
      if (!result.success || result.data.status !== 'success') {
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      }
      
      return {
        data: result.data.data || [],
        pagination: result.data.pagination
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
  },

  /**
   * Fetches a list of all unique cities from events
   */
  async getCities() {
    try {
      const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/events`, {
        cache: 'no-store',
      });
      
      if (!response.ok) return [];
      
      const json = await response.json();
      if (json.status !== 'success' || !json.data) return [];
      
      const cities = (json.data as any[])
        .map(event => event.city)
        .filter((city): city is string => !!city);
        
      return [...new Set(cities)].sort();
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  /**
   * Fetches a single event by its slug
   */
  async getEventBySlug(slug: string) {
    try {
      const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/events?slug=${slug}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) return null;
      
      const json = await response.json();

      console.log(json)

      const result = Schemas.singleEventResponseSchema.safeParse(json);

      if (!result.success || result.data.status !== 'success') {
        return null;
      }
      
      return result.data.data || null;
    } catch (error) {
      console.error(`Error fetching event with slug ${slug}:`, error);
      return null;
    }
  }
};
