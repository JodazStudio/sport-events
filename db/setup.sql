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
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    telegram_chat_id BIGINT UNIQUE,
    telegram_notifications_enabled BOOLEAN DEFAULT TRUE,
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
    social_media JSONB DEFAULT '{}'::jsonb,
    payment_info JSONB DEFAULT '{
      "bank_name": "",
      "account_number": "",
      "id_number": "",
      "phone_number": ""
    }'::jsonb,
    event_date DATE,
    event_time TIME,
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

-- Tabla de Códigos de Verificación de Telegram
CREATE TABLE public.telegram_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
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

-- Optimización para el bot de Telegram
CREATE INDEX idx_managers_telegram_chat_id ON public.managers(telegram_chat_id);
CREATE INDEX idx_telegram_verification_codes_code ON public.telegram_verification_codes(code);

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
ALTER TABLE public.telegram_verification_codes ENABLE ROW LEVEL SECURITY;

-- Nota: Deberás crear las "Policies" específicas desde el panel de Supabase 
-- o vía SQL para permitir lectura pública a las landings y escritura a los gestores logueados.

-- ========================================================================================
-- 5. FUNCIONES Y TRIGGERS (LÓGICA DE NEGOCIO)
-- ========================================================================================

-- Función para registrar un atleta y actualizar el cupo de forma atómica
CREATE OR REPLACE FUNCTION public.register_athlete(
    p_event_id UUID,
    p_stage_id UUID,
    p_category_id UUID,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_dni VARCHAR,
    p_email VARCHAR,
    p_birth_date DATE,
    p_gender public.gender_type,
    p_shirt_size VARCHAR,
    p_status public.registration_status,
    p_expires_at TIMESTAMP WITH TIME ZONE,
    p_payment_data JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_registration_id UUID;
    v_current_capacity INTEGER;
    v_total_capacity INTEGER;
BEGIN
    -- 1. Verificar cupo y bloquear fila para evitar condiciones de carrera
    SELECT used_capacity, total_capacity INTO v_current_capacity, v_total_capacity
    FROM public.registration_stages
    WHERE id = p_stage_id
    FOR UPDATE;

    IF v_current_capacity >= v_total_capacity THEN
        RAISE EXCEPTION 'No hay cupos disponibles en esta etapa.';
    END IF;

    -- 2. Insertar inscripción
    INSERT INTO public.registrations (
        event_id, stage_id, category_id, first_name, last_name, dni, email, birth_date, gender, shirt_size, status, expires_at
    ) VALUES (
        p_event_id, p_stage_id, p_category_id, p_first_name, p_last_name, p_dni, p_email, p_birth_date, p_gender, p_shirt_size, p_status, p_expires_at
    ) RETURNING id INTO v_registration_id;

    -- 3. Actualizar cupo
    UPDATE public.registration_stages
    SET used_capacity = used_capacity + 1
    WHERE id = p_stage_id;

    -- 4. Insertar pago si existe
    IF p_payment_data IS NOT NULL THEN
        INSERT INTO public.payments (
            registration_id, amount_usd, exchange_rate_bcv, amount_ves, reference_number, receipt_url
        ) VALUES (
            v_registration_id,
            (p_payment_data->>'amount_usd')::DECIMAL,
            (p_payment_data->>'exchange_rate_bcv')::DECIMAL,
            (p_payment_data->>'amount_ves')::DECIMAL,
            p_payment_data->>'reference_number',
            p_payment_data->>'receipt_url'
        );
    END IF;

    RETURN v_registration_id;
END;
$$ LANGUAGE plpgsql;