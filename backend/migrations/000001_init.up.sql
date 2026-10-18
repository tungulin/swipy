CREATE SCHEMA swipy;

CREATE TABLE swipy.users (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('telegram', 'vk', 'internal')),
    external_id BIGINT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    language VARCHAR(10),
    username VARCHAR(50) UNIQUE,
    points INT NOT NULL DEFAULT 0,
    streak_days INT NOT NULL DEFAULT 0,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    last_completed_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK ((provider = 'internal') = (external_id IS NULL)),
    UNIQUE (provider, external_id)
);

CREATE TABLE swipy.follow (
    follower_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    following_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id <> following_id)
);

CREATE INDEX follow_following_id_idx ON swipy.follow (following_id);

CREATE TABLE swipy.friend_race (
    id SERIAL PRIMARY KEY,
    user_a_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    user_b_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    streak_days INT NOT NULL DEFAULT 0,
    user_a_last_done TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_b_last_done TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (user_a_id < user_b_id),
    UNIQUE (user_a_id, user_b_id)
);

CREATE INDEX friend_race_user_b_id_idx ON swipy.friend_race (user_b_id);

CREATE TABLE swipy.achievement (
    id SERIAL PRIMARY KEY,
    metric VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL
);

CREATE TABLE swipy.achievement_level (
    achievement_id INT NOT NULL REFERENCES swipy.achievement (id) ON DELETE CASCADE,
    level INT NOT NULL,
    threshold INT NOT NULL,
    icon_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (achievement_id, level)
);

CREATE TABLE swipy.user_achievement (
    user_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    achievement_id INT NOT NULL REFERENCES swipy.achievement (id) ON DELETE CASCADE,
    level INT NOT NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE swipy.user_metric (
    user_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    metric VARCHAR(30) NOT NULL,
    value INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, metric)
);

CREATE TABLE swipy.language (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE swipy.language_pair (
    id SERIAL PRIMARY KEY,
    language_a_id INT NOT NULL REFERENCES swipy.language (id),
    language_b_id INT NOT NULL REFERENCES swipy.language (id),
    CHECK (language_a_id < language_b_id),
    UNIQUE (language_a_id, language_b_id)
);

CREATE TABLE swipy.course_level (
    level INT PRIMARY KEY,
    points_required INT NOT NULL UNIQUE
);

INSERT INTO
    swipy.course_level (level, points_required)
VALUES
    (1, 0);

CREATE TABLE swipy.user_language_pair (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    language_pair_id INT NOT NULL REFERENCES swipy.language_pair (id) ON DELETE CASCADE,
    learning_language_id INT NOT NULL REFERENCES swipy.language (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    points INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1 REFERENCES swipy.course_level (level),
    UNIQUE (user_id, language_pair_id)
);

CREATE TABLE swipy.user_daily_completion (
    id SERIAL PRIMARY KEY,
    user_language_pair_id INT NOT NULL REFERENCES swipy.user_language_pair (id) ON DELETE CASCADE,
    day DATE NOT NULL,
    cards_count INT NOT NULL,
    mistakes_count INT NOT NULL DEFAULT 0,
    points_earned INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX user_daily_completion_user_language_pair_id_day_idx ON swipy.user_daily_completion (user_language_pair_id, day);

CREATE TABLE swipy.card (
    id SERIAL PRIMARY KEY,
    language_pair_id INT NOT NULL REFERENCES swipy.language_pair (id) ON DELETE CASCADE,
    text_a VARCHAR(255) NOT NULL,
    text_b VARCHAR(255) NOT NULL,
    transcription VARCHAR(255),
    image_url VARCHAR(500),
    audio_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX card_language_pair_id_idx ON swipy.card (language_pair_id);

CREATE TABLE swipy.user_card_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES swipy.users (id) ON DELETE CASCADE,
    card_id INT NOT NULL REFERENCES swipy.card (id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('a_to_b', 'b_to_a')),
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'learned')),
    correct_streak INT NOT NULL DEFAULT 0 CHECK (correct_streak >= 0),
    last_studied_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, card_id, direction)
);