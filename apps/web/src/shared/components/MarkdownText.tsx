import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownText.module.css';

interface MarkdownTextProps {
  text: string;
}

export default function MarkdownText({ text }: MarkdownTextProps) {
  return (
    <div className={styles.markdownWrapper}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ ...props }) => <p className={styles.paragraph} {...props} />,
          a: ({ ...props }) => <a className={styles.link} target="_blank" rel="noopener noreferrer" {...props} />,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return inline ? (
              <code className={styles.inlineCode} {...props}>
                {children}
              </code>
            ) : (
              <code className={`${styles.blockCode} ${match ? match[1] : ''}`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ ...props }) => <pre className={styles.pre} {...props} />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
