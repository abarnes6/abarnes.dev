package dev.abarnes.api.repository;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import dev.abarnes.api.model.BlogPost;
import dev.abarnes.api.model.BlogPostCreate;
import dev.abarnes.api.model.BlogPostUpdate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class MariaDbRepository {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public MariaDbRepository(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public List<BlogPost> findAllBlogPosts() {
        String sql = """
            SELECT id, title, slug, content, summary, tags, created_at, updated_at
            FROM blog_posts
            ORDER BY created_at DESC
            """;
        return jdbcTemplate.query(sql, new BlogPostRowMapper());
    }

    public Optional<BlogPost> findBlogPostBySlug(String slug) {
        String sql = """
            SELECT id, title, slug, content, summary, tags, created_at, updated_at
            FROM blog_posts
            WHERE slug = ?
            """;
        List<BlogPost> results = jdbcTemplate.query(sql, new BlogPostRowMapper(), slug);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.getFirst());
    }

    public Optional<BlogPost> findBlogPostById(String id) {
        String sql = """
            SELECT id, title, slug, content, summary, tags, created_at, updated_at
            FROM blog_posts
            WHERE id = ?
            """;
        List<BlogPost> results = jdbcTemplate.query(sql, new BlogPostRowMapper(), id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.getFirst());
    }

    public BlogPost createBlogPost(BlogPostCreate data) {
        String id = UUID.randomUUID().toString();
        String slug = generateSlug(data.title());
        String tagsJson = toJsonArray(data.tags());
        Instant now = Instant.now();

        String sql = """
            INSERT INTO blog_posts (id, title, slug, content, summary, tags, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(sql, id, data.title(), slug, data.content(), data.summary(), tagsJson, now, now);

        return new BlogPost(id, data.title(), slug, data.content(), data.summary(), data.tags(), now, now);
    }

    public BlogPost updateBlogPost(String id, BlogPostUpdate data) {
        String tagsJson = toJsonArray(data.tags());
        Instant now = Instant.now();

        String sql = """
            UPDATE blog_posts
            SET title = ?, content = ?, summary = ?, tags = ?, updated_at = ?
            WHERE id = ?
            """;
        jdbcTemplate.update(sql, data.title(), data.content(), data.summary(), tagsJson, now, id);

        return findBlogPostById(id).orElseThrow();
    }

    public void deleteBlogPost(String id) {
        String sql = "DELETE FROM blog_posts WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
    }

    private String toJsonArray(List<String> tags) {
        try {
            return objectMapper.writeValueAsString(tags);
        } catch (JacksonException e) {
            return "[]";
        }
    }

    private class BlogPostRowMapper implements RowMapper<BlogPost> {
        @Override
        public BlogPost mapRow(ResultSet rs, int rowNum) throws SQLException {
            String tagsJson = rs.getString("tags");
            List<String> tags = parseJsonArray(tagsJson);

            return new BlogPost(
                rs.getString("id"),
                rs.getString("title"),
                rs.getString("slug"),
                rs.getString("content"),
                rs.getString("summary"),
                tags,
                rs.getTimestamp("created_at").toInstant(),
                rs.getTimestamp("updated_at").toInstant()
            );
        }

        private List<String> parseJsonArray(String json) {
            if (json == null || json.equals("[]")) {
                return List.of();
            }
            try {
                return objectMapper.readValue(json, new TypeReference<>() {});
            } catch (JacksonException e) {
                return List.of();
            }
        }
    }
}
