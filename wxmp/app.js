/**
 * Article Application
 * Manages state, filtering, pagination, and rendering of articles.
 */
class ArticleApp {
    constructor() {
        // Application State
        this.state = {
            allData: [],
            filteredData: [],
            currentPage: 1,
            pageSize: 20,
            isLoading: false,
            hasMore: true,
            viewMode: 'pages', // 'scroll' | 'pages'
            sortOrder: 'desc', // 'desc' | 'asc' 
            debounceTimer: null,
            readHistory: {} // url -> { count: number, lastRead: timestamp }
        };

        // DOM Element References
        this.elements = {
            accountFilter: document.getElementById('accountFilter'),
            viewModeFilter: document.getElementById('viewModeFilter'),
            sortFilter: document.getElementById('sortFilter'),
            pageSizeFilter: document.getElementById('pageSizeFilter'),
            startDateInput: document.getElementById('startDateInput'),
            endDateInput: document.getElementById('endDateInput'),
            searchInput: document.getElementById('searchInput'),
            excludeInput: document.getElementById('excludeInput'),
            articleList: document.getElementById('articleList'),
            stats: document.getElementById('stats'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            noMoreData: document.getElementById('noMoreData'),
            paginationControls: document.getElementById('paginationControls'),
            btnPrev: document.getElementById('btnPrev'),
            btnNext: document.getElementById('btnNext'),
            pageInfo: document.getElementById('pageInfo')
        };
    }

    /**
     * Initialize the application
     */
    init() {
        if (typeof window.wxData === 'undefined') {
            this.elements.articleList.innerHTML = '<div class="no-data">数据文件(data.js)未加载。请确保运行了 build_data.js 并且 data.js 存在。</div>';
            throw new Error('Data not loaded');
        }

        this.state.allData = window.wxData;
        this.state.filteredData = [...this.state.allData];

        // Load read history
        try {
            const storedHistory = localStorage.getItem('wxmp_read_history');
            if (storedHistory) {
                this.state.readHistory = JSON.parse(storedHistory);
            }
        } catch (e) {
            console.error('Failed to load read history:', e);
        }

        this.populateAccountFilter();
        this.bindEvents();
        this.applyFilter(); // Initial render
    }

    /**
     * Bind event listeners to DOM elements
     */
    bindEvents() {
        // Infinite Scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Filters
        this.elements.accountFilter.addEventListener('change', () => this.applyFilter());
        this.elements.viewModeFilter.addEventListener('change', () => this.changeViewMode());
        this.elements.sortFilter.addEventListener('change', () => this.applyFilter());
        this.elements.pageSizeFilter.addEventListener('change', () => this.changePageSize());
        this.elements.startDateInput.addEventListener('change', () => this.applyFilter());
        this.elements.endDateInput.addEventListener('change', () => this.applyFilter());
        
        // Search Inputs (Debounced)
        this.elements.searchInput.addEventListener('input', () => this.debouncedApplyFilter());
        this.elements.excludeInput.addEventListener('input', () => this.debouncedApplyFilter());

        // Pagination Buttons
        this.elements.btnPrev.addEventListener('click', () => this.prevPage());
        this.elements.btnNext.addEventListener('click', () => this.nextPage());

        // Article Click Tracking
        this.elements.articleList.addEventListener('click', (e) => this.handleArticleClick(e));
    }

    /**
     * Populate the account dropdown filter
     */
    populateAccountFilter() {
        const accounts = new Set(this.state.allData.map(item => item._accountName).filter(Boolean));
        const sortedAccounts = Array.from(accounts).sort();
        
        // Reset options
        this.elements.accountFilter.innerHTML = '<option value="">所有公众号</option>';
        
        sortedAccounts.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc;
            option.textContent = acc;
            this.elements.accountFilter.appendChild(option);
        });
    }

    /**
     * Handle article link clicks to track read history
     */
    handleArticleClick(e) {
        // Find the closest anchor tag with an href
        const link = e.target.closest('a');
        if (!link || !this.elements.articleList.contains(link)) return;

        const url = link.getAttribute('href'); 
        
        if (!url) return;

        if (!this.state.readHistory[url]) {
            this.state.readHistory[url] = { count: 0, lastRead: 0 };
        }

        this.state.readHistory[url].count++;
        this.state.readHistory[url].lastRead = Date.now();

        try {
            localStorage.setItem('wxmp_read_history', JSON.stringify(this.state.readHistory));
        } catch (e) {
            console.error('Failed to save read history:', e);
        }

        // Update UI immediately
        link.classList.add('read');
        
        // Find the article card to update the count display
        const card = link.closest('.article-card');
        if (card) {
            const meta = card.querySelector('.article-meta');
            let countSpan = card.querySelector('.read-count');
            
            if (!countSpan) {
                countSpan = document.createElement('span');
                countSpan.className = 'read-count';
                meta.appendChild(countSpan);
            }
            
            countSpan.textContent = `已读 ${this.state.readHistory[url].count} 次`;
        }
    }

    /**
     * Handle window scroll event for infinite scrolling
     */
    handleScroll() {
        if (this.state.viewMode !== 'scroll') return;
        if (this.state.isLoading || !this.state.hasMore) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 500; // Load more when 500px from bottom

        if (scrollPosition >= threshold) {
            this.loadMore();
        }
    }

    /**
     * Apply filter with debounce delay
     */
    debouncedApplyFilter() {
        clearTimeout(this.state.debounceTimer);
        this.state.debounceTimer = setTimeout(() => {
            this.applyFilter();
        }, 300);
    }

    /**
     * Filter data based on current inputs
     */
    applyFilter() {
        const searchText = this.elements.searchInput.value.toLowerCase().trim();
        const excludeText = this.elements.excludeInput.value.toLowerCase().trim();
        const selectedAccount = this.elements.accountFilter.value;
        const sortOrder = this.elements.sortFilter.value;
        const startDateValue = this.elements.startDateInput.value;
        const endDateValue = this.elements.endDateInput.value;
        const excludeKeywords = excludeText ? excludeText.split(/\s+/) : [];

        // Parse dates to timestamps (if provided)
        const startTime = startDateValue ? new Date(startDateValue).getTime() / 1000 : 0;
        const endTime = endDateValue ? new Date(endDateValue).setHours(23, 59, 59, 999) / 1000 : Infinity;

        this.state.filteredData = this.state.allData.filter(item => {
            const matchAccount = !selectedAccount || item._accountName === selectedAccount;
            const titleLower = item.title ? item.title.toLowerCase() : '';
            const matchTitle = !searchText || titleLower.includes(searchText);
            const shouldExclude = excludeKeywords.length > 0 && excludeKeywords.some(keyword => titleLower.includes(keyword));
            
            // Time range filter
            const itemTime = item.update_time || 0;
            const matchTime = itemTime >= startTime && itemTime <= endTime;

            return matchAccount && matchTitle && !shouldExclude && matchTime;
        });

        // Sort data
        this.state.filteredData.sort((a, b) => {
            const timeA = a.update_time || 0;
            const timeB = b.update_time || 0;
            return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });

        // Reset pagination state
        this.state.currentPage = 1;
        this.state.hasMore = true;
        
        // Clear list for fresh render
        this.elements.articleList.innerHTML = ''; 
        
        this.render();
    }

    /**
     * Change View Mode (Scroll vs Pages)
     */
    changeViewMode() {
        this.state.viewMode = this.elements.viewModeFilter.value;
        this.applyFilter(); // Re-render with new mode
    }

    /**
     * Change Page Size
     */
    changePageSize() {
        this.state.pageSize = parseInt(this.elements.pageSizeFilter.value, 10);
        this.applyFilter();
    }

    /**
     * Load next page (Infinite Scroll)
     */
    loadMore() {
        this.state.currentPage++;
        this.render();
    }

    /**
     * Go to previous page (Pagination)
     */
    prevPage() {
        if (this.state.currentPage > 1) {
            this.state.currentPage--;
            this.render();
            window.scrollTo(0, 0);
        }
    }

    /**
     * Go to next page (Pagination)
     */
    nextPage() {
        const totalPages = Math.ceil(this.state.filteredData.length / this.state.pageSize);
        if (this.state.currentPage < totalPages) {
            this.state.currentPage++;
            this.render();
            window.scrollTo(0, 0);
        }
    }

    /**
     * Format timestamp to readable string
     */
    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Render the UI based on current state
     */
    render() {
        this.state.isLoading = true;
        
        // Update stats
        this.elements.stats.textContent = `共 ${this.state.filteredData.length} 篇文章`;

        // Calculate pagination range
        const totalPages = Math.ceil(this.state.filteredData.length / this.state.pageSize) || 1;
        const start = (this.state.currentPage - 1) * this.state.pageSize;
        const end = start + this.state.pageSize;

        // Configure UI based on View Mode
        if (this.state.viewMode === 'scroll') {
            // Scroll Mode UI
            this.elements.paginationControls.style.display = 'none';
            
            if (start >= this.state.filteredData.length) {
                this.state.isLoading = false;
                this.state.hasMore = false;
                this.elements.loadingIndicator.style.display = 'none';
                this.elements.noMoreData.style.display = 'block';
                return;
            }

            this.elements.loadingIndicator.style.display = 'block';
            this.elements.loadingIndicator.textContent = `正在加载第 ${this.state.currentPage} 页...`;
            this.elements.noMoreData.style.display = 'none';
        } else {
            // Pages Mode UI
            this.elements.paginationControls.style.display = 'flex';
            this.elements.loadingIndicator.style.display = 'none';
            this.elements.noMoreData.style.display = 'none';

            this.elements.btnPrev.disabled = this.state.currentPage === 1;
            this.elements.btnNext.disabled = this.state.currentPage >= totalPages;
            this.elements.pageInfo.textContent = `第 ${this.state.currentPage} / ${totalPages} 页`;
        }

        // Slice data for current page
        const pageData = this.state.filteredData.slice(start, end);
        
        // Generate HTML
                const html = pageData.map(item => {
                    const coverUrl = item.cover || '';
                    const imgHtml = coverUrl ? `<img src="${coverUrl}" class="article-cover" alt="封面" loading="lazy" onerror="this.style.display='none'">` : '';
                    
                    const history = this.state.readHistory[item.link] || { count: 0 };
                    const readClass = history.count > 0 ? 'read' : '';
                    const countHtml = history.count > 0 ? `<span class="read-count">已读 ${history.count} 次</span>` : '';

                    return `
                        <div class="article-card">
                            ${imgHtml}
                            <div class="article-content">
                                <h2 class="article-title">
                                    <a href="${item.link}" target="_blank" class="${readClass}">${item.title}</a>
                                </h2>
                                <div class="article-meta">
                                    <span>${item._accountName || '未知公众号'}</span>
                                    <span>${this.formatDate(item.update_time)}</span>
                                    ${countHtml}
                                </div>
                                <div class="article-digest">${item.digest || ''}</div>
                            </div>
                        </div>
                    `;
                }).join('');

        // Inject HTML
        if (this.state.viewMode === 'scroll') {
            this.elements.articleList.insertAdjacentHTML('beforeend', html);
            
            if (end >= this.state.filteredData.length) {
                this.state.hasMore = false;
                this.elements.loadingIndicator.style.display = 'none';
                this.elements.noMoreData.style.display = 'block';
            } else {
                this.elements.loadingIndicator.style.display = 'none';
            }
        } else {
            this.elements.articleList.innerHTML = html;
        }

        this.state.isLoading = false;
    }
}

// Instantiate and start the application
const app = new ArticleApp();
app.init();
