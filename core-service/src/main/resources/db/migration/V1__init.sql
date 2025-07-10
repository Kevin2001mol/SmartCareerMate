CREATE TABLE parsed_cvs (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT      NOT NULL,
    original_name VARCHAR(255),
    raw_text     TEXT        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
