package dev.abarnes.api.model;

import java.util.List;

public record BlogPostUpdate(
    String id,
    String title,
    String content,
    String summary,
    List<String> tags
) {}
