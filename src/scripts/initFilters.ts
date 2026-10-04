interface FilterConfig {
  /** Omit to show every item on one page */
  itemsPerPage?: number;
  itemLabel: string;
  listSelector?: string;
  itemSelector?: string;
  hasDescription?: boolean;
  customFilter?: (el: HTMLElement) => boolean;
  onClear?: () => void;
  onRender?: (filtered: Element[], visible: Set<Element>) => void;
}

export function initFilters(config: FilterConfig) {
  const {
    itemsPerPage,
    itemLabel,
    listSelector = '[data-list]',
    itemSelector = 'li',
    hasDescription = false,
    customFilter,
    onClear,
    onRender,
  } = config;

  // The mobile filters toggle, wired before the list check so it still opens
  // on an empty listing. CSS owns both end states; this animates the height
  // between them. Web Animations leave no inline styles behind to fight the
  // desktop layout
  const toggleBtn = document.querySelector('[data-filter-toggle]');
  const collapseEl = document.querySelector<HTMLElement>('[data-filter-collapse]');
  let toggleAnim: Animation | undefined;

  toggleBtn?.addEventListener('click', () => {
    const from = collapseEl?.offsetHeight ?? 0;
    toggleBtn.setAttribute('aria-expanded', String(toggleBtn.getAttribute('aria-expanded') !== 'true'));
    if (!collapseEl || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    toggleAnim?.cancel();
    // Matches --duration-300 and --ease-out-expo
    toggleAnim = collapseEl.animate(
      [{ height: `${from}px` }, { height: `${collapseEl.offsetHeight}px` }],
      { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
  });

  const list = document.querySelector(listSelector);
  if (!list) return;

  const items = Array.from(list.querySelectorAll(itemSelector));
  const searchInput = document.querySelector<HTMLInputElement>('[data-filter-search]');
  const yearSelect = document.querySelector<HTMLSelectElement>('[data-filter-year]');
  const sortSelect = document.querySelector<HTMLSelectElement>('[data-filter-sort]');
  const sortDirection = document.querySelector<HTMLButtonElement>('[data-filter-sort-direction]');
  // Headings for the "group" sort, in display order; items name theirs in data-group
  const groupHeadings = Array.from(list.querySelectorAll<HTMLElement>('[data-group-heading]'));
  const tagButtons = Array.from(document.querySelectorAll('[data-filter-tags] .filter-tag'));
  const seriesButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-filter-series] .filter-tag'));
  const clearBtn = document.querySelector('[data-filter-clear]');
  const countEl = document.querySelector('[data-filter-count]');
  const paginationEl = document.querySelector('[data-pagination]');

  let activeTags: string[] = [];
  let activeSeries = '';
  // The selected sort's direction; each starts in its usual one
  const startsDescending = () => sortSelect?.selectedOptions[0]?.dataset.startDescending !== undefined;
  let descending = startsDescending();
  let currentPage = 1;
  let isFirstRender = true;

  // Keeps ?series= in the URL in step with the Series filter, so the
  // "<name> series" links elsewhere on the site open the listing filtered
  function setSeries(id: string) {
    activeSeries = id;
    seriesButtons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.series === id));
    const url = new URL(location.href);
    if (id) url.searchParams.set('series', id);
    else url.searchParams.delete('series');
    history.replaceState(history.state, '', url);
  }

  // Reading order within a series, from its list in src/lib/series.ts
  const seriesOrder = (el: Element) => Number((el as HTMLElement).dataset.seriesOrder);

  function getFiltered(includeSearch = true) {
    const terms = includeSearch ? (searchInput?.value || '').toLowerCase().split(/\s+/).filter(Boolean) : [];
    const year = yearSelect?.value || '';

    return items.filter((item) => {
      const el = item as HTMLElement;
      // Every word has to match somewhere, in any order
      if (terms.length > 0) {
        const haystack = [el.dataset.title, hasDescription && el.dataset.description, el.dataset.aliases]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!terms.every((term) => haystack.includes(term))) return false;
      }
      if (activeTags.length > 0) {
        const itemTags = (el.dataset.tags || '').split(',');
        if (!activeTags.some((t) => itemTags.includes(t))) return false;
      }
      if (activeSeries && el.dataset.series !== activeSeries) return false;
      if (year) {
        const itemDate = el.dataset.date || '';
        if (!itemDate.startsWith(year)) return false;
      }
      if (customFilter && !customFilter(el)) return false;
      return true;
    });
  }

  // The post's own title, without "Part 4: ", so series parts don't sort by number
  const titleOf = (el: Element) => (el as HTMLElement).dataset.sortTitle || '';
  const dateOf = (el: Element) => (el as HTMLElement).dataset.date || '';
  const groupIndex = (el: Element) =>
    groupHeadings.findIndex((heading) => heading.dataset.groupHeading === (el as HTMLElement).dataset.group);
  const byTitle = (a: Element, b: Element) =>
    titleOf(a).localeCompare(titleOf(b), 'en', { sensitivity: 'base', numeric: true });
  // Series A–Z (Z–A descending), each in reading order, then posts outside
  // a series, newest first
  const seriesOf = (el: Element) => (el as HTMLElement).dataset.series || '';
  const bySeries = (a: Element, b: Element, dir: number) => {
    const [seriesA, seriesB] = [seriesOf(a), seriesOf(b)];
    if (seriesA && seriesB) return dir * seriesA.localeCompare(seriesB) || seriesOrder(a) - seriesOrder(b);
    if (seriesA || seriesB) return seriesA ? -1 : 1;
    return dateOf(b).localeCompare(dateOf(a)) || byTitle(a, b);
  };

  // Ascending is oldest first, A–Z, series A–Z; descending flips it. Ties
  // fall back to title order, so items with the same date don't shuffle
  function sortItems(filtered: Element[], sort: string) {
    const dir = descending ? -1 : 1;
    if (sort === 'date') filtered.sort((a, b) => dir * dateOf(a).localeCompare(dateOf(b)) || byTitle(a, b));
    else if (sort === 'group') filtered.sort((a, b) => groupIndex(a) - groupIndex(b) || byTitle(a, b));
    else if (sort === 'series') filtered.sort((a, b) => bySeries(a, b, dir));
    else filtered.sort((a, b) => dir * byTitle(a, b));
  }

  // Shows the selected sort's direction on its button: its icon (a calendar
  // for dates, letters for the rest), and the order's name for screen readers
  // and as a tooltip. A sort with one order, like Topic, disables it
  function showOrder() {
    if (!sortDirection) return;
    const option = sortSelect!.selectedOptions[0];
    const order = option.dataset[descending ? 'desc' : 'asc'];
    const icon = `${option.dataset.icon ?? 'text'}-${descending ? 'desc' : 'asc'}`;
    sortDirection.disabled = !order;
    sortDirection.querySelectorAll<HTMLElement>('[data-sort-icon]').forEach((el) => { el.hidden = el.dataset.sortIcon !== icon; });
    sortDirection.setAttribute('aria-label', order ? `Sort order: ${order}` : 'Sort order');
    sortDirection.title = order ? `${order}, select to reverse` : '';
  }

  // Puts the shown items in order, with each group's heading before its
  // first item, and moves everything hidden to the end. The first item shown
  // then stays the list's first child and keeps its top rule
  function arrange(visibleArr: Element[]) {
    const grouped = sortSelect!.value === 'group';
    const shown: Element[] = [];
    for (const item of visibleArr) {
      const heading = grouped && groupHeadings[groupIndex(item)];
      if (heading && !shown.includes(heading)) shown.push(heading);
      shown.push(item);
    }
    groupHeadings.forEach((heading) => {
      heading.style.display = shown.includes(heading) ? '' : 'none';
    });
    list!.append(...shown, ...[...items, ...groupHeadings].filter((el) => !shown.includes(el)));
  }

  function render() {
    const filtered = getFiltered();

    // The Sort by menu orders the list, a selected series too; without one,
    // items stay in page order
    if (sortSelect) sortItems(filtered, sortSelect.value);

    const totalPages = itemsPerPage ? Math.max(1, Math.ceil(filtered.length / itemsPerPage)) : 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;
    const visibleArr = itemsPerPage ? filtered.slice(start, start + itemsPerPage) : filtered;
    const visibleSet = new Set(visibleArr);

    items.forEach((item) => {
      (item as HTMLElement).style.display = visibleSet.has(item) ? '' : 'none';
    });

    if (sortSelect) arrange(visibleArr);

    if (!isFirstRender) {
      visibleArr.forEach((item, i) => {
        item.classList.remove('reveal');
        (item as HTMLElement).style.setProperty('--delay', `${15 * i}ms`);
        void (item as HTMLElement).offsetWidth;
        item.classList.add('reveal');
      });
    }

    isFirstRender = false;

    if (countEl) {
      countEl.textContent = `${filtered.length} of ${items.length} ${itemLabel}`;
    }

    // Tints the mobile toggle while the filters folded behind it (not the
    // always-visible search) hide items, e.g. after arriving via ?series=
    toggleBtn?.classList.toggle('is-active', getFiltered(false).length < items.length);

    if (onRender) {
      onRender(filtered, visibleSet);
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages: number) {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';
    if (totalPages <= 1) return;

    const pages = getPageNumbers(currentPage, totalPages);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.dataset.page = 'prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.textContent = '\u2190';
    paginationEl.appendChild(prevBtn);

    for (const p of pages) {
      if (p === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '\u2026';
        paginationEl.appendChild(ellipsis);
      } else {
        const btn = document.createElement('button');
        btn.className = `pagination-btn${p === currentPage ? ' is-active' : ''}`;
        btn.dataset.page = String(p);
        if (p === currentPage) btn.setAttribute('aria-current', 'page');
        btn.textContent = String(p);
        paginationEl.appendChild(btn);
      }
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.dataset.page = 'next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.textContent = '\u2192';
    paginationEl.appendChild(nextBtn);
  }

  function getPageNumbers(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  // Event listeners
  searchInput?.addEventListener('input', () => { currentPage = 1; render(); });
  yearSelect?.addEventListener('change', () => { currentPage = 1; render(); });
  // A new sort starts in its usual order
  sortSelect?.addEventListener('change', () => { descending = startsDescending(); showOrder(); currentPage = 1; render(); });
  sortDirection?.addEventListener('click', () => { descending = !descending; showOrder(); currentPage = 1; render(); });

  tagButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = (btn as HTMLElement).dataset.tag!;
      if (activeTags.includes(tag)) {
        activeTags = activeTags.filter((t) => t !== tag);
        btn.classList.remove('is-active');
      } else {
        activeTags.push(tag);
        btn.classList.add('is-active');
      }
      currentPage = 1;
      render();
    });
  });

  seriesButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setSeries(activeSeries === btn.dataset.series ? '' : btn.dataset.series!);
      currentPage = 1;
      render();
    });
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (yearSelect) yearSelect.value = '';
    activeTags = [];
    tagButtons.forEach((btn) => btn.classList.remove('is-active'));
    if (activeSeries) setSeries('');
    if (onClear) onClear();
    currentPage = 1;
    render();
  });

  paginationEl?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-page]');
    if (!btn || btn.disabled) return;
    const val = btn.dataset.page!;
    if (val === 'prev') currentPage--;
    else if (val === 'next') currentPage++;
    else currentPage = Number(val);
    render();
    document.querySelector('.header-rule')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const seriesParam = new URLSearchParams(location.search).get('series');
  if (seriesButtons.some((btn) => btn.dataset.series === seriesParam)) setSeries(seriesParam!);

  // The browser can restore an earlier sort on back navigation
  showOrder();
  render();

  return {
    render() { currentPage = 1; render(); },
  };
}
