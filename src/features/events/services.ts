import * as Schemas from './schemas';

/**
 * Service for fetching events from the internal API
 */
export const eventService = {
  /**
   * Fetches a list of all events
   */
  async getEvents() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/events`, {
        cache: 'no-store', // Ensure fresh data
      });
      
      if (!response.ok) return [];
      
      const json = await response.json();
      const result = Schemas.eventListResponseSchema.safeParse(json);
      
      if (!result.success || result.data.status !== 'success') {
        return [];
      }
      
      return result.data.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  /**
   * Fetches a single event by its slug
   */
  async getEventBySlug(slug: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/events?slug=${slug}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) return null;
      
      const json = await response.json();

      console.log(json)

      const result = Schemas.singleEventResponseSchema.safeParse(json);

      console.log("Result ", result)
      
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
