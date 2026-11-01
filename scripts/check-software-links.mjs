// Reports software in a post or note that isn't linked where CLAUDE.md asks:
// the first time it appears on a page, and again the first time in each ##
// or ### section. Runs as a Claude Code hook after edits under src/content
// (.claude/settings.json), reading the edited file's path from the hook's
// JSON on stdin, and by hand: node scripts/check-software-links.mjs <file>…
// It only reports; it never changes a file. The build fails when the list
// below has software no page mentions (src/check-software-list.mjs)
import { readFileSync, realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Software → the page that explains it: official docs, or the Arch Wiki
// where those don't. Names sharing a URL count as one piece of software.
// Add new software here when a post first mentions it, and only then: the
// build fails on an entry no post, note or project uses
const SOFTWARE = [
  [['Docker Compose'], 'https://docs.docker.com/compose/'],
  [['Home Assistant OS'], 'https://www.home-assistant.io/installation/'],
  [['Proxmox VE', 'Proxmox'], 'https://www.proxmox.com/en/products/proxmox-virtual-environment/overview'],
  [['Arch Linux', 'Arch'], 'https://wiki.archlinux.org/title/Arch_Linux'],
  [['Debian'], 'https://www.debian.org/intro/about'],
  [['Ubuntu'], 'https://ubuntu.com/server'],
  [['Docker'], 'https://docs.docker.com/get-started/docker-overview/'],
  [['podman-compose'], 'https://github.com/containers/podman-compose'],
  [['Podman'], 'https://docs.podman.io/en/latest/'],
  [['Quadlet'], 'https://docs.podman.io/en/stable/markdown/podman-systemd.unit.5.html'],
  [['Kubernetes'], 'https://kubernetes.io/docs/concepts/overview/'],
  [['k3s'], 'https://docs.k3s.io/'],
  [['KVM'], 'https://wiki.archlinux.org/title/KVM'],
  [['Incus'], 'https://linuxcontainers.org/incus/docs/main/'],
  [['Unraid'], 'https://docs.unraid.net/unraid-os/getting-started/what-is-unraid/'],
  [['TrueNAS'], 'https://www.truenas.com/truenas-community-edition/'],
  [['CasaOS'], 'https://casaos.zimaspace.com/'],
  [['systemd'], 'https://wiki.archlinux.org/title/Systemd'],
  [['nano'], 'https://wiki.archlinux.org/title/Nano'],
  [['Git', 'git'], 'https://git-scm.com/'],
  [['Caddy'], 'https://caddyserver.com/docs/'],
  [['Headscale'], 'https://headscale.net/stable/'],
  [['Tailscale'], 'https://tailscale.com/kb/1151/what-is-tailscale'],
  [['Cloudflare'], 'https://developers.cloudflare.com/dns/'],
  [['Immich'], 'https://github.com/immich-app/immich'],
  [['Nextcloud'], 'https://nextcloud.com/files/'],
  [['PostgreSQL'], 'https://www.postgresql.org/about/'],
];
const CONTENT = /\/src\/content\/(blog|notes)\/.+\.md$/;

const group = new Map();
SOFTWARE.forEach(([names], g) => names.forEach((name) => group.set(name, g)));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Longest names first, so "Docker Compose" isn't read as "Docker"
const NAMES = [...group.keys()].sort((a, b) => b.length - a.length).map(escape);
const NAME = new RegExp(`(?<![\\w./@#-])(${NAMES.join('|')})(?![\\w-]|\\.\\w)`, 'g');
const LINK = /\[([^\]]*)\]\(([^)\s]*)[^)]*\)/g;

// The problems in a page, and the software it mentions where this check
// looks: by name in prose, or in a link by name or URL
function scan(file) {
  const text = readFileSync(file, 'utf8');
  const frontmatter = text.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? '';
  const offset = frontmatter.split('\n').length - 1;
  const lines = text.slice(frontmatter.length).split('\n');

  // Sections start at h1 to h3, the levels the contents sidebar lists.
  // Prose lines exclude code blocks, raw HTML and headings
  const sections = [[]];
  const prose = [];
  let fence = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) fence = !fence;
    else if (!fence && /^#{1,3} /.test(line)) sections.push([]);
    sections.at(-1).push(i);
    prose[i] = !fence && !/^\s*```/.test(line) && !/^\s*</.test(line) && !/^#{1,6} /.test(line);
  });

  const problems = [];
  const used = new Set();
  for (const section of sections) {
    // Linked already in this section, by name or by URL
    const linked = new Set();
    for (const i of section) for (const m of lines[i].matchAll(LINK)) {
      if (group.has(m[1])) linked.add(group.get(m[1]));
      SOFTWARE.forEach(([, url], g) => m[2] === url && linked.add(g));
    }
    linked.forEach((g) => used.add(g));
    for (const i of section) {
      if (!prose[i]) continue;
      // Blank out what can't hold a link, keeping positions
      const blank = (s) => ' '.repeat(s.length);
      const plain = lines[i]
        .replace(/`[^`]*`/g, blank)
        .replace(/\[\[[^\]]*\]\]/g, blank)
        .replace(LINK, blank)
        .replace(/<[^>]+>/g, blank)
        .replace(/https?:\/\/\S+/g, blank);
      for (const m of plain.matchAll(NAME)) {
        const g = group.get(m[1]);
        used.add(g);
        if (linked.has(g)) continue;
        linked.add(g);
        problems.push(`${file}:${offset + i + 1}: "${m[1]}" isn't linked in this section. Link it to ${SOFTWARE[g][1]}`);
      }
    }
  }
  return { problems, used };
}

const check = (file) => scan(file).problems;

// The first name of each entry none of these pages mentions
export function unusedSoftware(files) {
  const used = new Set(files.flatMap((file) => [...scan(file).used]));
  return SOFTWARE.filter((_, g) => !used.has(g)).map(([names]) => names[0]);
}

// Run as a script or hook; the build only imports unusedSoftware
const asScript = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
const files = process.argv.slice(2);
if (asScript && files.length) {
  const problems = files.flatMap(check);
  problems.forEach((p) => console.log(p));
  process.exitCode = problems.length ? 1 : 0;
} else if (asScript) {
  // As a hook: the edited file's path comes in the hook's JSON
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const { tool_input: toolInput = {}, tool_response: toolResponse = {} } = JSON.parse(input || '{}');
  const file = toolInput.file_path ?? toolResponse.filePath;
  if (file && CONTENT.test(file)) {
    const problems = check(file);
    if (problems.length) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `Unlinked software (CLAUDE.md, Links):\n${problems.join('\n')}`,
        },
      }));
    }
  }
}
