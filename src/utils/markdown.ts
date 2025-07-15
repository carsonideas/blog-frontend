import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
});

/**
 * Converts markdown text to sanitized HTML
 * @param markdown The markdown text to convert
 * @returns Sanitized HTML string
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  // Convert markdown to HTML
  const rawHtml = marked(markdown) as string;

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'code'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'scrolling',
      'class',
      'style'
    ],
    FORBID_TAGS: ['script', 'style', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });

  return sanitizedHtml;
};

/**
 * Extracts a synopsis from markdown content
 * @param markdown The markdown content
 * @param maxLength Maximum length of the synopsis
 * @returns A plain text synopsis
 */
export const extractSynopsis = (markdown: string, maxLength: number = 150): string => {
  if (!markdown) return '';

  // Convert markdown to plain text by removing all markdown syntax
  let plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/~~~[\s\S]*?~~~/g, '') // Remove alternate code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!?\[([^\]]*)]\([^)]*\)/g, '$1') // Remove links and images but keep alt text
    .replace(/[#*`_~>\|]/g, '') // Remove markdown symbols including table syntax
    .replace(/\n\s*[-+*]\s/g, ' ') // Convert list items to plain text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  // Truncate to maxLength and add ellipsis if needed
  if (plainText.length > maxLength) {
    // Try to break at a word boundary
    const lastSpace = plainText.lastIndexOf(' ', maxLength);
    const breakPoint = lastSpace > maxLength * 0.8 ? lastSpace : maxLength;
    plainText = plainText.substring(0, breakPoint).trim() + '...';
  }

  return plainText;
};