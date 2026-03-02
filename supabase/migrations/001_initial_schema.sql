-- =============================================
-- 001_initial_schema.sql
-- Avant × Atom Proposal App — Core Schema
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- FUNCTION: Auto-update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TABLE: proposals
-- =============================================
CREATE TABLE IF NOT EXISTS proposals (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  client_name       text        NOT NULL DEFAULT 'Avant',
  status            text        NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'sent', 'signed')),
  public_token      text        UNIQUE NOT NULL,
  proposal_json     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  pricing_json      jsonb       NULL,
  source_pdf_path   text        NULL,
  signed_pdf_path   text        NULL,
  created_at        timestamptz NOT NULL DEFAULT NOW(),
  updated_at        timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_proposals_public_token ON proposals (public_token);
CREATE INDEX idx_proposals_status ON proposals (status);

-- =============================================
-- TABLE: signers
-- =============================================
CREATE TABLE IF NOT EXISTS signers (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id   uuid        NOT NULL REFERENCES proposals (id) ON DELETE CASCADE,
  name          text        NOT NULL,
  email         text        NOT NULL,
  role          text        NULL,
  created_at    timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_signers_proposal_id ON signers (proposal_id);

-- =============================================
-- TABLE: signature_requests
-- =============================================
CREATE TABLE IF NOT EXISTS signature_requests (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id           uuid        NOT NULL REFERENCES proposals (id) ON DELETE CASCADE,
  signer_id             uuid        NOT NULL REFERENCES signers (id) ON DELETE CASCADE,
  sign_token            text        UNIQUE NOT NULL,
  status                text        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'viewed', 'signed', 'declined')),
  signed_at             timestamptz NULL,
  signature_type        text        NULL
                                    CHECK (signature_type IN ('typed', 'drawn')),
  signature_text        text        NULL,
  signature_image_path  text        NULL,
  initials_text         text        NULL,
  ip_address            text        NULL,
  user_agent            text        NULL,
  acceptance            boolean     NOT NULL DEFAULT FALSE,
  acceptance_text       text        NULL,
  created_at            timestamptz NOT NULL DEFAULT NOW(),
  updated_at            timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER signature_requests_updated_at
  BEFORE UPDATE ON signature_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_signature_requests_sign_token ON signature_requests (sign_token);
CREATE INDEX idx_signature_requests_proposal_id ON signature_requests (proposal_id);
CREATE INDEX idx_signature_requests_signer_id ON signature_requests (signer_id);

-- =============================================
-- TABLE: audit_events
-- =============================================
CREATE TABLE IF NOT EXISTS audit_events (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id             uuid        NOT NULL REFERENCES proposals (id) ON DELETE CASCADE,
  signer_id               uuid        NULL REFERENCES signers (id) ON DELETE SET NULL,
  signature_request_id    uuid        NULL REFERENCES signature_requests (id) ON DELETE SET NULL,
  event_type              text        NOT NULL,
  event_meta              jsonb       NOT NULL DEFAULT '{}'::jsonb,
  ip_address              text        NULL,
  user_agent              text        NULL,
  created_at              timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_events_proposal_id ON audit_events (proposal_id);
CREATE INDEX idx_audit_events_signer_id ON audit_events (signer_id);
CREATE INDEX idx_audit_events_event_type ON audit_events (event_type);
CREATE INDEX idx_audit_events_created_at ON audit_events (created_at DESC);

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE proposals IS 'Proposal documents with JSON content and PDF storage paths';
COMMENT ON TABLE signers IS 'People who must sign a given proposal';
COMMENT ON TABLE signature_requests IS 'One-time signing tokens and signature data per signer';
COMMENT ON TABLE audit_events IS 'Immutable audit trail of all proposal interactions';

COMMENT ON COLUMN signature_requests.acceptance_text IS 'Verbatim legal acceptance clause shown at signing time — stored for legal integrity';
COMMENT ON COLUMN audit_events.event_type IS 'One of: VIEW_PROPOSAL, START_SIGN, COMPLETE_FIELD, SUBMIT_SIGNATURE, FINALIZE_PDF, DOWNLOAD_PDF, DECLINE_SIGN';
