export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          event_id: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          max_age: number
          min_age: number
          name: string
        }
        Insert: {
          created_at?: string
          event_id: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          max_age: number
          min_age: number
          name: string
        }
        Update: {
          created_at?: string
          event_id?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          max_age?: number
          min_age?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_gallery: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number | null
          event_id: string
          id: string
          image_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          event_id: string
          id?: string
          image_url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          event_id?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_gallery_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsors: {
        Row: {
          created_at: string
          display_order: number | null
          event_id: string
          id: string
          link_url: string | null
          logo_url: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          event_id: string
          id?: string
          link_url?: string | null
          logo_url: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          event_id?: string
          id?: string
          link_url?: string | null
          logo_url?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          city: string | null
          created_at: string
          description: string | null
          event_date: string
          event_time: string
          has_inventory: boolean | null
          id: string
          logo_url: string | null
          manager_id: string
          name: string
          organization: Json | null
          payment_info: Json | null
          route_description: string | null
          route_image_url: string | null
          rules_text: string | null
          slug: string
          social_media: Json | null
          strava_url: string | null
        }
        Insert: {
          banner_url?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string
          has_inventory?: boolean | null
          id?: string
          logo_url?: string | null
          manager_id: string
          name: string
          organization?: Json | null
          payment_info?: Json | null
          route_description?: string | null
          route_image_url?: string | null
          rules_text?: string | null
          slug: string
          social_media?: Json | null
          strava_url?: string | null
        }
        Update: {
          banner_url?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string
          has_inventory?: boolean | null
          id?: string
          logo_url?: string | null
          manager_id?: string
          name?: string
          organization?: Json | null
          payment_info?: Json | null
          route_description?: string | null
          route_image_url?: string | null
          rules_text?: string | null
          slug?: string
          social_media?: Json | null
          strava_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      managers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          role: string
          telegram_chat_id: number | null
          telegram_notifications_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean | null
          name: string
          role?: string
          telegram_chat_id?: number | null
          telegram_notifications_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
          telegram_chat_id?: number | null
          telegram_notifications_enabled?: boolean | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_usd: number
          amount_ves: number
          exchange_rate_bcv: number
          id: string
          receipt_url: string | null
          reference_number: string | null
          registration_id: string
          reported_at: string
        }
        Insert: {
          amount_usd: number
          amount_ves: number
          exchange_rate_bcv: number
          id?: string
          receipt_url?: string | null
          reference_number?: string | null
          registration_id: string
          reported_at?: string
        }
        Update: {
          amount_usd?: number
          amount_ves?: number
          exchange_rate_bcv?: number
          id?: string
          receipt_url?: string | null
          reference_number?: string | null
          registration_id?: string
          reported_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_stages: {
        Row: {
          created_at: string
          event_id: string
          id: string
          is_active: boolean | null
          name: string
          price_usd: number
          total_capacity: number
          used_capacity: number | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          is_active?: boolean | null
          name: string
          price_usd: number
          total_capacity: number
          used_capacity?: number | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          price_usd?: number
          total_capacity?: number
          used_capacity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_stages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          birth_date: string
          category_id: string
          chip_id: string | null
          created_at: string
          dni: string
          dorsal_number: number | null
          email: string
          event_id: string
          expires_at: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          last_name: string
          shirt_size: string | null
          stage_id: string
          status: Database["public"]["Enums"]["registration_status"]
        }
        Insert: {
          birth_date: string
          category_id: string
          chip_id?: string | null
          created_at?: string
          dni: string
          dorsal_number?: number | null
          email: string
          event_id: string
          expires_at: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name: string
          shirt_size?: string | null
          stage_id: string
          status?: Database["public"]["Enums"]["registration_status"]
        }
        Update: {
          birth_date?: string
          category_id?: string
          chip_id?: string | null
          created_at?: string
          dni?: string
          dorsal_number?: number | null
          email?: string
          event_id?: string
          expires_at?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name?: string
          shirt_size?: string | null
          stage_id?: string
          status?: Database["public"]["Enums"]["registration_status"]
        }
        Relationships: [
          {
            foreignKeyName: "registrations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "registration_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          category_rank: number | null
          created_at: string
          event_id: string
          formatted_time: string | null
          general_rank: number | null
          id: string
          registration_id: string
          total_seconds: number | null
        }
        Insert: {
          category_rank?: number | null
          created_at?: string
          event_id: string
          formatted_time?: string | null
          general_rank?: number | null
          id?: string
          registration_id: string
          total_seconds?: number | null
        }
        Update: {
          category_rank?: number | null
          created_at?: string
          event_id?: string
          formatted_time?: string | null
          general_rank?: number | null
          id?: string
          registration_id?: string
          total_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_verification_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          manager_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          manager_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          manager_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telegram_verification_codes_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      register_athlete: {
        Args: {
          p_birth_date: string
          p_category_id: string
          p_dni: string
          p_email: string
          p_event_id: string
          p_expires_at: string
          p_first_name: string
          p_gender: Database["public"]["Enums"]["gender_type"]
          p_last_name: string
          p_payment_data?: Json
          p_shirt_size: string
          p_stage_id: string
          p_status: Database["public"]["Enums"]["registration_status"]
        }
        Returns: string
      }
    }
    Enums: {
      gender_type: "MALE" | "FEMALE" | "MIXED"
      registration_status:
        | "PENDING"
        | "REPORTED"
        | "APPROVED"
        | "REJECTED"
        | "EXPIRED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["MALE", "FEMALE", "MIXED"],
      registration_status: [
        "PENDING",
        "REPORTED",
        "APPROVED",
        "REJECTED",
        "EXPIRED",
      ],
    },
  },
} as const
