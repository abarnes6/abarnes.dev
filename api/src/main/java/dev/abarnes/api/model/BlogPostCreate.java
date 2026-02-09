package dev.abarnes.api.model;

import java.util.List;

public record BlogPostCreate(
    String title,
    String content,
    String summary,
    List<String> tags
) {}
