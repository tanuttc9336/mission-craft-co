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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      briefs: {
        Row: {
          audience: string
          channels: string[]
          constraints: string[]
          created_at: string
          deliverables: string[]
          id: string
          objective: string
          package: string
          project_id: string
          revision_terms: string
          style_direction: string
        }
        Insert: {
          audience?: string
          channels?: string[]
          constraints?: string[]
          created_at?: string
          deliverables?: string[]
          id?: string
          objective?: string
          package?: string
          project_id: string
          revision_terms?: string
          style_direction?: string
        }
        Update: {
          audience?: string
          channels?: string[]
          constraints?: string[]
          created_at?: string
          deliverables?: string[]
          id?: string
          objective?: string
          package?: string
          project_id?: string
          revision_terms?: string
          style_direction?: string
        }
        Relationships: [
          {
            foreignKeyName: "briefs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          brief_data: Json | null
          company: string
          consent: boolean
          created_at: string
          email: string
          id: string
          name: string
          notes: string
          phone: string
          project_location: string
        }
        Insert: {
          brief_data?: Json | null
          company?: string
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string
          phone?: string
          project_location?: string
        }
        Update: {
          brief_data?: Json | null
          company?: string
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string
          phone?: string
          project_location?: string
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string
          project_id: string
          quantity: number
          status: Database["public"]["Enums"]["deliverable_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string
          project_id: string
          quantity?: number
          status?: Database["public"]["Enums"]["deliverable_status"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string
          project_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["deliverable_status"]
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          file_updated_at: string
          id: string
          project_id: string
          status: string
          title: string
          type: Database["public"]["Enums"]["file_category"]
          url: string
          version: string
        }
        Insert: {
          created_at?: string
          file_updated_at?: string
          id?: string
          project_id: string
          status?: string
          title: string
          type?: Database["public"]["Enums"]["file_category"]
          url?: string
          version?: string
        }
        Update: {
          created_at?: string
          file_updated_at?: string
          id?: string
          project_id?: string
          status?: string
          title?: string
          type?: Database["public"]["Enums"]["file_category"]
          url?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      next_steps: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          notes: string
          owner: Database["public"]["Enums"]["next_step_owner"]
          project_id: string
          status: Database["public"]["Enums"]["next_step_status"]
          title: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string
          owner?: Database["public"]["Enums"]["next_step_owner"]
          project_id: string
          status?: Database["public"]["Enums"]["next_step_status"]
          title: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string
          owner?: Database["public"]["Enums"]["next_step_owner"]
          project_id?: string
          status?: Database["public"]["Enums"]["next_step_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "next_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          company?: string
          created_at?: string
          email?: string
          id: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          audience: string
          category: string
          channels: string[]
          created_at: string
          current_phase: string
          id: string
          lead_contact: string
          objective: string
          recent_activity: string[]
          revision_included: number
          revision_used: number
          scope_bundle: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          style_direction: string
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string
          category?: string
          channels?: string[]
          created_at?: string
          current_phase?: string
          id?: string
          lead_contact?: string
          objective?: string
          recent_activity?: string[]
          revision_included?: number
          revision_used?: number
          scope_bundle?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          style_direction?: string
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string
          category?: string
          channels?: string[]
          created_at?: string
          current_phase?: string
          id?: string
          lead_contact?: string
          objective?: string
          recent_activity?: string[]
          revision_included?: number
          revision_used?: number
          scope_bundle?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          style_direction?: string
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approval_type: Database["public"]["Enums"]["approval_type"]
          created_at: string
          due_date: string | null
          feedback_submitted: boolean
          id: string
          project_id: string
          review_link: string
          status: Database["public"]["Enums"]["review_status"]
          title: string
          version: number
        }
        Insert: {
          approval_type?: Database["public"]["Enums"]["approval_type"]
          created_at?: string
          due_date?: string | null
          feedback_submitted?: boolean
          id?: string
          project_id: string
          review_link?: string
          status?: Database["public"]["Enums"]["review_status"]
          title: string
          version?: number
        }
        Update: {
          approval_type?: Database["public"]["Enums"]["approval_type"]
          created_at?: string
          due_date?: string | null
          feedback_submitted?: boolean
          id?: string
          project_id?: string
          review_link?: string
          status?: Database["public"]["Enums"]["review_status"]
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_phases: {
        Row: {
          blocker: string | null
          created_at: string
          id: string
          name: string
          notes: string
          owner: string
          project_id: string
          sort_order: number
          status: Database["public"]["Enums"]["stage_status"]
          target_date: string | null
        }
        Insert: {
          blocker?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string
          owner?: string
          project_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["stage_status"]
          target_date?: string | null
        }
        Update: {
          blocker?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string
          owner?: string
          project_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["stage_status"]
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      user_has_project_access: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
      approval_type:
        | "approve-direction"
        | "approve-edit"
        | "approve-final"
        | "confirm-asset-list"
        | "request-revision"
      deliverable_status:
        | "not-started"
        | "in-progress"
        | "in-review"
        | "awaiting-approval"
        | "delivered"
      file_category: "review" | "final" | "reference" | "document"
      next_step_owner: "client" | "undercat"
      next_step_status: "pending" | "in-progress" | "completed"
      project_status:
        | "on-track"
        | "waiting-approval"
        | "in-progress"
        | "at-risk"
        | "delivered"
        | "scope-review"
      review_status: "pending" | "approved" | "revision-requested" | "in-review"
      stage_status: "not-started" | "in-progress" | "waiting" | "completed"
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
      app_role: ["admin", "client"],
      approval_type: [
        "approve-direction",
        "approve-edit",
        "approve-final",
        "confirm-asset-list",
        "request-revision",
      ],
      deliverable_status: [
        "not-started",
        "in-progress",
        "in-review",
        "awaiting-approval",
        "delivered",
      ],
      file_category: ["review", "final", "reference", "document"],
      next_step_owner: ["client", "undercat"],
      next_step_status: ["pending", "in-progress", "completed"],
      project_status: [
        "on-track",
        "waiting-approval",
        "in-progress",
        "at-risk",
        "delivered",
        "scope-review",
      ],
      review_status: ["pending", "approved", "revision-requested", "in-review"],
      stage_status: ["not-started", "in-progress", "waiting", "completed"],
    },
  },
} as const
