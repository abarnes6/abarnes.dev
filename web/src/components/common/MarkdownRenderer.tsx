import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    // Code blocks with terminal-style header
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match && !className;

      if (isInline) {
        return (
          <code className="md-inline-code" {...props}>
            {children}
          </code>
        );
      }

      const language = match ? match[1] : 'plaintext';

      return (
        <div className="md-code-block">
          <div className="md-code-header">
            <div className="md-code-dots">
              <span className="md-code-dot md-code-dot--red" />
              <span className="md-code-dot md-code-dot--yellow" />
              <span className="md-code-dot md-code-dot--green" />
            </div>
            <span className="md-code-lang">{language}</span>
            <span className="md-code-path">~/blog/{language}</span>
          </div>
          <pre className="md-code-pre">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },

    // Pre wrapper (handled by code block)
    pre({ children }) {
      return <>{children}</>;
    },

    // Links with external indicator
    a({ href, children }) {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          className="md-link"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
          {isExternal && <span className="md-link-external">&nearr;</span>}
        </a>
      );
    },

    // Blockquotes with terminal prefix
    blockquote({ children }) {
      return (
        <blockquote className="md-blockquote">
          <span className="md-blockquote-bar" />
          {children}
        </blockquote>
      );
    },

    // Headings with terminal prefix
    h1({ children }) {
      return (
        <h1 className="md-heading md-h1">
          <span className="md-heading-prefix"># </span>
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="md-heading md-h2">
          <span className="md-heading-prefix">## </span>
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="md-heading md-h3">
          <span className="md-heading-prefix">### </span>
          {children}
        </h3>
      );
    },
    h4({ children }) {
      return (
        <h4 className="md-heading md-h4">
          <span className="md-heading-prefix">#### </span>
          {children}
        </h4>
      );
    },

    // Paragraphs
    p({ children }) {
      return <p className="md-paragraph">{children}</p>;
    },

    // Lists
    ul({ children }) {
      return <ul className="md-list md-list--unordered">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="md-list md-list--ordered">{children}</ol>;
    },
    li({ children }) {
      return <li className="md-list-item">{children}</li>;
    },

    // Tables
    table({ children }) {
      return (
        <div className="md-table-wrapper">
          <table className="md-table">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="md-thead">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody className="md-tbody">{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="md-tr">{children}</tr>;
    },
    th({ children }) {
      return <th className="md-th">{children}</th>;
    },
    td({ children }) {
      return <td className="md-td">{children}</td>;
    },

    // Horizontal rule
    hr() {
      return (
        <hr className="md-hr" />
      );
    },

    // Strong and emphasis
    strong({ children }) {
      return <strong className="md-strong">{children}</strong>;
    },
    em({ children }) {
      return <em className="md-em">{children}</em>;
    },

    // Images
    img({ src, alt }) {
      return (
        <figure className="md-figure">
          <img src={src} alt={alt} className="md-img" />
          {alt && <figcaption className="md-figcaption">{alt}</figcaption>}
        </figure>
      );
    },
  };

  return (
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
