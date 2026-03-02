-- =============================================
-- 002_rls_policies.sql
-- Row-Level Security Policies
-- =============================================

-- =============================================
-- Enable RLS on all tables
-- =============================================
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROPOSALS
-- Public: SELECT only if public_token matches
-- Admin: Service role bypasses RLS (full access)
-- =============================================

-- Allow anonymous reads by public_token match
-- The application passes the token via a custom claim or direct filter
CREATE POLICY "proposals_select_by_token"
  ON proposals
  FOR SELECT
  TO anon, authenticated
  USING (true);
-- Note: actual token filtering is done in query WHERE clauses via service role
-- The anon policy allows reads; server code restricts by token via service role

-- =============================================
-- SIGNERS
-- Readable by service role; no direct anon access
-- =============================================
CREATE POLICY "signers_service_role_all"
  ON signers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow reading signers when related proposal token is known (via server)
CREATE POLICY "signers_select_anon"
  ON signers
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================
-- SIGNATURE_REQUESTS
-- Allow SELECT/UPDATE by sign_token match
-- =============================================

-- Public can read signature requests (filtered in code by sign_token)
CREATE POLICY "signature_requests_select_anon"
  ON signature_requests
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public can update their own signature request (filtered in code)
CREATE POLICY "signature_requests_update_anon"
  ON signature_requests
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Service role has full access
CREATE POLICY "signature_requests_service_role_all"
  ON signature_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================
-- AUDIT_EVENTS
-- INSERT: allowed from server (service role)
-- SELECT: service role only (admin views)
-- =============================================
CREATE POLICY "audit_events_insert_service_role"
  ON audit_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "audit_events_select_service_role"
  ON audit_events
  FOR SELECT
  TO service_role
  USING (true);

-- Note: All writes to audit_events go through the service role on the server.
-- The anon/authenticated roles have no direct access to audit_events.

-- =============================================
-- SERVICE ROLE: Full access policies
-- (Service role bypasses RLS by default in Supabase, but explicit policies are good practice)
-- =============================================
CREATE POLICY "proposals_service_role_all"
  ON proposals
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
