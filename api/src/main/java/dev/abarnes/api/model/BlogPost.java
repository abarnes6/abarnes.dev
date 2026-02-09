package dev.abarnes.api.model;

import java.time.Instant;
import java.util.List;

public record BlogPost(
    String id,
    String title,
    String slug,
    String content,
    String summary,
    List<String> tags,
    Instant createdAt,
    Instant updatedAt
) {}
