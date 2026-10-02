interface FilterConfig {
  itemsPerPage: number;
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

  const list = document.querySelector(listSelector);
  if (!list) return;

  const items = Array.from(list.querySelectorAll(itemSelector));
  const searchInput = document.querySelector<HTMLInputElement>('[data-filter-search]');
  const yearSelect = document.querySelector<HTMLSelectElement>('[data-filter-year]');
  const tagButtons = Array.from(document.querySelectorAll('[data-filter-tags] .filter-tag'));
  const seriesButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-filter-series] .filter-tag'));
  const clearBtn = document.querySelector('[data-filter-clear]');
  const countEl = document.querySelector('[data-filter-count]');
  const paginationEl = document.querySelector('[data-pagination]');

  let activeTags: string[] = [];
  let activeSeries = '';
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

  function getFiltered() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const year = yearSelect?.value || '';

    return items.filter((item) => {
      const el = item as HTMLElement;
      if (query) {
        const title = (el.dataset.title || '').toLowerCase();
        const desc = (el.dataset.description || '').toLowerCase();
        if (!title.includes(query) && !(hasDescription && desc.includes(query))) return false;
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

  function render() {
    const filtered = getFiltered();

    // A series reads in part order; everything else stays newest first
    if (activeSeries) {
      filtered.sort((a, b) => seriesOrder(a) - seriesOrder(b));
      list!.append(...filtered);
    } else if (seriesButtons.length > 0) {
      list!.append(...items);
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleArr = filtered.slice(start, end);
    const visibleSet = new Set(visibleArr);

    items.forEach((item) => {
      (item as HTMLElement).style.display = visibleSet.has(item) ? '' : 'none';
    });

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

  render();

  return {
    render() { currentPage = 1; render(); },
  };
}
