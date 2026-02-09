import { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useApi } from '../../hooks';
import { useAdmin } from '../../context';
import { blogService, adminPut, adminDelete, AdminApiError } from '../../services';
import { MarkdownRenderer, LoadingSpinner } from '../../components';
import type { BlogPostCreate } from '../../types';
import './BlogPost.css';

interface FormData {
  title: string;
  content: string;
  summary: string;
  tags: string;
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAdmin();
  const fetcher = useCallback(() => blogService.getBySlug(slug!), [slug]);
  const { data: post, loading, error, refetch } = useApi(fetcher);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({ title: '', content: '', summary: '', tags: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!post) return 0;
    const wordsPerMinute = 200;
    const wordCount = post.content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }, [post]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = () => {
    if (!post) return;
    setFormData({
      title: post.title,
      content: post.content,
      summary: post.summary,
      tags: post.tags.join(', '),
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ title: '', content: '', summary: '', tags: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setIsSubmitting(true);

    const payload: BlogPostCreate = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      await adminPut(`/admin/posts/${post.id}`, payload);
      showMessage('success', 'Post updated');
      setIsEditing(false);
      refetch();
    } catch (err) {
      const msg = err instanceof AdminApiError ? err.message : 'Failed to update';
      showMessage('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm(`Delete "${post.title}"?`)) return;

    try {
      await adminDelete(`/admin/posts/${post.id}`);
      setLocation('/blog');
    } catch (err) {
      const msg = err instanceof AdminApiError ? err.message : 'Failed to delete';
      showMessage('error', msg);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="terminal-center">
        <div className="terminal-error">{error.message}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="terminal-center">
        <div className="terminal-error">Post not found</div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).toUpperCase();

  if (isEditing) {
    return (
      <div className="terminal-article">
        <button
          className="terminal-btn terminal-btn-text"
          onClick={handleCancel}
          style={{ marginBottom: '1.5rem' }}
        >
          [x] CANCEL
        </button>

        {message && (
          <div className={`post-message post-message--${message.type}`}>
            [{message.type === 'success' ? 'OK' : '!'}] {message.text}
          </div>
        )}

        <div className="post-editor">
          <div className="editor-header">
            <span className="editor-title">{'>'} EDIT POST</span>
          </div>
          <form onSubmit={handleSubmit} className="editor-form">
            <div className="editor-field">
              <label className="editor-label">TITLE</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="editor-input"
                required
              />
            </div>
            <div className="editor-field">
              <label className="editor-label">SUMMARY</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="editor-textarea editor-textarea--small"
                rows={2}
                required
              />
            </div>
            <div className="editor-field">
              <label className="editor-label">CONTENT <span className="label-hint">// markdown</span></label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="editor-textarea editor-textarea--large"
                rows={20}
                required
              />
            </div>
            <div className="editor-field">
              <label className="editor-label">TAGS <span className="label-hint">// comma separated</span></label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="editor-input"
              />
            </div>
            <div className="editor-actions">
              <button type="button" onClick={handleCancel} className="editor-cancel">[x] CANCEL</button>
              <button type="submit" className="editor-submit" disabled={isSubmitting}>
                {isSubmitting ? '...' : '[>] UPDATE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-article">
      <div className="post-nav-row">
        <button
          className="terminal-btn terminal-btn-text"
          onClick={() => setLocation('/blog')}
        >
          ..
        </button>

        {isAuthenticated && (
          <div className="post-admin-actions">
            <button onClick={handleEdit} className="post-action-btn">[EDIT]</button>
            <button onClick={handleDelete} className="post-action-btn post-action-btn--delete">[DELETE]</button>
          </div>
        )}
      </div>

      {message && (
        <div className={`post-message post-message--${message.type}`}>
          [{message.type === 'success' ? 'OK' : '!'}] {message.text}
        </div>
      )}

      <article className="terminal-card terminal-card--article fade-in-up">
        <div className="terminal-card-header">
          <span>{formattedDate}</span>
          <span className="terminal-footer-divider">|</span>
          <span>{readingTime} MIN READ</span>
        </div>

        <h1 className="terminal-article-title">
          <span className="terminal-article-prompt">&gt; </span>
          {post.title}
        </h1>

        <div className="terminal-article-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="terminal-tag">{tag}</span>
          ))}
        </div>

        <div className="terminal-article-body">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}
