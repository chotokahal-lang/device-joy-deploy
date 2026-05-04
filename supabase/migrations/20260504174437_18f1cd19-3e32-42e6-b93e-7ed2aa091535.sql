-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'polri', 'publik');
CREATE TYPE public.evidence_type AS ENUM ('mobil', 'motor', 'hp');
CREATE TYPE public.case_status AS ENUM ('baru', 'proses', 'selesai');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nrp TEXT,
  name TEXT,
  unit TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- security definer to check role without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ EVIDENCE ============
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.evidence_type NOT NULL,
  -- vehicle fields
  no_polisi TEXT,
  no_rangka TEXT,
  no_mesin TEXT,
  merk TEXT,
  tipe TEXT,
  jenis TEXT,
  warna TEXT,
  tahun TEXT,
  -- hp fields
  model TEXT,
  imei1 TEXT,
  imei2 TEXT,
  -- common LP info
  no_lp TEXT NOT NULL,
  tgl_lp DATE,
  pelapor TEXT,
  lokasi_tkp TEXT,
  satker TEXT,
  asal_lp TEXT,
  foto TEXT,
  status public.case_status NOT NULL DEFAULT 'baru',
  status_note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_evidence_type ON public.evidence(type);
CREATE INDEX idx_evidence_no_polisi ON public.evidence(no_polisi);
CREATE INDEX idx_evidence_no_lp ON public.evidence(no_lp);

-- ============ SYSTEM LOGS ============
CREATE TABLE public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- ============ USER LOCATIONS ============
CREATE TABLE public.user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id, recorded_at DESC);

-- ============ LIVE EDIT TRANSFORMS (sync antar device) ============
CREATE TABLE public.live_edit_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL UNIQUE DEFAULT 'global',
  texts JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '{}'::jsonb,
  transforms JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.live_edit_state ENABLE ROW LEVEL SECURITY;
INSERT INTO public.live_edit_state (scope) VALUES ('global');

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_evidence_updated BEFORE UPDATE ON public.evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_live_edit_updated BEFORE UPDATE ON public.live_edit_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUTO CREATE PROFILE + DEFAULT ROLE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, nrp, unit)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'nrp',
    NEW.raw_user_meta_data->>'unit'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'polri');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- user_roles
CREATE POLICY "roles_select_own_or_admin" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- evidence — public read (for cek laporan), polri/admin write, admin delete
CREATE POLICY "evidence_public_read" ON public.evidence
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "evidence_insert_polri_admin" ON public.evidence
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'polri') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "evidence_update_polri_admin" ON public.evidence
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'polri') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "evidence_delete_admin" ON public.evidence
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- system_logs
CREATE POLICY "logs_admin_read" ON public.system_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "logs_authenticated_insert" ON public.system_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- user_locations
CREATE POLICY "locations_select_own_or_admin" ON public.user_locations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "locations_insert_own" ON public.user_locations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- live_edit_state — public read, admin write
CREATE POLICY "live_edit_public_read" ON public.live_edit_state
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "live_edit_admin_write" ON public.live_edit_state
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ REALTIME for live_edit_state ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_edit_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.evidence;