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
      proposals: {
        Row: {
          id: string
          title: string
          client_name: string
          status: 'draft' | 'sent' | 'signed'
          public_token: string
          proposal_json: Json
          pricing_json: Json | null
          source_pdf_path: string | null
          signed_pdf_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_name?: string
          status?: 'draft' | 'sent' | 'signed'
          public_token: string
          proposal_json?: Json
          pricing_json?: Json | null
          source_pdf_path?: string | null
          signed_pdf_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client_name?: string
          status?: 'draft' | 'sent' | 'signed'
          public_token?: string
          proposal_json?: Json
          pricing_json?: Json | null
          source_pdf_path?: string | null
          signed_pdf_path?: string | null
          updated_at?: string
        }
      }
      signers: {
        Row: {
          id: string
          proposal_id: string
          name: string
          email: string
          role: string | null
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          name: string
          email: string
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          name?: string
          email?: string
          role?: string | null
        }
      }
      signature_requests: {
        Row: {
          id: string
          proposal_id: string
          signer_id: string
          sign_token: string
          status: 'pending' | 'viewed' | 'signed' | 'declined'
          signed_at: string | null
          signature_type: 'typed' | 'drawn' | null
          signature_text: string | null
          signature_image_path: string | null
          initials_text: string | null
          ip_address: string | null
          user_agent: string | null
          acceptance: boolean
          acceptance_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          signer_id: string
          sign_token: string
          status?: 'pending' | 'viewed' | 'signed' | 'declined'
          signed_at?: string | null
          signature_type?: 'typed' | 'drawn' | null
          signature_text?: string | null
          signature_image_path?: string | null
          initials_text?: string | null
          ip_address?: string | null
          user_agent?: string | null
          acceptance?: boolean
          acceptance_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'viewed' | 'signed' | 'declined'
          signed_at?: string | null
          signature_type?: 'typed' | 'drawn' | null
          signature_text?: string | null
          signature_image_path?: string | null
          initials_text?: string | null
          ip_address?: string | null
          user_agent?: string | null
          acceptance?: boolean
          acceptance_text?: string | null
          updated_at?: string
        }
      }
      audit_events: {
        Row: {
          id: string
          proposal_id: string
          signer_id: string | null
          signature_request_id: string | null
          event_type: string
          event_meta: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          signer_id?: string | null
          signature_request_id?: string | null
          event_type: string
          event_meta?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience type aliases
export type Proposal = Database['public']['Tables']['proposals']['Row']
export type ProposalInsert = Database['public']['Tables']['proposals']['Insert']
export type ProposalUpdate = Database['public']['Tables']['proposals']['Update']
export type Signer = Database['public']['Tables']['signers']['Row']
export type SignerInsert = Database['public']['Tables']['signers']['Insert']
export type SignatureRequest = Database['public']['Tables']['signature_requests']['Row']
export type SignatureRequestInsert = Database['public']['Tables']['signature_requests']['Insert']
export type SignatureRequestUpdate = Database['public']['Tables']['signature_requests']['Update']
export type AuditEvent = Database['public']['Tables']['audit_events']['Row']
export type AuditEventInsert = Database['public']['Tables']['audit_events']['Insert']
