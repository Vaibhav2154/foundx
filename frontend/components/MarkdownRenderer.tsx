import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Dark theme for better visibility

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-sm max-w-none prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 dark:prose-strong:text-white ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      components={{
        // Custom heading styles
        h1: ({ children }) => (
          <h1 className="pb-2 mb-3 text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-4 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-3 mb-2 text-base font-semibold text-gray-900 dark:text-white">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-2 mb-1 text-sm font-semibold text-gray-900 dark:text-white">
            {children}
          </h4>
        ),
        
        // Custom paragraph styles
        p: ({ children }) => (
          <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
            {children}
          </p>
        ),
        
        // Custom list styles
        ul: ({ children }) => (
          <ul className="pl-5 mb-3 space-y-1 list-disc list-outside">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="pl-5 mb-3 space-y-1 list-decimal list-outside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-700 dark:text-gray-300">
            {children}
          </li>
        ),
        
        // Custom code styles
        code: (props: {
          inline?: boolean;
          className?: string;
          children?: React.ReactNode;
          [key: string]: any;
        }) => {
          const { inline, className, children, ...rest } = props;
          if (inline) {
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm font-mono" {...rest}>
                {children}
              </code>
            );
          }
          return (
            <code className="block p-3 overflow-x-auto font-mono text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-200" {...rest}>
              {children}
            </code>
          );
        },
        
        // Custom pre styles (for code blocks)
        pre: ({ children }) => (
          <pre className="p-3 mb-3 overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800">
            {children}
          </pre>
        ),
        
        // Custom blockquote styles
        blockquote: ({ children }) => (
          <blockquote className="py-2 pl-4 pr-3 mb-3 italic text-gray-700 dark:text-gray-300 border-l-4 border-indigo-200 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30">
            {children}
          </blockquote>
        ),
        
        // Custom table styles
        table: ({ children }) => (
          <div className="mb-3 overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-600 rounded-md">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50 dark:bg-gray-800">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-sm font-semibold text-left text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            {children}
          </td>
        ),
        
        // Custom link styles
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            {children}
          </a>
        ),
        
        // Custom strong/bold styles
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">
            {children}
          </strong>
        ),
        
        // Custom emphasis/italic styles
        em: ({ children }) => (
          <em className="italic text-gray-700 dark:text-gray-300">
            {children}
          </em>
        ),
        
        // Custom horizontal rule
        hr: () => (
          <hr className="my-4 border-t border-gray-200 dark:border-gray-600" />
        ),
        
        // Custom image styles
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="h-auto max-w-full mb-3 rounded-md shadow-sm"
          />
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
