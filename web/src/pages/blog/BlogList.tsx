import { useCallback, useState } from 'react';
import { useLocation } from 'wouter';
import { useApi } from '../../hooks';
import { useAdmin } from '../../context';
import { blogService, adminPost, AdminApiError } from '../../services';
import { LoadingSpinner } from '../../components';
import type { BlogPostCreate } from '../../types';
import './BlogList.css';

interface FormData {
  title: string;
  content: string;
  summary: string;
  tags: string;
}

const emptyForm: FormData = { title: '', content: '', summary: '', tags: '' };

export function BlogList() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAdmin();
  const fetcher = useCallback(() => blogService.getAll(), []);
  const { data: posts, loading, error, refetch } = useApi(fetcher);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreate = () => {
    setFormData(emptyForm);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: BlogPostCreate = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      await adminPost('/admin/posts', payload);
      showMessage('success', 'Post created');
      handleCancel();
      refetch();
    } catch (err) {
      const message = err instanceof AdminApiError ? err.message : 'Request failed';
      showMessage('error', message);
    } finally {
      setIsSubmitting(false);
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

  return (
    <div>
      <div className="terminal-page-header">
        <div className="blog-header-row">
          <div>
            <h1 className="terminal-page-title">BLOG</h1>
            <p>Thoughts, learnings, and technical deep-dives.</p>
          </div>
          {isAuthenticated && !isCreating && (
            <button onClick={handleCreate} className="blog-create-btn">
              [+] NEW POST
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`blog-message blog-message--${message.type}`}>
          [{message.type === 'success' ? 'OK' : '!'}] {message.text}
        </div>
      )}

      {isCreating && (
        <div className="blog-editor">
          <div className="editor-header">
            <span className="editor-title">{'>'} NEW POST</span>
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
                className="editor-textarea"
                rows={12}
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
                {isSubmitting ? '...' : '[+] CREATE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!posts?.length && !isCreating ? (
        <div className="terminal-center">
          <p>No posts yet.</p>
          {isAuthenticated ? (
            <p style={{ color: 'var(--accent)' }}>$ click [+] NEW POST to create one</p>
          ) : (
            <p style={{ color: 'var(--accent)' }}>$ check_back_later</p>
          )}
        </div>
      ) : (
        <div className="terminal-stack">
          {posts?.map((post, index) => (
            <div
              key={post.id}
              className={`terminal-card terminal-card-clickable fade-in-up stagger-${Math.min(index + 1, 5)}`}
              onClick={() => setLocation(`/blog/${post.slug}`)}
            >
              <div className="terminal-card-header">
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
                }).toUpperCase()}</span>
              </div>
              <div className="terminal-card-title">{post.title}</div>
              <p className="terminal-card-content">{post.summary}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="terminal-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
