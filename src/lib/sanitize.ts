// src/lib/sanitize.ts
// A-2 — XSS sanitization for user-generated HTML content (product descriptions)
// Uses sanitize-html (pure JS HTML parser, safe for RSC/Node and Turbopack on Vercel)

import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize HTML string to prevent XSS attacks.
 * Whitelist: safe inline/block elements for product descriptions.
 * Blocks: script, on*, style attributes, iframe, object, embed.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return sanitizeHtmlLib(html, {
    allowedTags: [
      'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
      'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'img',
      'blockquote', 'span', 'div', 'hr', 'sub', 'sup', 'iframe'
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      td: ['colspan', 'rowspan', 'style', 'align', 'valign', 'border'],
      th: ['colspan', 'rowspan', 'style', 'align', 'valign', 'border'],
      table: ['style', 'border', 'cellpadding', 'cellspacing'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
      '*': ['class', 'style', 'id'] // Allow styling and identification class/style globally
    },
    allowedSchemes: ['http', 'https'], // Disallow javascript:, data:, etc.
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
    disallowedTagsMode: 'discard',
  });
}
