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
      about_paragraphs: {
        Row: {
          body_cs: string
          body_en: string | null
          created_at: string
          id: string
          sort_order: number
        }
        Insert: {
          body_cs: string
          body_en?: string | null
          created_at?: string
          id?: string
          sort_order?: number
        }
        Update: {
          body_cs?: string
          body_en?: string | null
          created_at?: string
          id?: string
          sort_order?: number
        }
        Relationships: []
      }
      about_values: {
        Row: {
          created_at: string
          desc_cs: string | null
          desc_en: string | null
          id: string
          sort_order: number
          title_cs: string
          title_en: string | null
        }
        Insert: {
          created_at?: string
          desc_cs?: string | null
          desc_en?: string | null
          id?: string
          sort_order?: number
          title_cs: string
          title_en?: string | null
        }
        Update: {
          created_at?: string
          desc_cs?: string | null
          desc_en?: string | null
          id?: string
          sort_order?: number
          title_cs?: string
          title_en?: string | null
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          created_at: string
          created_by: string | null
          featured_order: number
          featured_slot: number | null
          hero_order: number
          hero_slot: number | null
          id: string
          image_url: string
          is_featured: boolean
          is_hero: boolean
          ratio: string
          sort_order: number
          storage_path: string
          tag: string | null
          title_cs: string
          title_en: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          featured_order?: number
          featured_slot?: number | null
          hero_order?: number
          hero_slot?: number | null
          id?: string
          image_url: string
          is_featured?: boolean
          is_hero?: boolean
          ratio?: string
          sort_order?: number
          storage_path: string
          tag?: string | null
          title_cs: string
          title_en?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          featured_order?: number
          featured_slot?: number | null
          hero_order?: number
          hero_slot?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean
          is_hero?: boolean
          ratio?: string
          sort_order?: number
          storage_path?: string
          tag?: string | null
          title_cs?: string
          title_en?: string | null
        }
        Relationships: []
      }
      gallery_tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      page_texts: {
        Row: {
          key: string
          updated_at: string
          value_cs: string | null
          value_en: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value_cs?: string | null
          value_en?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value_cs?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
      pricing_items: {
        Row: {
          created_at: string
          id: string
          price_cs: string | null
          price_en: string | null
          sort_order: number
          title_cs: string
          title_en: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          price_cs?: string | null
          price_en?: string | null
          sort_order?: number
          title_cs: string
          title_en?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          price_cs?: string | null
          price_en?: string | null
          sort_order?: number
          title_cs?: string
          title_en?: string | null
        }
        Relationships: []
      }
      pricing_packages: {
        Row: {
          created_at: string
          desc_cs: string | null
          desc_en: string | null
          featured: boolean
          features_cs: string[]
          features_en: string[]
          id: string
          name_cs: string
          name_en: string | null
          price_cs: string | null
          price_en: string | null
          sort_order: number
          unit_cs: string | null
          unit_en: string | null
        }
        Insert: {
          created_at?: string
          desc_cs?: string | null
          desc_en?: string | null
          featured?: boolean
          features_cs?: string[]
          features_en?: string[]
          id?: string
          name_cs: string
          name_en?: string | null
          price_cs?: string | null
          price_en?: string | null
          sort_order?: number
          unit_cs?: string | null
          unit_en?: string | null
        }
        Update: {
          created_at?: string
          desc_cs?: string | null
          desc_en?: string | null
          featured?: boolean
          features_cs?: string[]
          features_en?: string[]
          id?: string
          name_cs?: string
          name_en?: string | null
          price_cs?: string | null
          price_en?: string | null
          sort_order?: number
          unit_cs?: string | null
          unit_en?: string | null
        }
        Relationships: []
      }
      service_items: {
        Row: {
          created_at: string
          desc_cs: string | null
          desc_en: string | null
          id: string
          sort_order: number
          title_cs: string
          title_en: string | null
        }
        Insert: {
          created_at?: string
          desc_cs?: string | null
          desc_en?: string | null
          id?: string
          sort_order?: number
          title_cs: string
          title_en?: string | null
        }
        Update: {
          created_at?: string
          desc_cs?: string | null
          desc_en?: string | null
          id?: string
          sort_order?: number
          title_cs?: string
          title_en?: string | null
        }
        Relationships: []
      }
      team_photos: {
        Row: {
          caption_cs: string | null
          caption_en: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          caption_cs?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          caption_cs?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
