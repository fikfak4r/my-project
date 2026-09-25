/**
 * Infutia Markdown — a simple but powerful superset of Markdown that brings
 * digital products alive. Supported syntax:
 *
 *   # / ## / ###            headings (## builds the chapter navigator)
 *   **bold** _italic_ `code`
 *   >                       pull quote
 *   ::: tip | note | warn   styled "infusion" callouts
 *   ---                     themed divider
 *   - [ ] / - [x]           checklists
 *   -  / 1.                 bullet & ordered lists
 *   ==highlight==           reader highlights
 *   [[key takeaway]]        emphasized takeaway chips
 */
import { Injectable } from '@angular/core';

export interface RenderedDoc {
  html: string;
  toc: { id: string; label: string }[];
}

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  render(src: string): RenderedDoc {
    const toc: { id: string; label: string }[] = [];
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const inline = (t: string) =>
      esc(t)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[\s(])_(.+?)_(?=[\s.,!?)]|$)/g, '$1<em>$2</em>')
        .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
        .replace(/==(.+?)==/g, '<mark class="md-mark">$1</mark>')
        .replace(/\[\[(.+?)\]\]/g, '<span class="md-key"><i class="bi bi-stars"></i> $1</span>')
        .replace(
          /\[(.+?)\]\((https?:\/\/[^)]+)\)/g,
          '<a class="md-link" href="$2" rel="noopener" target="_blank">$1</a>'
        );

    const lines = src.split('\n');
    const out: string[] = [];
    let i = 0;
    let h2 = 0;
    let listType: 'ul' | 'ol' | null = null;
    const closeList = () => {
      if (listType) {
        out.push(`</${listType}>`);
        listType = null;
      }
    };

    while (i < lines.length) {
      const line = lines[i].trim();

      // fenced code
      if (line.startsWith('```')) {
        closeList();
        const buf: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          buf.push(esc(lines[i]));
          i++;
        }
        i++;
        out.push(`<pre class="md-pre"><code>${buf.join('\n')}</code></pre>`);
        continue;
      }

      // ::: callout blocks
      const mo = line.match(/^:::\s*(tip|note|warn)\s*(.*)$/i);
      if (mo) {
        closeList();
        const kind = mo[1].toLowerCase();
        const title = mo[2].trim();
        const buf: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith(':::')) {
          buf.push(inline(lines[i].trim()));
          i++;
        }
        i++;
        const icon =
          kind === 'tip'
            ? 'bi-lightbulb-fill'
            : kind === 'note'
              ? 'bi-info-circle-fill'
              : 'bi-exclamation-triangle-fill';
        out.push(
          `<aside class="md-callout md-callout--${kind}"><div class="md-callout__head"><i class="bi ${icon}"></i><span>${title || kind.toUpperCase()}</span></div><div class="md-callout__body">${buf.join(' ')}</div></aside>`
        );
        continue;
      }

      if (!line) {
        closeList();
        i++;
        continue;
      }

      // headings
      const hm = line.match(/^(#{1,3})\s+(.*)$/);
      if (hm) {
        closeList();
        const level = hm[1].length;
        const text = hm[2];
        if (level === 2) {
          h2++;
          const id = 'sec-' + h2;
          toc.push({ id, label: text });
          out.push(`<h2 id="${id}" class="md-h2">${inline(text)}</h2>`);
        } else if (level === 3) {
          out.push(`<h3 class="md-h3">${inline(text)}</h3>`);
        } else {
          out.push(`<h1 class="md-h1">${inline(text)}</h1>`);
        }
        i++;
        continue;
      }

      // divider
      if (/^---+$/.test(line)) {
        closeList();
        out.push('<div class="md-divider"><i class="bi bi-diamond-fill"></i></div>');
        i++;
        continue;
      }

      // blockquote
      if (line.startsWith('>')) {
        closeList();
        out.push(`<blockquote class="md-quote">${inline(line.replace(/^>\s?/, ''))}</blockquote>`);
        i++;
        continue;
      }

      // checklist
      const cl = line.match(/^- \[( |x|X)\]\s+(.*)$/);
      if (cl) {
        if (listType !== 'ul') {
          closeList();
          out.push('<ul class="md-checklist">');
          listType = 'ul';
        }
        const done = cl[1].toLowerCase() === 'x';
        out.push(
          `<li class="md-check__item${done ? ' is-done' : ''}"><span class="md-check__box"><i class="bi ${done ? 'bi-check-lg' : ''}"></i></span><span>${inline(cl[2])}</span></li>`
        );
        i++;
        continue;
      }

      // bullets
      const ul = line.match(/^[-•]\s+(.*)$/);
      if (ul) {
        if (listType !== 'ul') {
          closeList();
          out.push('<ul class="md-list">');
          listType = 'ul';
        }
        out.push(`<li>${inline(ul[1])}</li>`);
        i++;
        continue;
      }

      // ordered
      const ol = line.match(/^\d+[.)]\s+(.*)$/);
      if (ol) {
        if (listType !== 'ol') {
          closeList();
          out.push('<ol class="md-list md-list--ol">');
          listType = 'ol';
        }
        out.push(`<li>${inline(ol[1])}</li>`);
        i++;
        continue;
      }

      // paragraph (merge soft-wrapped lines)
      closeList();
      const para: string[] = [line];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^#|^\s*>|^```|^:::|^\d+[.)]\s|^[-•]\s|^---|^- \[/.test(lines[i].trim())
      ) {
        para.push(lines[i].trim());
        i++;
      }
      out.push(`<p class="md-p">${inline(para.join(' '))}</p>`);
    }
    closeList();
    return { html: out.join('\n'), toc };
  }
}
