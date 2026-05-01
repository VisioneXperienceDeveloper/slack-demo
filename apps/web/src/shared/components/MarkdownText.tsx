import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import styles from './MarkdownText.module.css';

interface MarkdownTextProps {
  text: string;
}

export default function MarkdownText({ text }: MarkdownTextProps) {
  // Simple mention highlighting and preservation of leading spaces
  const processedText = text
    .replace(/@(\w+)/g, '[@$1](mention:$1)')
    .replace(/^ +/gm, (match) => '\u00A0'.repeat(match.length));

  return (
    <div className={styles.markdownWrapper}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ ...props }) => <p className={styles.paragraph} {...props} />,
          a: ({ ...props }) => {
            const isMention = props.href?.startsWith('mention:');
            if (isMention) {
              return <span className={styles.mention}>{props.children}</span>;
            }
            return <a className={styles.link} target="_blank" rel="noopener noreferrer" {...props} />;
          },
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;
            return isInline ? (
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
        {processedText}
      </ReactMarkdown>
    </div>
  );
}
