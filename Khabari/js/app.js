
(function () {
  const data = window.KHABARI_DATA;
  const articles = data.articles.slice().sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
  const categories = data.categories;
  const state = {
    tickerIndex: 0,
    heroIndex: 0,
    visibleCount: 12,
    currentList: [],
    bookmarks: readSet("khabariBookmarks"),
    likes: readSet("khabariLikes"),
    reports: readObject("khabariReports"),
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const app = $("#app");

  function readSet(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch { return new Set(); }
  }

  function saveSet(key, set) {
    localStorage.setItem(key, JSON.stringify([...set]));
  }

  function readObject(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function saveObject(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function imageFallback() {
    return "assets/images/hero.svg";
  }

  function sourceLink(article, className = "source-link") {
    if (!article.sourceUrl) return "";
    return `<a class="${className}" href="${article.sourceUrl}" target="_blank" rel="noopener">Source: ${escapeHTML(article.sourceName || "Original source")}</a>`;
  }

  function toast(message) {
    const stack = $("#toastStack");
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    stack.appendChild(node);
    setTimeout(() => node.remove(), 3200);
  }

  function initChrome() {
    const savedTheme = localStorage.getItem("khabariTheme");
    if (savedTheme === "dark") document.body.classList.add("dark");
    $("#themeToggle").addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("khabariTheme", document.body.classList.contains("dark") ? "dark" : "light");
      toast("Theme updated");
    });

    $("#menuToggle").addEventListener("click", () => {
      const list = $("#navList");
      list.classList.toggle("open");
      $("#menuToggle").setAttribute("aria-expanded", list.classList.contains("open"));
    });

    updateClock();
    setInterval(updateClock, 1000);
    updateBookmarkCount();
    initModernChrome();
    initTicker();
    initScrollTools();
    initShortcuts();
    setTimeout(() => $("#loadingScreen").classList.add("hidden"), 380);
  }

  function initModernChrome() {
    const actions = $(".nav-actions");
    if (actions && !$("#commandOpen")) {
      actions.insertAdjacentHTML("afterbegin", `<button class="icon-button command-open" id="commandOpen" aria-label="Open command palette">K</button>`);
    }
    document.body.insertAdjacentHTML("beforeend", `
      <div class="command-backdrop" id="commandBackdrop" hidden>
        <section class="command-panel" role="dialog" aria-modal="true" aria-label="Khabari command palette">
          <div class="command-search">
            <span>K</span>
            <input id="commandInput" type="search" placeholder="Search stories, sections, sources..." autocomplete="off">
            <button class="icon-button" id="commandClose" aria-label="Close command palette">Esc</button>
          </div>
          <div class="command-results" id="commandResults"></div>
        </section>
      </div>
      <div class="report-backdrop" id="reportBackdrop" hidden>
        <section class="report-panel" role="dialog" aria-modal="true" aria-labelledby="reportTitle">
          <form id="reportForm">
            <div class="report-head">
              <div>
                <span class="eyebrow">Reader Report</span>
                <h2 id="reportTitle">Report News Authenticity</h2>
              </div>
              <button class="icon-button" type="button" id="reportClose" aria-label="Close report form">Esc</button>
            </div>
            <p class="muted" id="reportStoryTitle">Select whether this news looks real or needs checking.</p>
            <input type="hidden" id="reportArticleId">
            <div class="report-options">
              <label><input type="radio" name="reportStatus" value="real" required><span>Looks real</span></label>
              <label><input type="radio" name="reportStatus" value="questionable"><span>Needs fact-check</span></label>
              <label><input type="radio" name="reportStatus" value="false"><span>Looks false</span></label>
            </div>
            <label class="report-note">Reason or correction source
              <textarea id="reportNote" placeholder="Write why you are reporting this story"></textarea>
            </label>
            <div class="report-actions">
              <button class="btn" type="submit">Submit Report</button>
              <button class="btn secondary" type="button" id="reportCancel">Cancel</button>
            </div>
          </form>
        </section>
      </div>
    `);
    $("#commandOpen").addEventListener("click", openCommandPalette);
    $("#commandClose").addEventListener("click", closeCommandPalette);
    $("#commandBackdrop").addEventListener("click", event => {
      if (event.target.id === "commandBackdrop") closeCommandPalette();
    });
    $("#commandInput").addEventListener("input", renderCommandResults);
    $("#reportClose").addEventListener("click", closeReportModal);
    $("#reportCancel").addEventListener("click", closeReportModal);
    $("#reportBackdrop").addEventListener("click", event => {
      if (event.target.id === "reportBackdrop") closeReportModal();
    });
    $("#reportForm").addEventListener("submit", submitReport);
    document.addEventListener("mousemove", event => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    }, { passive: true });
    renderCommandResults();
  }

  function openCommandPalette() {
    $("#commandBackdrop").hidden = false;
    document.body.classList.add("command-active");
    renderCommandResults();
    setTimeout(() => $("#commandInput").focus(), 20);
  }

  function closeCommandPalette() {
    $("#commandBackdrop").hidden = true;
    document.body.classList.remove("command-active");
  }

  function openReportModal(id) {
    const article = articles.find(item => item.id === id);
    if (!article) return;
    const report = state.reports[id] || {};
    $("#reportArticleId").value = id;
    $("#reportStoryTitle").textContent = article.headline;
    $("#reportNote").value = report.note || "";
    $$('input[name="reportStatus"]').forEach(input => {
      input.checked = input.value === report.status;
    });
    $("#reportBackdrop").hidden = false;
    setTimeout(() => {
      const checked = $('input[name="reportStatus"]:checked');
      (checked || $('input[name="reportStatus"]')).focus();
    }, 20);
  }

  function closeReportModal() {
    $("#reportBackdrop").hidden = true;
    $("#reportForm").reset();
  }

  function submitReport(event) {
    event.preventDefault();
    const id = $("#reportArticleId").value;
    const status = $('input[name="reportStatus"]:checked')?.value;
    if (!id || !status) {
      toast("Choose a report option");
      return;
    }
    state.reports[id] = {
      status,
      note: $("#reportNote").value.trim(),
      reportedAt: new Date().toISOString(),
    };
    saveObject("khabariReports", state.reports);
    refreshActions(id);
    closeReportModal();
    toast(status === "real" ? "Report saved: marked as real" : "Report saved for fact-check review");
  }

  function renderCommandResults() {
    const input = $("#commandInput");
    const query = (input ? input.value : "").trim().toLowerCase();
    const sectionResults = [
      ["Home", "index.html"], ["Breaking News", "breaking-news.html"], ["Latest News", "latest.html"],
      ["Trending", "trending.html"], ["Editor's Picks", "editors-picks.html"], ["Bookmarks", "bookmarks.html"]
    ].filter(([label]) => !query || label.toLowerCase().includes(query));
    const storyResults = articles.filter(article => {
      const haystack = `${article.headline} ${article.category} ${article.sourceName || ""}`.toLowerCase();
      return !query || haystack.includes(query);
    }).slice(0, 7);
    const categoryResults = categories.filter(category => !query || category.name.toLowerCase().includes(query));
    $("#commandResults").innerHTML = `
      ${sectionResults.map(([label, href]) => commandItem(label, "Section", href)).join("")}
      ${categoryResults.map(category => commandItem(category.name, "Category", `${category.slug}.html`)).join("")}
      ${storyResults.map(article => commandItem(article.headline, `${article.category} - ${article.sourceName || "Source"}`, `article.html?id=${article.id}`)).join("")}
      ${sectionResults.length + categoryResults.length + storyResults.length ? "" : `<div class="command-empty">No result found. Try another keyword.</div>`}
    `;
  }

  function commandItem(title, meta, href) {
    return `<a class="command-item" href="${href}"><strong>${escapeHTML(title)}</strong><span>${escapeHTML(meta)}</span></a>`;
  }

  function updateClock() {
    const now = new Date();
    $("#liveClock").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    $("#currentDate").textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  function initTicker() {
    const breaking = articles.filter(a => a.breaking);
    const show = () => {
      const article = breaking[state.tickerIndex % breaking.length];
      const ticker = $("#breakingTicker");
      ticker.style.animation = "none";
      ticker.offsetHeight;
      ticker.style.animation = "";
      ticker.innerHTML = `<a href="article.html?id=${article.id}">${escapeHTML(article.headline)}</a>`;
    };
    $("#tickerPrev").addEventListener("click", () => { state.tickerIndex = (state.tickerIndex - 1 + breaking.length) % breaking.length; show(); });
    $("#tickerNext").addEventListener("click", () => { state.tickerIndex = (state.tickerIndex + 1) % breaking.length; show(); });
    setInterval(() => { state.tickerIndex = (state.tickerIndex + 1) % breaking.length; show(); }, 5200);
    show();
  }

  function initScrollTools() {
    const scrollTop = $("#scrollTop");
    const progress = $("#readingProgress");
    window.addEventListener("scroll", () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      progress.style.width = `${pct}%`;
      scrollTop.classList.toggle("visible", doc.scrollTop > 420);
    }, { passive: true });
    scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initShortcuts() {
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !$("#commandBackdrop").hidden) {
        closeCommandPalette();
        return;
      }
      if (event.key === "Escape" && !$("#reportBackdrop").hidden) {
        closeReportModal();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommandPalette();
        return;
      }
      if (event.target.matches("input, textarea, select")) return;
      if (event.key === "/") {
        event.preventDefault();
        location.href = "search.html";
      }
      if (event.key.toLowerCase() === "d") $("#themeToggle").click();
      if (event.key.toLowerCase() === "t") window.scrollTo({ top: 0, behavior: "smooth" });
      if (event.key.toLowerCase() === "b" && document.body.dataset.page === "article") {
        const article = currentArticle();
        if (article) toggleBookmark(article.id);
      }
    });
  }

  function card(article, compact = false) {
    const liked = state.likes.has(article.id);
    const bookmarked = state.bookmarks.has(article.id);
    const reported = Boolean(state.reports[article.id]);
    return `<article class="news-card" data-category="${article.categorySlug}">
      <a class="media" href="article.html?id=${article.id}" aria-label="Read ${escapeHTML(article.headline)}">
        <img src="${article.image}" alt="${escapeHTML(article.headline)}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback()}'">
      </a>
      <div class="content">
        <span class="category-pill">${escapeHTML(article.category)}</span>
        <h3><a href="article.html?id=${article.id}">${escapeHTML(article.headline)}</a></h3>
        ${compact ? "" : `<p>${escapeHTML(article.subtitle)}</p>`}
        <div class="meta"><span>${escapeHTML(article.author)}</span><span>${article.date}</span><span>${article.readingTime} min read</span></div>
        ${sourceLink(article)}
        <div class="card-actions">
          <a class="btn secondary" href="article.html?id=${article.id}">Read More</a>
          <button class="round-action js-like ${liked ? "active" : ""}" data-id="${article.id}" aria-label="Like article">♡</button>
          <button class="round-action js-bookmark ${bookmarked ? "active" : ""}" data-id="${article.id}" aria-label="Bookmark article">☆</button>
          <button class="round-action js-share" data-id="${article.id}" aria-label="Share article">↗</button>
          <button class="round-action report-action js-report ${reported ? "active" : ""}" data-id="${article.id}" aria-label="Report whether this news is real">!</button>
        </div>
      </div>
    </article>`;
  }

  function bindArticleButtons(root = document) {
    $$(".js-like", root).forEach(button => button.addEventListener("click", () => toggleLike(button.dataset.id)));
    $$(".js-bookmark", root).forEach(button => button.addEventListener("click", () => toggleBookmark(button.dataset.id)));
    $$(".js-share", root).forEach(button => button.addEventListener("click", () => shareArticle(button.dataset.id)));
    $$(".js-report", root).forEach(button => button.addEventListener("click", () => openReportModal(button.dataset.id)));
  }

  function toggleLike(id) {
    state.likes.has(id) ? state.likes.delete(id) : state.likes.add(id);
    saveSet("khabariLikes", state.likes);
    refreshActions(id);
    toast(state.likes.has(id) ? "Article liked" : "Like removed");
  }

  function toggleBookmark(id) {
    state.bookmarks.has(id) ? state.bookmarks.delete(id) : state.bookmarks.add(id);
    saveSet("khabariBookmarks", state.bookmarks);
    refreshActions(id);
    updateBookmarkCount();
    toast(state.bookmarks.has(id) ? "Saved to bookmarks" : "Removed from bookmarks");
    if (document.body.dataset.page === "bookmarks") renderBookmarks();
  }

  function refreshActions(id) {
    $$(`[data-id="${id}"].js-like`).forEach(btn => btn.classList.toggle("active", state.likes.has(id)));
    $$(`[data-id="${id}"].js-bookmark`).forEach(btn => btn.classList.toggle("active", state.bookmarks.has(id)));
    $$(`[data-id="${id}"].js-report`).forEach(btn => btn.classList.toggle("active", Boolean(state.reports[id])));
  }

  function updateBookmarkCount() {
    $("#bookmarkCount").textContent = state.bookmarks.size;
  }

  async function shareArticle(id) {
    const article = articles.find(a => a.id === id);
    const url = new URL(`article.html?id=${id}`, location.href).href;
    const text = `${article.headline} - Khabari`;
    if (navigator.share) {
      try { await navigator.share({ title: article.headline, text, url }); toast("Share sheet opened"); return; }
      catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Article link copied");
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      toast("Article link copied");
    }
  }

  function renderHome() {
    const featured = articles.filter(a => a.featured);
    const latest = articles.slice(0, 9);
    const trending = articles.filter(a => a.trending).slice(0, 6);
    const editors = articles.filter(a => a.editorsPick).slice(0, 6);
    const mostRead = articles.slice().sort((a, b) => b.views - a.views).slice(0, 6);
    app.innerHTML = `
      <section class="hero" id="heroCarousel">
        <img src="${featured[0].image}" alt="${escapeHTML(featured[0].headline)}" onerror="this.onerror=null;this.src='${imageFallback()}'">
        <div class="hero-content">
          <span class="eyebrow">3D Real-News Lead</span>
          <h1>${escapeHTML(featured[0].headline)}</h1>
          <p>${escapeHTML(featured[0].subtitle)}</p>
          ${sourceLink(featured[0], "source-link hero-source")}
          <div class="hero-actions"><a class="btn" href="article.html?id=${featured[0].id}">Read Lead Story</a><button class="btn secondary" id="nextHero">Next Story</button></div>
        </div>
      </section>
      ${premiumBriefingBlock()}
      <section class="section">${sectionHeader("Latest News", "Fresh reporting from every desk", "latest.html")}<div class="grid">${latest.map(a => card(a)).join("")}</div></section>
      <section class="section">
        <div class="feature-panel">
          <img src="${featured[1].image}" alt="${escapeHTML(featured[1].headline)}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback()}'">
          <div class="feature-copy">
            <span class="eyebrow">Source-Linked Brief</span>
            <h2>${escapeHTML(featured[1].headline)}</h2>
            <p>${escapeHTML(featured[1].subtitle)}</p>
            <div class="meta"><span>${featured[1].author}</span><span>${featured[1].readingTime} min read</span><span>${formatNumber(featured[1].views)} views</span></div>
            <p>${escapeHTML(featured[1].content[1])}</p>
            <div class="hero-actions"><a class="btn" href="article.html?id=${featured[1].id}">Read Feature</a>${sourceLink(featured[1])}</div>
          </div>
        </div>
      </section>
      <section class="section">${sectionHeader("Trending News", "Stories readers are opening and sharing", "trending.html")}<div class="grid two">${trending.map(a => card(a, true)).join("")}</div></section>
      <section class="section">${sectionHeader("Popular Categories", "Jump into your preferred desk", "")}<div class="grid four">${categories.map(categoryTile).join("")}</div></section>
      <section class="section">${sectionHeader("Editor's Picks", "Selected by the Khabari newsroom", "editors-picks.html")}<div class="grid">${editors.map(a => card(a)).join("")}</div></section>
      ${adBanner()}
      <section class="section">${sectionHeader("Most Read", "High-interest stories across the portal", "")}<div class="grid two">${mostRead.map(a => card(a, true)).join("")}</div></section>
      ${videoBlock()}
      ${newsletterBlock()}
    `;
    $("#nextHero").addEventListener("click", () => rotateHero(featured));
    setInterval(() => rotateHero(featured), 7000);
    bindHomeInteractions();
    bindArticleButtons(app);
    enhanceCurrentView(app);
  }

  function premiumBriefingBlock() {
    const topSource = articles.reduce((acc, article) => {
      acc[article.sourceName] = (acc[article.sourceName] || 0) + 1;
      return acc;
    }, {});
    const sourceText = Object.entries(topSource).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name).join(", ");
    return `<section class="section premium-briefing">
      <div class="brief-card lead">
        <span class="eyebrow">Live Desk</span>
        <h2>Interactive newsroom dashboard</h2>
        <p>Filter real-source briefs instantly, jump to stories, and keep your reading list moving.</p>
        <div class="brief-actions" id="deskFilters">
          <button class="chip active" data-category="">All</button>
          ${categories.slice(0, 6).map(category => `<button class="chip" data-category="${category.name}">${category.name}</button>`).join("")}
        </div>
      </div>
      <div class="brief-card stat"><strong>${articles.length}</strong><span>real-source briefs</span></div>
      <div class="brief-card stat"><strong>${categories.length}</strong><span>desks online</span></div>
      <div class="brief-card stat"><strong>${state.bookmarks.size}</strong><span>saved stories</span></div>
      <div class="brief-card sources"><strong>Top sources</strong><span>${escapeHTML(sourceText)}</span><button class="btn secondary" id="surpriseStory">Surprise Me</button></div>
      <div class="quick-desk" id="quickDeskGrid"></div>
    </section>`;
  }

  function bindHomeInteractions() {
    const grid = $("#quickDeskGrid");
    const renderDesk = category => {
      const list = (category ? articles.filter(article => article.category === category) : articles).slice(0, 4);
      grid.innerHTML = list.map(article => `<a class="desk-item" href="article.html?id=${article.id}">
        <img src="${article.image}" alt="${escapeHTML(article.headline)}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback()}'">
        <span>${escapeHTML(article.category)}</span>
        <strong>${escapeHTML(article.headline)}</strong>
      </a>`).join("");
      enhanceCurrentView(grid);
    };
    $$("#deskFilters .chip").forEach(button => button.addEventListener("click", () => {
      $$("#deskFilters .chip").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderDesk(button.dataset.category);
    }));
    $("#surpriseStory").addEventListener("click", () => {
      const article = articles[Math.floor(Math.random() * articles.length)];
      location.href = `article.html?id=${article.id}`;
    });
    renderDesk("");
  }

  function rotateHero(featured) {
    state.heroIndex = (state.heroIndex + 1) % featured.length;
    const article = featured[state.heroIndex];
    const hero = $("#heroCarousel");
    hero.querySelector("img").src = article.image;
    hero.querySelector("img").alt = article.headline;
    hero.querySelector("h1").textContent = article.headline;
    hero.querySelector("p").textContent = article.subtitle;
    hero.querySelector("a.btn").href = `article.html?id=${article.id}`;
    const source = hero.querySelector(".hero-source");
    if (source) {
      source.href = article.sourceUrl || "#";
      source.textContent = `Source: ${article.sourceName || "Original source"}`;
    }
  }

  function sectionHeader(title, subtitle, href) {
    return `<div class="section-header"><div><h2>${title}</h2><p>${subtitle}</p></div>${href ? `<a class="btn secondary" href="${href}">View All</a>` : ""}</div>`;
  }

  function categoryTile(category) {
    return `<a class="category-tile" href="${category.slug}.html"><img src="${category.image}" alt="${category.name} category" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback()}'"><h3>${category.name}</h3></a>`;
  }

  function adBanner() {
    return `<section class="section ad-banner"><div class="ad-copy"><span class="eyebrow">Sponsored</span><h2>Build better public conversations with verified local reporting.</h2><p class="muted">Partner message for media literacy programs, universities, and civic groups.</p></div><img src="assets/images/ad-banner.svg" alt="Reader-supported journalism banner" loading="lazy"></section>`;
  }

  function videoBlock() {
    return `<section class="section">${sectionHeader("Video Briefing", "Animated newsroom updates embedded in the portal", "")}<div class="grid two"><div class="video-panel"><iframe title="Khabari video briefing" src="assets/videos/briefing-panel.html"></iframe></div><div class="video-panel"><iframe title="Khabari market and science briefing" src="assets/videos/briefing-panel.html"></iframe></div></div></section>`;
  }

  function newsletterBlock() {
    return `<section class="section newsletter"><div><h2>Morning Briefing</h2><p class="muted">Get a sharp digest of public affairs, technology, business, culture, health, and sport.</p></div><form class="newsletter-form" id="newsletterForm"><input type="email" id="newsletterEmail" placeholder="you@example.com" aria-label="Email address"><button class="btn" type="submit">Subscribe</button></form></section>`;
  }

  function renderListing() {
    const key = document.body.dataset.key;
    let list = articles;
    let title = document.title.replace(" | Khabari", "");
    let subtitle = "Browse complete Khabari reporting with category filters, bookmarks, likes, and sharing.";
    if (document.body.dataset.page === "category") {
      list = articles.filter(a => a.category === key);
      subtitle = `Top ${key.toLowerCase()} stories selected from the Khabari news desk.`;
    } else if (key === "breaking") {
      list = articles.filter(a => a.breaking);
      subtitle = "Fast-moving updates and high-priority developments.";
    } else if (key === "trending") {
      list = articles.filter(a => a.trending);
      subtitle = "Stories with strong reader interest across the portal.";
    } else if (key === "editors") {
      list = articles.filter(a => a.editorsPick);
      subtitle = "Smart reads selected by Khabari editors.";
    }
    state.visibleCount = 12;
    state.currentList = list;
    app.innerHTML = `<section class="page-title"><span class="eyebrow">${title}</span><h1>${title}</h1><p>${subtitle}</p></section>${filterControls()}<section class="section"><div class="grid" id="articleGrid"></div><div class="section-header"><span></span><button class="btn secondary" id="loadMore">Load More</button></div></section>`;
    bindFilters();
    renderCurrentList();
  }

  function filterControls() {
    return `<section class="search-panel"><div class="filter-row"><input id="filterInput" type="search" placeholder="Filter by keyword, source, author, or headline" aria-label="Filter articles"><select id="categoryFilter" aria-label="Category filter"><option value="">All categories</option>${categories.map(c => `<option value="${c.name}">${c.name}</option>`).join("")}</select><button class="btn secondary" id="clearFilters">Clear</button></div></section>`;
  }

  function bindFilters() {
    $("#filterInput").addEventListener("input", applyFilters);
    $("#categoryFilter").addEventListener("change", applyFilters);
    $("#clearFilters").addEventListener("click", () => { $("#filterInput").value = ""; $("#categoryFilter").value = ""; applyFilters(); });
    $("#loadMore").addEventListener("click", () => { state.visibleCount += 9; renderCurrentList(); });
  }

  function applyFilters() {
    const keyword = $("#filterInput").value.trim().toLowerCase();
    const category = $("#categoryFilter").value;
    const original = document.body.dataset.page === "category" ? articles.filter(a => a.category === document.body.dataset.key) : listingBase();
    state.currentList = original.filter(article => {
      const haystack = `${article.headline} ${article.subtitle} ${article.author} ${article.category} ${article.sourceName || ""} ${(article.tags || []).join(" ")}`.toLowerCase();
      return (!keyword || haystack.includes(keyword)) && (!category || article.category === category);
    });
    state.visibleCount = 12;
    renderCurrentList();
  }

  function listingBase() {
    const key = document.body.dataset.key;
    if (key === "breaking") return articles.filter(a => a.breaking);
    if (key === "trending") return articles.filter(a => a.trending);
    if (key === "editors") return articles.filter(a => a.editorsPick);
    return articles;
  }

  function renderCurrentList() {
    const grid = $("#articleGrid");
    const list = state.currentList.slice(0, state.visibleCount);
    grid.innerHTML = list.length ? list.map(a => card(a)).join("") : `<div class="empty-state">No articles match this filter.</div>`;
    $("#loadMore").style.display = state.currentList.length > state.visibleCount ? "inline-flex" : "none";
    bindArticleButtons(grid);
    enhanceCurrentView(grid);
  }

  function renderSearch() {
    const params = new URLSearchParams(location.search);
    app.innerHTML = `<section class="page-title"><span class="eyebrow">Search</span><h1>Search Khabari</h1><p>Find articles by title, category, author, topic, or tag.</p></section>${filterControls()}<section class="section"><div class="grid" id="articleGrid"></div><div class="section-header"><span></span><button class="btn secondary" id="loadMore">Load More</button></div></section>`;
    state.currentList = articles;
    bindFilters();
    $("#filterInput").value = params.get("q") || "";
    applyFilters();
    setTimeout(() => $("#filterInput").focus(), 250);
  }

  function renderBookmarks() {
    const saved = articles.filter(a => state.bookmarks.has(a.id));
    app.innerHTML = `<section class="page-title"><span class="eyebrow">Bookmarks</span><h1>Your Saved Stories</h1><p>Bookmarks are stored in this browser with local storage.</p></section><section class="section"><div class="grid" id="articleGrid">${saved.length ? saved.map(a => card(a)).join("") : `<div class="empty-state">No saved stories yet. Use the star button on any article to build your reading list.</div>`}</div></section>`;
    bindArticleButtons(app);
    enhanceCurrentView(app);
  }

  function currentArticle() {
    const params = new URLSearchParams(location.search);
    return articles.find(a => a.id === params.get("id")) || articles[0];
  }

  function renderArticle() {
    const article = currentArticle();
    const related = articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);
    const likeCount = article.likes + (state.likes.has(article.id) ? 1 : 0);
    app.innerHTML = `<article class="article-detail">
      <img class="article-hero-image" src="${article.image}" alt="${escapeHTML(article.headline)}" onerror="this.onerror=null;this.src='${imageFallback()}'">
      <span class="category-pill">${article.category}</span>
      <h1>${escapeHTML(article.headline)}</h1>
      <p class="muted">${escapeHTML(article.subtitle)}</p>
      <div class="meta"><span>By ${escapeHTML(article.author)}</span><span>${article.date}</span><span>${article.readingTime} min read</span><span>${formatNumber(article.views)} views</span><span>${formatNumber(likeCount)} likes</span></div>
      <div class="source-box"><strong>Real-news source</strong>${sourceLink(article)}<span>${escapeHTML(article.imageCredit || "Image credit available at source.")}</span></div>
      <div class="article-actions">
        <button class="btn secondary js-like ${state.likes.has(article.id) ? "active" : ""}" data-id="${article.id}">♡ Like</button>
        <button class="btn secondary js-bookmark ${state.bookmarks.has(article.id) ? "active" : ""}" data-id="${article.id}">☆ Bookmark</button>
        <button class="btn secondary js-share" data-id="${article.id}">↗ Share</button>
        <button class="btn secondary report-action js-report ${state.reports[article.id] ? "active" : ""}" data-id="${article.id}">! Report Real/Fake</button>
      </div>
      <ul class="takeaways"><li>Public impact is the central measure to watch.</li><li>Execution quality will decide whether early gains continue.</li><li>Readers should track timelines, budgets, and independent reviews.</li></ul>
      <div class="article-body collapsed" id="articleBody">${article.content.map(p => `<p>${escapeHTML(p)}</p>`).join("")}</div>
      <button class="btn secondary" id="expandArticle">Expand Article</button>
    </article>
    ${article.video ? videoBlock() : ""}
    <section class="section">${sectionHeader("Related Articles", `More from ${article.category}`, "")}<div class="grid">${related.map(a => card(a)).join("")}</div></section>`;
    $("#expandArticle").addEventListener("click", () => {
      const body = $("#articleBody");
      body.classList.toggle("collapsed");
      $("#expandArticle").textContent = body.classList.contains("collapsed") ? "Expand Article" : "Collapse Article";
    });
    bindArticleButtons(app);
    enhanceCurrentView(app);
  }

  function enhanceCurrentView(root = document) {
    $$(".news-card, .category-tile, .desk-item, .brief-card", root).forEach(card => {
      if (card.dataset.enhanced === "true") return;
      card.dataset.enhanced = "true";
      card.addEventListener("mousemove", event => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - .5) * -10;
        card.style.setProperty("--tilt-x", `${y.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${x.toFixed(2)}deg`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  function renderStatic() {
    const key = document.body.dataset.key;
    if (key === "about") {
      app.innerHTML = `<section class="page-title"><span class="eyebrow">About</span><h1>About Khabari</h1><p>A polished static news portal built with HTML5, CSS3, and vanilla JavaScript.</p></section><section class="feature-panel"><img src="assets/images/newsroom.svg" alt="Khabari newsroom" loading="lazy"><div class="feature-copy"><h2>3D design, real sources, original summaries.</h2><p>Khabari is designed as a complete college and portfolio project: multi-page navigation, article rendering, local storage features, rich media, responsive design, and a newsroom-style interface.</p><p>The article briefs are rewritten in Khabari's own words and include source links so readers can verify the underlying real-world reports or official announcements.</p></div></section>`;
    } else if (key === "contact") {
      app.innerHTML = `<section class="page-title"><span class="eyebrow">Contact</span><h1>Contact Khabari</h1><p>Send story tips, corrections, partnership notes, or reader feedback.</p></section><section class="static-panel"><form id="contactForm"><div class="contact-grid"><div class="form-row"><label>Name<input required name="name" placeholder="Your name"></label></div><div class="form-row"><label>Email<input required type="email" name="email" placeholder="you@example.com"></label></div></div><div class="form-row"><label>Topic<select name="topic"><option>Story tip</option><option>Correction</option><option>Partnership</option><option>Reader feedback</option></select></label></div><div class="form-row"><label>Message<textarea required name="message" placeholder="Write your message"></textarea></label></div><button class="btn" type="submit">Send Message</button></form></section>`;
      setTimeout(() => $("#contactForm").addEventListener("submit", event => { event.preventDefault(); event.target.reset(); toast("Message prepared for the newsroom"); }), 0);
    } else if (key === "faq") {
      app.innerHTML = `<section class="page-title"><span class="eyebrow">FAQ</span><h1>Frequently Asked Questions</h1><p>Quick answers about using the Khabari website.</p></section><section class="faq-list"><details open><summary>Does Khabari work from index.html?</summary><p>Yes. The project is static and runs directly in a browser with included HTML, CSS, JavaScript, SVG images, and embedded media panels.</p></details><details><summary>Where are bookmarks stored?</summary><p>Bookmarks and likes are stored in local storage on the current browser.</p></details><details><summary>Can I search all articles?</summary><p>Yes. The search page filters every included article by headline, author, category, and supporting text.</p></details><details><summary>Is the site responsive?</summary><p>Yes. Navigation, cards, article pages, and forms adapt for mobile, tablet, and desktop screens.</p></details></section>`;
    } else if (key === "privacy") {
      app.innerHTML = `<section class="page-title"><span class="eyebrow">Privacy Policy</span><h1>Privacy Policy</h1><p>Effective June 30, 2026.</p></section><section class="static-panel"><h2>Data stored on your device</h2><p>Khabari saves theme preference, liked stories, and bookmarked articles in browser local storage. This static site does not send that information to a server.</p><h2>Forms and newsletter</h2><p>Contact and newsletter forms validate entries in the browser and show confirmation notifications for demonstration purposes.</p><h2>External links</h2><p>Source buttons, image services, and footer social links may open external websites. Those services apply their own privacy practices.</p><h2>Editorial content</h2><p>Articles are original Khabari summaries based on real-world source links. They are not copied from publisher articles.</p></section>`;
    } else {
      app.innerHTML = `<section class="page-title"><span class="eyebrow">404</span><h1>Page Not Found</h1><p>The page address does not match an available Khabari route.</p></section><section class="static-panel"><h2>Return to the newsroom</h2><p>Use the button below to go back to the home page or search the archive.</p><div class="hero-actions"><a class="btn" href="index.html">Go Home</a><a class="btn secondary" href="search.html">Search Articles</a></div></section>`;
    }
    enhanceCurrentView(app);
  }

  function initNewsletter() {
    document.addEventListener("submit", event => {
      if (event.target.id !== "newsletterForm") return;
      event.preventDefault();
      const email = $("#newsletterEmail").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("Enter a valid email address");
        return;
      }
      localStorage.setItem("khabariNewsletter", email);
      event.target.reset();
      toast("Newsletter subscription saved");
    });
  }

  function boot() {
    initChrome();
    initNewsletter();
    const page = document.body.dataset.page;
    if (page === "home") renderHome();
    else if (page === "listing" || page === "category") renderListing();
    else if (page === "search") renderSearch();
    else if (page === "bookmarks") renderBookmarks();
    else if (page === "article") renderArticle();
    else renderStatic();
  }

  boot();
})();
