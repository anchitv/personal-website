# anchitverma.com

Astro 7 static site: blog posts, notes and projects, in Markdown under
`src/content/`. Run `npm run dev`, `npm run build` and `npm run check`. Astro
7 needs Node 22.12 or newer.

## Posts and notes

Posts and notes are committed only when they're ready to publish and
you're asked to. Tracked so far: the Homelab Foundations posts and the
notes they link. Everything else under `src/content/blog` and
`src/content/notes` stays untracked, so back it up before bulk edits:
there is no history to restore from. Projects (`src/content/projects`)
are tracked like code.

## What the build enforces

The build fails when:

- **A post runs over 5 minutes (1,000 words).** Trim it or split it into a
  series. Raw HTML counts its text, not its tags or screen-reader-only text
  (`src/remark-reading-time.mjs`).
- **A series and its folder disagree.** `SERIES` in `src/lib/series.ts`
  lists every part in reading order. Topic parts live at
  `src/content/blog/<series>/<topic>/<NN>-<slug>.md`, numbered from 1 per
  topic. Moving or renumbering a part keeps its URL, `/blog/<series>/<slug>/`.
- **A `[[part:slug]]` mention points forward.** Parts only refer back to
  earlier ones. `[[Part:slug]]` capitalises it.
- **A glossary term isn't in its note.** A note's `aliases` are its glossary
  entries and search terms, so the note must use each one: in its title,
  description or text, ignoring case and a plural ending. Name the term in
  the note or drop it. Each entry links to the section that first uses the
  term (`src/rehype-glossary-sections.mjs`).
- **A link on the site goes nowhere.** Every link to a page of this site
  must reach a built page, so links to drafts, removed posts and notes that
  aren't here yet fail. A `#section` must be an id on its page. Links to
  other sites aren't checked (`src/check-links.mjs`).
- **The software link list has software no page mentions.** The list in
  `scripts/check-software-links.mjs` holds only what the posts, notes and
  projects here name. A post brought in from outside the repo adds its
  software back with it (`src/check-software-list.mjs`).

Removed or renamed posts get a redirect in `astro.config.mjs`.

## Writing style

- Plain words and short sentences, in British spelling (analyse, licence).
- **In notes, a paragraph or list item runs three lines at most.** That's
  about 240 characters as the reader sees them, the width of three lines in
  the note column on a wide screen. Split anything longer into short
  paragraphs that make one point each. Where the text holds steps, options
  or several points side by side, use a list. Readers come to a note to
  look one thing up, so it should be quick to scan.
- **No comma before "and" or "or".** Not between two halves of one verb,
  short clauses or a pair, and not before the last item of a list. Keep it
  only where it's needed:
  - It closes an aside: "pick the branch to start from, usually `main`, and
    pick an agent".
  - A list item already contains "and" or "or": "Claude Code, Codex and
    OpenCode, and the tools they use".
  - Leaving it out would misread: "`docker` becomes `podman`, and compose
    files work…" (not "podman and compose files").
  Where it would misread, splitting into two sentences often reads better.
- Headings in sentence case. Inside a section, Pros and Cons are `####`
  headings, styled as headings a step below `###`.
- List items start with a bold label: **Label.** followed by sentences.
- No long dashes (– or —). Use a full stop or comma instead, and "to" in
  ranges: "$10 to $20".
- A paragraph that introduces a list sits close to it by itself (CSS); no
  need to change anything in the Markdown.

## Commands and examples

- Cover Debian (13 or newer) and Arch. Introduce every OS-specific command
  with its system: "On Debian:" and "On Arch:".
- Readers set everything up on the computer they use, so posts reach
  services at `localhost`. Notes about networks use `192.168.1.10` as the
  example address of a machine on the network. Replace values readers must
  change with `<placeholders>`.
- Write container images in full, like `docker.io/library/postgres`.
- Give file code blocks their path: ```` ```yaml title="example/compose.yaml" ````.

## Links

- **Software:** link it the first time it appears on a page and again the
  first time it appears in each `##` or `###` section, since readers jump
  there from the contents. At most once per section; never in headings or
  code.
- **Where to point:** official docs that explain what the software is.
  Where they don't, use the Arch Wiki (KVM, systemd, nano, Vulkan, Arch
  itself). `scripts/check-software-links.mjs` lists the URL for every piece
  of software the site mentions; add new software there, after checking its
  URL loads.
- **Checked on every edit:** a hook in `.claude/settings.json` runs that
  script after any edit to a post or note and reports unlinked software
  with the URL to use. Run it by hand with
  `node scripts/check-software-links.mjs <file>…`.
- **Concepts** link to their note, like `[SSH](/notes/ssh-keys/)`, rather
  than an outside site.
- Don't mark links by hand. `src/rehype-link-kinds.mjs` marks where each
  link goes, which sets its colour: posts gold, notes green, projects blue,
  other pages copper and other sites indigo. It adds the external icon and
  "(external site)" for screen readers to links to other sites, and an
  arrow to links to another section of the page: down, or up for one
  further up. Links open in the same tab.
- Raw HTML isn't seen by that plugin, so links in it carry the markup
  themselves:
  `<a class="link-external" href="…"><span class="link-end">Name</span><span class="visually-hidden"> (external site)</span></a>`,
  or `<a class="link-jump link-blog" href="#id"><span class="link-end">Name</span></a>`
  in a post, adding `link-jump-up` when the section is further up. A link
  to a post, note, project or other page carries
  `link-blog`, `link-notes`, `link-projects` or `link-page`.

## Comparison tables

For options rated side by side, use the comparison table in
`src/styles/components.css` (its comment has the full markup), as in
Foundations Part 2's "At a glance":

- Raw HTML: `<div class="compare"><table>…`, option names as
  `<th scope="row">` linking to their sections, install links in
  `<span class="compare-links">` under the name.
- Every column has three levels, best to worst: `rating-good`,
  `rating-mid`, `rating-bad`. Each column names its own (Low, Medium,
  High). A word always keeps its colour.
- Each `<td>` has a `data-label` with its column's name, for the stacked
  layout on phones.
