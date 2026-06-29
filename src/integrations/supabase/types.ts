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
      decision_profiles: {
        Row: {
          created_at: string
          emerging_pattern: string
          missions_completed: number
          scores: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emerging_pattern?: string
          missions_completed?: number
          scores?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emerging_pattern?: string
          missions_completed?: number
          scores?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gsc_verification_tokens: {
        Row: {
          created_at: string
          id: string
          site_url: string
          token: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          site_url: string
          token: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          site_url?: string
          token?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      mission_contributions: {
        Row: {
          at: string
          id: string
          mission_id: string
          notes: Json | null
          scores: Json
          signals: string[]
          source: string | null
          user_id: string
        }
        Insert: {
          at?: string
          id?: string
          mission_id: string
          notes?: Json | null
          scores: Json
          signals?: string[]
          source?: string | null
          user_id: string
        }
        Update: {
          at?: string
          id?: string
          mission_id?: string
          notes?: Json | null
          scores?: Json
          signals?: string[]
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mission_plays: {
        Row: {
          completed: boolean
          created_at: string
          decision_seconds: number | null
          difficulty_rating: number | null
          id: string
          investigation_seconds: number | null
          message_count: number | null
          mission_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          decision_seconds?: number | null
          difficulty_rating?: number | null
          id?: string
          investigation_seconds?: number | null
          message_count?: number | null
          mission_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          decision_seconds?: number | null
          difficulty_rating?: number | null
          id?: string
          investigation_seconds?: number | null
          message_count?: number | null
          mission_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_missions: {
        Row: {
          analysis: Json | null
          archetype_id: string | null
          confidence: number | null
          decided_at: string | null
          decision: string | null
          messages: Json
          mission_id: string
          reasoning: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          archetype_id?: string | null
          confidence?: number | null
          decided_at?: string | null
          decision?: string | null
          messages?: Json
          mission_id: string
          reasoning?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          archetype_id?: string | null
          confidence?: number | null
          decided_at?: string | null
          decision?: string | null
          messages?: Json
          mission_id?: string
          reasoning?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
