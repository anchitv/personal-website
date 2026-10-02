// Links from Markdown bodies to notes, found in the raw Markdown

import { writePartRefs } from './series';

/** Ids of the notes a Markdown body links to, in order of first appearance */
export function linkedNoteIds(body = ''): string[] {
  return [...new Set([...body.matchAll(/\]\(\/notes\/([\w-]+)\/[#)]/g)].map((match) => match[1]))];
}

export interface SnippetPart {
  text: string;
  /** code: inline code; link: the text of the link to the note */
  kind?: 'code' | 'link';
}

// Markdown links and inline code
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;
const plain = (text: string) => text.replace(/\*\*|\*|`/g, '');

/**
 * The sentence holding a post's first link to a note, with Markdown reduced to
 * plain text and inline code
 */
export function linkSnippet(postId: string, body: string, noteId: string): SnippetPart[] | undefined {
  const linksNote = new RegExp(`\\]\\(/notes/${noteId}/[#)]`);
  const line = body.split('\n').find((l) => linksNote.test(l));
  if (!line) return undefined;

  // Drop list, quote and heading markers, then split where a full stop is
  // followed by the start of a new sentence
  const sentences = line
    .replace(/^\s*(?:[-*+]|\d+\.|>|#+)\s+/, '')
    .split(/(?<=[.!?])\s+(?=[A-Z[`*])/);
  const at = sentences.findIndex((s) => linksNote.test(s));
  // A short sentence usually leans on the one before it, so that comes too.
  // [[part:caddy]] reads as the "part 6" it renders to
  const sentence = writePartRefs(postId, sentences.slice(sentences[at].length < 60 && at > 0 ? at - 1 : at, at + 1).join(' '));

  const parts: SnippetPart[] = [];
  let last = 0;
  for (const match of sentence.matchAll(INLINE)) {
    const [whole, linkText, url, code] = match;
    parts.push({ text: plain(sentence.slice(last, match.index)) });
    if (code) parts.push({ text: code, kind: 'code' });
    else parts.push({ text: plain(linkText), kind: linksNote.test(`](${url})`) ? 'link' : undefined });
    last = match.index + whole.length;
  }
  parts.push({ text: plain(sentence.slice(last)) });
  return parts.filter((part) => part.text);
}
