export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'client'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'client'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'client'
          created_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          buffer_minutes: number
        }
        Insert: {
          id?: string
          day_of_week: number
          start_time: string
          end_time: string
          buffer_minutes: number
        }
        Update: {
          id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          buffer_minutes?: number
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'completed'
          notes: string | null
          name: string | null
          email: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'completed'
          notes?: string | null
          name?: string | null
          email?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'completed'
          notes?: string | null
          name?: string | null
          email?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      appointment_types: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_minutes: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration_minutes?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration_minutes?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      },
      appointment_fields: {
        Row: {
          id: string
          appointment_type_id: string
          field_name: string
          field_type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox'
          label: string
          placeholder: string | null
          is_required: boolean
          options: Json | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_type_id: string
          field_name: string
          field_type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox'
          label: string
          placeholder?: string | null
          is_required?: boolean
          options?: Json | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_type_id?: string
          field_name?: string
          field_type?: 'text' | 'number' | 'select' | 'textarea' | 'checkbox'
          label?: string
          placeholder?: string | null
          is_required?: boolean
          options?: Json | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      },
      appointment_metadata: {
        Row: {
          id: string
          booking_id: string
          field_id: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          field_id: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          field_id?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
} 