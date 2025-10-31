-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create initial admin user (password will be hashed by the application)
-- This is just a placeholder structure