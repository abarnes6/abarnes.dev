package dev.abarnes.api.service;

import dev.abarnes.api.model.BlogPost;
import dev.abarnes.api.model.BlogPostCreate;
import dev.abarnes.api.model.BlogPostUpdate;
import dev.abarnes.api.repository.MariaDbRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BlogService {

    private final MariaDbRepository repository;

    public BlogService(MariaDbRepository repository) {
        this.repository = repository;
    }

    public List<BlogPost> findAll() {
        return repository.findAllBlogPosts();
    }

    public BlogPost findBySlug(String slug) {
        return repository.findBlogPostBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Blog post not found: " + slug
            ));
    }

    public BlogPost findById(String id) {
        return repository.findBlogPostById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Blog post not found: " + id
            ));
    }

    public BlogPost create(BlogPostCreate data) {
        try {
            return repository.createBlogPost(data);
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A post with this title already exists"
            );
        }
    }

    public BlogPost update(String id, BlogPostUpdate data) {
        findById(id); // Verify exists
        return repository.updateBlogPost(id, data);
    }

    public void delete(String id) {
        findById(id); // Verify exists
        repository.deleteBlogPost(id);
    }
}
