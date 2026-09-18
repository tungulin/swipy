CREATE SCHEMA swipy;

CREATE TABLE swipy.users (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('telegram', 'vk')),
    external_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    language VARCHAR(10),
    UNIQUE (provider, external_id)
);

CREATE TABLE swipy.language (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL
);

CREATE TABLE swipy.language_pair (
    id SERIAL PRIMARY KEY,
    source_language_id INT NOT NULL REFERENCES swipy.language (id),
    target_language_id INT NOT NULL REFERENCES swipy.language (id),
    CHECK (source_language_id <> target_language_id),
    UNIQUE (source_language_id, target_language_id)
);

CREATE TABLE swipy.card (
    id SERIAL PRIMARY KEY,
    language_pair_id INT NOT NULL REFERENCES swipy.language_pair (id) ON DELETE CASCADE,
    front_text VARCHAR(255) NOT NULL,
    back_text VARCHAR(255) NOT NULL,
    transcription VARCHAR(255),
    image_url VARCHAR(500),
    audio_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE swipy.user_language_pair (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    language_pair_id INT NOT NULL REFERENCES swipy.language_pair (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, language_pair_id)
);

CREATE TABLE swipy.user_card_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    card_id INT NOT NULL REFERENCES swipy.card (id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'learned')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, card_id)
);