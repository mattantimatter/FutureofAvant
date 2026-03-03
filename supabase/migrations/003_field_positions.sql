-- =============================================
-- 003_field_positions.sql
-- Add signature field placement positions to signature_requests
-- Enables DocuSign-style field placement in PDFs
-- =============================================

ALTER TABLE signature_requests
  ADD COLUMN IF NOT EXISTS field_positions jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN signature_requests.field_positions IS
  'Array of field placement objects: [{type: "signature"|"initials", page: number, x: number, y: number, width: number, height: number}]. Coordinates are in PDF points (72 pts/inch) from bottom-left origin. If empty, signature page is appended instead.';
