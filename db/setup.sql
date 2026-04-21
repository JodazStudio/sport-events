-- ========================================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS: SAAS EVENTOS DEPORTIVOS (SUPABASE)
-- ========================================================================================

-- 1. CREACIÓN DE TIPOS PERSONALIZADOS (ENUMS)
CREATE TYPE public.registration_status AS ENUM ('PENDING', 'REPORTED', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE public.gender_type AS ENUM ('MALE', 'FEMALE', 'MIXED');

-- 2. TABLAS DEL SISTEMA

-- Tabla de Gestores (Vinculada nativamente al sistema de autenticación de Supabase)
CREATE TABLE public.managers (
    -- El ID hace referencia directa a la tabla auth.users generada por Supabase Auth
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Eventos (Configuración de la Landing y reglas generales)
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    banner_url VARCHAR(255),
    has_inventory BOOLEAN DEFAULT FALSE,
    rules_text TEXT,
    route_image_url VARCHAR(255),
    strava_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Etapas de Inscripción (Control de cupos y precios)
CREATE TABLE public.registration_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    total_capacity INTEGER NOT NULL,
    used_capacity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Categorías (Clasificación automática por edad y sexo)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender public.gender_type NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Inscripciones (El núcleo transaccional. Sin login para atletas)
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    stage_id UUID REFERENCES public.registration_stages(id) ON DELETE RESTRICT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    status public.registration_status DEFAULT 'PENDING'::public.registration_status NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender public.gender_type NOT NULL,
    shirt_size VARCHAR(10),
    dorsal_number INTEGER,
    chip_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL -- Se llenará con las 11:59 PM del día de creación
);

-- Tabla de Pagos (Validación financiera y capturas)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE UNIQUE NOT NULL,
    amount_usd DECIMAL(10,2) NOT NULL,
    exchange_rate_bcv DECIMAL(10,2) NOT NULL,
    amount_ves DECIMAL(10,2) NOT NULL,
    reference_number VARCHAR(50),
    receipt_url VARCHAR(255),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Patrocinadores (Sponsors en la landing)
CREATE TABLE public.event_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Galería de Imágenes (Fotos pre y post evento)
CREATE TABLE public.event_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(150),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Resultados (Tiempos post-carrera)
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE UNIQUE NOT NULL,
    formatted_time VARCHAR(15), -- Ej: "01:45:22"
    total_seconds INTEGER,
    general_rank INTEGER,
    category_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================================================
-- 3. ÍNDICES (CRÍTICOS PARA EL RENDIMIENTO Y VELOCIDAD DE CONSULTA)
-- ========================================================================================

-- Optimización para buscar eventos por URL (Landing pública)
CREATE INDEX idx_events_slug ON public.events(slug);

-- Optimización para el dashboard del gestor (Filtrar inscritos de un evento)
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);

-- Optimización para la bandeja de validación (Filtrar por 'Pendiente', 'Reportado')
CREATE INDEX idx_registrations_status ON public.registrations(status);

-- Optimización para evitar/buscar números de referencia duplicados rápidamente
CREATE INDEX idx_payments_reference ON public.payments(reference_number);

-- Optimización para renderizar la tabla de resultados de un evento
CREATE INDEX idx_results_event_id ON public.results(event_id);

-- ========================================================================================
-- 4. SEGURIDAD A NIVEL DE FILAS (RLS - ROW LEVEL SECURITY)
-- Habilita RLS en las tablas para asegurar los endpoints de tu API en Supabase
-- ========================================================================================
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Nota: Deberás crear las "Policies" específicas desde el panel de Supabase 
-- o vía SQL para permitir lectura pública a las landings y escritura a los gestores logueados.