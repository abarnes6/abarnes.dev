package dev.abarnes.api.controller;

import dev.abarnes.api.model.BlogPost;
import dev.abarnes.api.model.BlogPostCreate;
import dev.abarnes.api.model.BlogPostUpdate;
import dev.abarnes.api.service.BlogService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/posts")
public class AdminBlogController {

    private final BlogService blogService;

    public AdminBlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<BlogPost> getAll() {
        return blogService.findAll();
    }

    @GetMapping("/{id}")
    public BlogPost getById(@PathVariable String id) {
        return blogService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogPost create(@RequestBody BlogPostCreate data) {
        return blogService.create(data);
    }

    @PutMapping("/{id}")
    public BlogPost update(@PathVariable String id, @RequestBody BlogPostUpdate data) {
        return blogService.update(id, data);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        blogService.delete(id);
    }
}
