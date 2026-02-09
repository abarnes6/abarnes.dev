package dev.abarnes.api.controller;

import dev.abarnes.api.model.BlogPost;
import dev.abarnes.api.service.BlogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<BlogPost> getAll() {
        return blogService.findAll();
    }

    @GetMapping("/{slug}")
    public BlogPost getBySlug(@PathVariable String slug) {
        return blogService.findBySlug(slug);
    }
}
