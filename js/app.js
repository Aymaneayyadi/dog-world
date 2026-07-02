(function() {
  'use strict';

  let currentFile = null;
  let isConverting = false;
  let isDark = localStorage.getItem('cm-dark') === 'true';

  function init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    loadLibraries().then(() => {
      setupNavigation();
      setupSearch();
      setupDarkMode();
      setupMobileMenu();
      setupSmoothScroll();
      routePage();
      window.addEventListener('hashchange', routePage);
    });
  }

  async function loadLibraries() {
    const libs = [];
    if (!window.pdfjsLib) {
      libs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'));
    }
    if (!window.PDFLib) {
      libs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'));
    }
    if (!window.JSZip) {
      libs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'));
    }
    if (!window.XLSX) {
      libs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'));
    }
    await Promise.allSettled(libs);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  function setupNavigation() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[data-nav]');
      if (!link) return;
      e.preventDefault();
      const hash = link.getAttribute('href');
      window.location.hash = hash;
    });
  }

  function setupSearch() {
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');
    if (!searchInput) return;
    searchInput.addEventListener('input', function() {
      const q = this.value.toLowerCase().trim();
      if (!q || q.length < 2) { searchResults.innerHTML = ''; searchResults.classList.remove('active'); return; }
      const results = toolsData.tools.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
      if (results.length === 0) { searchResults.innerHTML = '<div class="search-result-empty">Aucun outil trouvé</div>'; searchResults.classList.add('active'); return; }
      searchResults.innerHTML = results.slice(0, 8).map(t =>
        `<a href="#${t.slug}" class="search-result-item" onclick="document.getElementById('global-search').value='';document.getElementById('search-results').classList.remove('active')">
          <span class="material-icons" style="color:${t.color}">${t.icon}</span>
          <div><strong>${t.name}</strong><small>${t.desc}</small></div>
        </a>`
      ).join('');
      searchResults.classList.add('active');
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-container')) searchResults.classList.remove('active');
    });
  }

  function setupDarkMode() {
    const toggle = document.getElementById('dark-toggle');
    if (!toggle) return;
    if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    toggle.addEventListener('click', function() {
      isDark = !isDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
      localStorage.setItem('cm-dark', isDark);
      toggle.innerHTML = isDark ? 'light_mode' : 'dark_mode';
    });
  }

  function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function() {
      menu.classList.toggle('active');
      btn.textContent = menu.classList.contains('active') ? 'close' : 'menu';
    });
  }

  function setupSmoothScroll() {
    document.addEventListener('click', function(e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }

  function routePage() {
    const hash = window.location.hash.slice(1) || '';
    const main = document.getElementById('main-content');
    if (!main) return;
    if (!hash) {
      renderHome(main);
      updateMeta('ConvertMaster - Convertisseur de fichiers en ligne gratuit', 'Convertissez vos fichiers PDF, images, audio, vidéo et documents gratuitement. Conversion 100% dans votre navigateur, aucune donnée envoyée sur un serveur.');
      return;
    }
    const tool = toolsData.tools.find(t => t.slug === hash);
    if (tool) {
      renderToolPage(main, tool);
      updateMeta(tool.metaTitle, tool.metaDesc);
    } else if (hash === 'faq') {
      renderFaq(main);
      updateMeta('FAQ - ConvertMaster', 'Questions fréquentes sur ConvertMaster');
    } else {
      renderHome(main);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateMeta(title, desc) {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = desc;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = title;
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = desc;
  }

  function renderHome(main) {
    main.innerHTML = `
      <section class="hero-section">
        <div class="hero-bg"></div>
        <div class="container">
          <div class="hero-content">
            <h1>Convertissez vos fichiers<br><span class="gradient-text">gratuitement et en toute sécurité</span></h1>
            <p>Convertissez PDF, images, audio, vidéo et documents. 100% dans votre navigateur, aucune donnée envoyée sur nos serveurs.</p>
            <div class="search-container">
              <span class="material-icons search-icon">search</span>
              <input type="text" id="global-search" placeholder="Rechercher un outil (PDF vers Word, JPG en PNG...)" autocomplete="off">
              <div id="search-results" class="search-results"></div>
            </div>
            <div class="hero-stats">
              <div class="hero-stat"><span class="hero-stat-num">${toolsData.tools.length}+</span><span>Outils</span></div>
              <div class="hero-stat"><span class="hero-stat-num">100%</span><span>Gratuit</span></div>
              <div class="hero-stat"><span class="hero-stat-num">0</span><span>Fichier stocké</span></div>
            </div>
          </div>
        </div>
      </section>
      <div id="tools-section" class="container">
        <div class="category-tabs" id="category-tabs"></div>
        <div class="tools-grid" id="tools-grid"></div>
      </div>
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Pourquoi choisir ConvertMaster ?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <span class="material-icons feature-icon">security</span>
              <h3>100% Sécurisé</h3>
              <p>Les conversions sont faites dans votre navigateur. Vos fichiers ne quittent jamais votre appareil.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons feature-icon">speed</span>
              <h3>Rapide et Efficace</h3>
              <p>Conversion instantanée grâce à la puissance de votre navigateur. Pas de file d'attente.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons feature-icon">devices</span>
              <h3>Accessible Partout</h3>
              <p>Fonctionne sur tous les appareils : PC, tablette et smartphone. Aucune installation requise.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons feature-icon">money_off</span>
              <h3>Entièrement Gratuit</h3>
              <p>Tous nos outils sont gratuits, sans limite de taille ni de nombre de conversions.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="categories-section" id="categories">
        <div class="container">
          <h2 class="section-title">Tous nos outils de conversion</h2>
          <div class="categories-grid" id="categories-grid"></div>
        </div>
      </section>
    `;
    renderCategoryTabs('all');
    renderTools('all');
    renderCategoryCards();
  }

  function renderCategoryTabs(active) {
    const container = document.getElementById('category-tabs');
    if (!container) return;
    const cats = [{ id: 'all', name: 'Tous', icon: 'apps', color: '#666' }, ...toolsData.categories];
    container.innerHTML = cats.map(c =>
      `<button class="category-tab ${active === c.id ? 'active' : ''}" data-cat="${c.id}" style="${active === c.id ? `--tab-color:${c.color}` : ''}">
        <span class="material-icons">${c.icon}</span> ${c.name}
      </button>`
    ).join('');
    container.querySelectorAll('.category-tab').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('.category-tab').forEach(b => { b.classList.remove('active'); b.style.removeProperty('--tab-color'); });
        this.classList.add('active');
        this.style.setProperty('--tab-color', this.dataset.cat === 'all' ? '#666' : toolsData.categories.find(c => c.id === this.dataset.cat)?.color || '#666');
        renderTools(this.dataset.cat);
      });
    });
  }

  function renderTools(category) {
    const grid = document.getElementById('tools-grid');
    if (!grid) return;
    let tools = category === 'all' ? toolsData.tools : toolsData.tools.filter(t => t.category === category);
    if (tools.length === 0) { grid.innerHTML = '<div class="no-tools">Aucun outil trouvé dans cette catégorie</div>'; return; }
    grid.innerHTML = tools.map(t =>
      `<a href="#${t.slug}" class="tool-card" data-nav style="--card-color:${t.color}">
        <div class="tool-card-icon"><span class="material-icons">${t.icon}</span></div>
        <div class="tool-card-info">
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
        </div>
        <span class="material-icons tool-card-arrow">arrow_forward</span>
      </a>`
    ).join('');
  }

  function renderCategoryCards() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    grid.innerHTML = toolsData.categories.map(cat => {
      const count = toolsData.tools.filter(t => t.category === cat.id).length;
      const catTools = toolsData.tools.filter(t => t.category === cat.id).slice(0, 4);
      return `
        <div class="category-card" style="--cat-color:${cat.color}">
          <div class="category-card-header">
            <span class="material-icons category-card-icon">${cat.icon}</span>
            <h3>${cat.name}</h3>
            <span class="category-count">${count} outils</span>
          </div>
          <div class="category-card-tools">
            ${catTools.map(t => `<a href="#${t.slug}" data-nav>${t.name}</a>`).join('')}
            ${count > 4 ? `<a href="#${cat.id}" class="see-all" data-nav onclick="document.querySelector('[data-cat=\\'${cat.id}\\']')?.click();document.getElementById('tools-section').scrollIntoView({behavior:'smooth'})">Voir tout →</a>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  function renderToolPage(main, tool) {
    const cat = toolsData.categories.find(c => c.id === tool.category);
    main.innerHTML = `
      <div class="tool-page">
        <div class="tool-header">
          <div class="container">
            <div class="tool-breadcrumbs">
              <a href="#" onclick="window.location.hash='';return false">Accueil</a>
              <span class="material-icons">chevron_right</span>
              <span>${tool.name}</span>
            </div>
            <div class="tool-header-content">
              <div class="tool-header-icon" style="background:${tool.color}20;color:${tool.color}">
                <span class="material-icons">${tool.icon}</span>
              </div>
              <div>
                <h1>${tool.name}</h1>
                <p>${tool.desc}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="converter-card">
            <div class="converter-dropzone" id="dropzone">
              <input type="file" id="file-input" accept="${getAcceptAttr(tool)}" hidden ${tool.slug === 'merge-pdf' ? 'multiple' : ''}>
              <span class="material-icons dropzone-icon">cloud_upload</span>
              <h3>Déposez votre fichier ici</h3>
              <p>ou</p>
              <button class="btn btn-primary" id="choose-btn">Choisir un fichier</button>
              <p class="dropzone-hint">Taille max : ${tool.slug === 'merge-pdf' ? 'Plusieurs fichiers' : '100 Mo'}</p>
            </div>
            ${tool.slug === 'rotate-pdf' ? `
            <div class="converter-options" id="converter-options">
              <label>Angle de rotation :</label>
              <select id="rotate-angle">
                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>
              </select>
            </div>` : ''}
            ${tool.slug === 'unlock-pdf' ? `
            <div class="converter-options" id="converter-options">
              <label>Mot de passe :</label>
              <input type="password" id="unlock-password" placeholder="Entrez le mot de passe">
            </div>` : ''}
            ${tool.slug === 'protect-pdf' ? `
            <div class="converter-options" id="converter-options">
              <label>Mot de passe :</label>
              <input type="password" id="protect-password" placeholder="Créez un mot de passe">
            </div>` : ''}
            ${tool.slug === 'resize-image' ? `
            <div class="converter-options" id="converter-options">
              <div class="option-row"><label>Largeur (px) :</label><input type="number" id="resize-width" placeholder="Auto" min="1"></div>
              <div class="option-row"><label>Hauteur (px) :</label><input type="number" id="resize-height" placeholder="Auto" min="1"></div>
            </div>` : ''}
            ${tool.slug === 'crop-image' ? `
            <div class="converter-options" id="converter-options">
              <div class="option-row"><label>X :</label><input type="number" id="crop-x" value="0" min="0"></div>
              <div class="option-row"><label>Y :</label><input type="number" id="crop-y" value="0" min="0"></div>
              <div class="option-row"><label>Largeur :</label><input type="number" id="crop-width" placeholder="Auto" min="1"></div>
              <div class="option-row"><label>Hauteur :</label><input type="number" id="crop-height" placeholder="Auto" min="1"></div>
            </div>` : ''}
            <div class="file-info" id="file-info" style="display:none">
              <span class="material-icons">insert_drive_file</span>
              <div class="file-info-details">
                <span class="file-info-name" id="file-name"></span>
                <span class="file-info-size" id="file-size"></span>
              </div>
              <button class="btn btn-sm" id="remove-file"><span class="material-icons">close</span></button>
            </div>
            <div class="progress-bar-container" id="progress-container" style="display:none">
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
              </div>
              <span class="progress-text" id="progress-text">Conversion en cours...</span>
            </div>
            <button class="btn btn-primary btn-convert" id="convert-btn" disabled>
              <span class="material-icons">swap_horiz</span> Convertir en ${tool.outputExt || 'format choisi'}
            </button>
            <div class="download-section" id="download-section" style="display:none">
              <div class="download-success">
                <span class="material-icons">check_circle</span>
                <h3>Conversion terminée !</h3>
              </div>
              <button class="btn btn-success" id="download-btn">
                <span class="material-icons">download</span> Télécharger
              </button>
              <button class="btn btn-outline" id="convert-another">
                <span class="material-icons">refresh</span> Convertir un autre fichier
              </button>
            </div>
          </div>
          ${renderToolFaq(tool)}
        </div>
      </div>
    `;
    setupConverter(tool);
  }

  function getAcceptAttr(tool) {
    const map = {
      pdf: '.pdf', image: '.jpg,.jpeg,.png,.gif,.webp,.svg,.heic,.bmp,.tiff',
      audio: '.mp3,.wav,.aac,.flac,.ogg,.m4a,.wma',
      video: '.mp4,.avi,.mov,.webm,.mkv,.flv,.wmv,.m4v',
      document: '.pdf,.docx,.doc,.xlsx,.xls,.pptx,.txt,.csv,.json,.xml,.html,.htm,.epub'
    };
    if (tool.category === 'image') return map.image;
    if (tool.category === 'audio') return map.audio;
    if (tool.category === 'video') return map.video;
    if (tool.category === 'document') return map.document;
    return map.pdf;
  }

  function setupConverter(tool) {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const chooseBtn = document.getElementById('choose-btn');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeBtn = document.getElementById('remove-file');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const downloadSection = document.getElementById('download-section');
    const convertAnother = document.getElementById('convert-another');

    let resultBlob = null;
    let resultName = '';

    if (chooseBtn) chooseBtn.addEventListener('click', () => fileInput.click());

    if (fileInput) fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        if (tool.slug === 'merge-pdf') {
          currentFile = this.files[0];
          showFileInfo(this.files, tool);
        } else {
          currentFile = this.files[0];
          showFileInfo(this.files[0], tool);
        }
        convertBtn.disabled = false;
      }
    });

    if (dropzone) {
      dropzone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', function() { this.classList.remove('dragover'); });
      dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          currentFile = e.dataTransfer.files[0];
          showFileInfo(e.dataTransfer.files[0], tool);
          convertBtn.disabled = false;
        }
      });
    }

    if (removeBtn) removeBtn.addEventListener('click', function() {
      currentFile = null;
      fileInfo.style.display = 'none';
      convertBtn.disabled = true;
      downloadSection.style.display = 'none';
      progressContainer.style.display = 'none';
      dropzone.style.display = 'block';
    });

    if (convertBtn) convertBtn.addEventListener('click', async function() {
      if (!currentFile || isConverting) return;
      isConverting = true;
      convertBtn.disabled = true;
      convertBtn.innerHTML = '<span class="material-icons spinning">sync</span> Conversion...';
      progressContainer.style.display = 'block';
      downloadSection.style.display = 'none';
      progressFill.style.width = '0%';

      const options = {};
      if (tool.slug === 'rotate-pdf') {
        const angle = document.getElementById('rotate-angle');
        if (angle) options.angle = parseInt(angle.value);
      }
      if (tool.slug === 'unlock-pdf') {
        const pw = document.getElementById('unlock-password');
        if (pw) options.password = pw.value;
      }
      if (tool.slug === 'protect-pdf') {
        const pw = document.getElementById('protect-password');
        if (pw) options.password = pw.value;
      }
      if (tool.slug === 'resize-image') {
        const w = document.getElementById('resize-width');
        const h = document.getElementById('resize-height');
        if (w && w.value) options.width = parseInt(w.value);
        if (h && h.value) options.height = parseInt(h.value);
      }
      if (tool.slug === 'crop-image') {
        const x = document.getElementById('crop-x');
        const y = document.getElementById('crop-y');
        const w = document.getElementById('crop-width');
        const h = document.getElementById('crop-height');
        if (x) options.x = parseInt(x.value) || 0;
        if (y) options.y = parseInt(y.value) || 0;
        if (w) options.width = parseInt(w.value);
        if (h) options.height = parseInt(h.value);
      }

      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15, 90);
        progressFill.style.width = progress + '%';
        progressText.textContent = `Conversion en cours... ${Math.round(progress)}%`;
      }, 300);

      try {
        const result = await ConvertMaster.convert(tool.slug, currentFile, options);
        clearInterval(interval);
        progressFill.style.width = '100%';
        progressText.textContent = 'Conversion terminée !';
        resultBlob = result.blob;
        resultName = result.name;

        setTimeout(() => {
          progressContainer.style.display = 'none';
          downloadSection.style.display = 'block';
          convertBtn.style.display = 'none';
        }, 500);
      } catch (err) {
        clearInterval(interval);
        progressContainer.style.display = 'none';
        progressText.textContent = '';
        const errMsg = err.message || 'Erreur inconnue';
        dropzone.innerHTML = `
          <span class="material-icons dropzone-icon" style="color:var(--accent)">error</span>
          <h3>Erreur de conversion</h3>
          <p>${errMsg}</p>
          <p style="margin-top:12px;font-size:0.85rem;color:var(--text-muted)">Astuce : certains formats nécessitent des librairies spécifiques. Vérifiez que votre fichier est valide.</p>
          <button class="btn btn-primary" id="retry-btn" style="margin-top:16px;">Réessayer</button>
        `;
        dropzone.style.display = 'block';
        document.getElementById('retry-btn')?.addEventListener('click', () => {
          currentFile = null;
          location.reload();
        });
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<span class="material-icons">swap_horiz</span> Convertir en ' + (tool.outputExt || 'format choisi');
        isConverting = false;
      }
    });

    if (downloadBtn) downloadBtn.addEventListener('click', function() {
      if (!resultBlob) return;
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resultName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    });

    if (convertAnother) convertAnother.addEventListener('click', function() {
      currentFile = null;
      resultBlob = null;
      fileInfo.style.display = 'none';
      convertBtn.style.display = '';
      convertBtn.disabled = true;
      convertBtn.innerHTML = '<span class="material-icons">swap_horiz</span> Convertir en ' + (tool.outputExt || 'format choisi');
      downloadSection.style.display = 'none';
      progressContainer.style.display = 'none';
      dropzone.style.display = 'block';
      isConverting = false;
      if (fileInput) fileInput.value = '';
    });
  }

  function showFileInfo(file, tool) {
    const info = document.getElementById('file-info');
    const name = document.getElementById('file-name');
    const size = document.getElementById('file-size');
    const dropzone = document.getElementById('dropzone');
    if (!info || !name || !size) return;

    if (tool.slug === 'merge-pdf' && file && file.length !== undefined) {
      const files = Array.from(file);
      name.textContent = `${files.length} fichiers sélectionnés`;
      size.textContent = files.map(f => formatSize(f.size)).join(', ');
    } else {
      name.textContent = file.name;
      size.textContent = formatSize(file.size);
    }
    info.style.display = 'flex';
    if (dropzone) dropzone.style.display = 'none';
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
  }

  function renderToolFaq(tool) {
    return `
      <section class="tool-faq">
        <h2>Questions fréquentes sur ${tool.name}</h2>
        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-question">Comment convertir un fichier avec ${tool.name} ? <span class="material-icons">expand_more</span></div>
            <div class="faq-answer"><p>1. Cliquez sur "Choisir un fichier" ou déposez votre fichier dans la zone prévue.<br>2. Patientez pendant la conversion (elle est instantanée).<br>3. Téléchargez votre fichier converti.</p></div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Est-ce que mes fichiers sont sécurisés ? <span class="material-icons">expand_more</span></div>
            <div class="faq-answer"><p>Oui, la conversion est effectuée à 100% dans votre navigateur. Vos fichiers ne sont jamais envoyés sur internet.</p></div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Quelle est la limite de taille ? <span class="material-icons">expand_more</span></div>
            <div class="faq-answer"><p>La limite dépend de votre navigateur. Généralement, les fichiers jusqu'à 100 Mo fonctionnent sans problème.</p></div>
          </div>
        </div>
      </section>`;
  }

  function renderFaq(main) {
    main.innerHTML = `
      <div class="page-header">
        <div class="container">
          <h1>FAQ - Questions fréquentes</h1>
        </div>
      </div>
      <div class="container" style="padding:40px 20px;max-width:800px;margin:0 auto;">
        ${toolsData.faq.map(item => `
          <div class="faq-item">
            <div class="faq-question">${item.q} <span class="material-icons">expand_more</span></div>
            <div class="faq-answer"><p>${item.a}</p></div>
          </div>
        `).join('')}
      </div>
    `;
    setupFaqAccordion();
  }

  function setupFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', function() {
        const item = this.parentElement;
        const answer = item.querySelector('.faq-answer');
        const icon = this.querySelector('.material-icons');
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = null;
          const ic = i.querySelector('.material-icons');
          if (ic) ic.textContent = 'expand_more';
        });
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) icon.textContent = 'expand_less';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState === 'complete') init();

  window.addEventListener('load', function() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', function() {
        const item = this.parentElement;
        const answer = item.querySelector('.faq-answer');
        const icon = this.querySelector('.material-icons');
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = null;
          const ic = i.querySelector('.material-icons');
          if (ic) ic.textContent = 'expand_more';
        });
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) icon.textContent = 'expand_less';
        }
      });
    });
  });
})();
