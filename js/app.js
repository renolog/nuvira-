const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const progressBar = $('#progressBar');
const sidebar = $('#sidebar');
const burger = $('#burger');
const scrollTopBtn = $('#scrollTopBtn');
const themeToggle = $('#themeToggle');

/* ПРОГРЕСС */

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* БУРГЕР */

if (burger && sidebar) {
  burger.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });
}

/* КНОПКА НАВЕРХ */

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ТЕМА */

function updateThemeImages() {
  const currentTheme = document.documentElement.dataset.theme === 'dark'
    ? 'dark'
    : 'light';

  $$('.theme-image').forEach((image) => {
    const nextSrc = currentTheme === 'dark'
      ? image.dataset.dark
      : image.dataset.light;

    if (nextSrc && image.src !== nextSrc) {
      image.src = nextSrc;
    }
  });
}

if (themeToggle) {
  const savedTheme = localStorage.getItem('brandbook-theme');

  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  }

  updateThemeImages();

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('brandbook-theme', nextTheme);

    updateThemeImages();
  });
}

/* АККОРДЕОН */

$$('[data-accordion]').forEach((accordion) => {
  const buttons = $$('.acc-button', accordion);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.acc-item');
      const panel = $('.acc-panel', item);
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      buttons.forEach((otherButton) => {
        if (otherButton === button) return;

        otherButton.setAttribute('aria-expanded', 'false');

        const otherItem = otherButton.closest('.acc-item');
        const otherPanel = $('.acc-panel', otherItem);

        if (otherPanel) {
          otherPanel.hidden = true;
        }
      });

      button.setAttribute('aria-expanded', String(!isOpen));

      if (panel) {
        panel.hidden = isOpen;
      }
    });
  });
});

/* ТАБЫ */

$$('[data-tabs]').forEach((tabs) => {
  const buttons = $$('[role="tab"]', tabs);
  const panels = $$('.tab-panel', tabs);

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
      });

      panels.forEach((panel) => {
        panel.hidden = true;
      });

      button.setAttribute('aria-selected', 'true');

      if (panels[index]) {
        panels[index].hidden = false;
      }
    });
  });
});

/* КОПИРОВАНИЕ ЦВЕТА */

const copyStatus = $('#copyStatus');

$$('.swatch').forEach((swatch) => {
  swatch.addEventListener('click', async () => {
    const hex = swatch.dataset.hex;
    const copyButton = swatch.querySelector('.swatch-info em');
    const defaultText = copyButton ? copyButton.textContent : 'Копировать';

    try {
      await navigator.clipboard.writeText(hex);

      if (copyStatus) {
        copyStatus.textContent = `Скопировано: ${hex}`;
      }

      if (copyButton) {
        swatch.classList.add('is-copied');
        copyButton.textContent = 'Скопировано';
      }

      setTimeout(() => {
        if (copyButton) {
          swatch.classList.remove('is-copied');
          copyButton.textContent = defaultText;
        }
      }, 1400);
    } catch (error) {
      if (copyStatus) {
        copyStatus.textContent = `HEX-код: ${hex}`;
      }

      if (copyButton) {
        copyButton.textContent = 'HEX-код';
      }
    }
  });
});

/* ТИПОГРАФИКА */

const fontRange = $('#fontRange');
const lineRange = $('#lineRange');
const typePreview = $('#typePreview');

function updateTypePreview() {
  if (!typePreview) return;

  if (fontRange) {
    typePreview.style.fontSize = `${fontRange.value}px`;
  }

  if (lineRange) {
    typePreview.style.lineHeight = String(Number(lineRange.value) / 100);
  }
}

if (fontRange) {
  fontRange.addEventListener('input', updateTypePreview);
}

if (lineRange) {
  lineRange.addEventListener('input', updateTypePreview);
}

updateTypePreview();

/* МОДАЛКИ */

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeButton = $('.close', modal);

  if (closeButton) {
    closeButton.focus();
  }
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = '';
}

$$('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    openModal(button.dataset.modal);
  });
});

$$('.modal').forEach((modal) => {
  const closeButton = $('.close', modal);

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeModal(modal);
    });
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    $$('.modal').forEach((modal) => {
      if (!modal.hidden) {
        closeModal(modal);
      }
    });
  }
});

/* ГАЛЕРЕЯ */

const galleryItems = [
  { title: 'Визитка', type: 'Печать', text: 'Фирменная визитка с логотипом, контактами и спокойной композицией.' },
  { title: 'Бланк', type: 'Документы', text: 'Шаблон официального документа с фирменной шапкой.' },
  { title: 'Конверт', type: 'Печать', text: 'Конверт для деловой коммуникации и брендированной рассылки.' },
  { title: 'Папка', type: 'Документы', text: 'Фирменная папка для презентационных материалов.' },
  { title: 'Буклет', type: 'Печать', text: 'Информационный буклет о бренде, продуктах или услугах.' },
  { title: 'Плакат', type: 'Реклама', text: 'Рекламный плакат с крупной типографикой и паттерном.' },
  { title: 'Пост', type: 'Digital', text: 'Шаблон публикации для социальных сетей.' },
  { title: 'Сторис', type: 'Digital', text: 'Вертикальный шаблон для быстрых коммуникаций.' },
  { title: 'Email', type: 'Digital', text: 'Email-шаблон для рассылок и уведомлений.' },
  { title: 'Баннер', type: 'Digital', text: 'Digital-баннер для сайта и рекламных площадок.' },
  { title: 'Презентация', type: 'Digital', text: 'Слайды с фирменной сеткой и визуальной системой.' },
  { title: 'Сайт', type: 'Digital', text: 'Основные визуальные принципы веб-интерфейса.' },
  { title: 'Вывеска', type: 'Среда', text: 'Наружная вывеска с логотипом бренда.' },
  { title: 'Навигация', type: 'Среда', text: 'Таблички и указатели в фирменном стиле.' },
  { title: 'Униформа', type: 'Мерч', text: 'Одежда сотрудников или брендированная форма.' },
  { title: 'Футболка', type: 'Мерч', text: 'Фирменная футболка с логотипом или знаком.' },
  { title: 'Шоппер', type: 'Мерч', text: 'Текстильный шоппер с паттерном и логотипом.' },
  { title: 'Стикеры', type: 'Мерч', text: 'Набор стикеров с маскотом, знаком и фразами бренда.' },
  { title: 'Упаковка', type: 'Печать', text: 'Фирменная упаковка с использованием паттерна.' },
  { title: 'Бейдж', type: 'Среда', text: 'Бейджи сотрудников или участников мероприятий.' }
];

const galleryGrid = $('#galleryGrid');
const carrierPrev = $('#carrierPrev');
const carrierNext = $('#carrierNext');
const carrierCounter = $('#carrierCounter');

let galleryPage = 0;
const galleryPerPage = 8;

function renderGallery() {
  if (!galleryGrid) return;

  const start = galleryPage * galleryPerPage;
  const end = start + galleryPerPage;
  const visibleItems = galleryItems.slice(start, end);

  galleryGrid.innerHTML = visibleItems.map((item, index) => {
    const realIndex = start + index + 1;

    return `
      <article class="gallery-card" data-gallery-index="${start + index}">
        <span>${String(realIndex).padStart(2, '0')} · ${item.type}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `;
  }).join('');

  if (carrierCounter) {
    carrierCounter.textContent = `${start + 1}–${Math.min(end, galleryItems.length)} из ${galleryItems.length}`;
  }

  $$('.gallery-card', galleryGrid).forEach((card) => {
    card.addEventListener('click', () => {
      const item = galleryItems[Number(card.dataset.galleryIndex)];

      $('#galleryModalType').textContent = item.type;
      $('#galleryModalTitle').textContent = item.title;
      $('#galleryModalText').textContent = item.text;

      openModal('galleryModal');
    });
  });
}

if (carrierPrev) {
  carrierPrev.addEventListener('click', () => {
    const maxPage = Math.ceil(galleryItems.length / galleryPerPage) - 1;
    galleryPage = galleryPage <= 0 ? maxPage : galleryPage - 1;
    renderGallery();
  });
}

if (carrierNext) {
  carrierNext.addEventListener('click', () => {
    const maxPage = Math.ceil(galleryItems.length / galleryPerPage) - 1;
    galleryPage = galleryPage >= maxPage ? 0 : galleryPage + 1;
    renderGallery();
  });
}

renderGallery();

/* АКТИВНЫЙ ПУНКТ МЕНЮ */

const navLinks = $$('.toc a[href^="#"]');
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', isActive);
    });
  });
}, {
  rootMargin: '-35% 0px -55% 0px',
  threshold: 0
});

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* ПЕРЕХОДЫ ПО БОКОВОМУ МЕНЮ ПРИ STICKY */

const sidebarJumpLinks = document.querySelectorAll('.toc a[href^="#"], .brand[href^="#"]');

sidebarJumpLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    document.body.classList.add('nav-jump');

    if (sidebar && burger) {
      sidebar.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }

    const meaningSection = document.querySelector('#meaning');
    const graphicsSection = document.querySelector('#graphics');

    if (meaningSection) {
      meaningSection.scrollTop = 0;
    }

    if (graphicsSection) {
      graphicsSection.scrollTop = 0;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        history.pushState(null, '', targetId);

        clearTimeout(window.navJumpTimer);

        window.navJumpTimer = setTimeout(() => {
          document.body.classList.remove('nav-jump');
        }, 1800);
      });
    });
  });
});
/* ПОСТРОЕНИЕ */

const constructionData = {
  logo: {
    title: 'Основная версия',
    description: 'Основная версия фирменного блока бренда NUVIRA. Используется в большинстве носителей и является главным вариантом визуальной идентичности.',
    defaultImage: 'assets/images/construction-logo.png',
    buildImage: 'assets/images/construction-logo-build.png',
    alt: 'Логотип NUVIRA'
  },
  sign: {
    title: 'Знак',
    description: 'Фирменный знак используется как самостоятельный элемент айдентики в компактных форматах и помогает сохранять узнаваемость бренда.',
    defaultImage: 'assets/images/construction-sign.png',
    buildImage: 'assets/images/construction-sign-build.png',
    alt: 'Фирменный знак NUVIRA'
  },
  icon: {
    title: 'Иконка',
    description: 'Иконка подходит для digital-среды: favicon, маленьких интерфейсных элементов, аватаров и других ситуаций, где нужен максимально компактный знак.',
    defaultImage: 'assets/images/construction-icon.png',
    buildImage: 'assets/images/construction-icon-build.png',
    alt: 'Иконка NUVIRA'
  }
};

const constructionOptions = $$('.construction-option');
const constructionImage = $('#constructionImage');
const constructionTitle = $('#constructionTitle');
const constructionDescription = $('#constructionDescription');
const constructionBuildToggle = $('.construction-build-toggle');

let currentConstruction = 'logo';
let constructionMode = 'default';

function updateConstructionView() {
  const data = constructionData[currentConstruction];

  if (
    !data ||
    !constructionImage ||
    !constructionTitle ||
    !constructionDescription ||
    !constructionBuildToggle
  ) {
    return;
  }

  const constructionImageBox = document.querySelector(
    '#logo-construction .construction-single-image'
  );

  const isIconDefault =
    currentConstruction === 'icon' && constructionMode === 'default';

  if (constructionImageBox) {
    constructionImageBox.style.backgroundColor = isIconDefault
      ? '#FFFFFF'
      : '';
  }

  constructionImage.style.opacity = '0';

  setTimeout(() => {
    constructionImage.src =
      constructionMode === 'build' ? data.buildImage : data.defaultImage;

    constructionImage.alt = data.alt;
    constructionImage.style.opacity = '1';
  }, 60);

  constructionTitle.textContent = data.title;
  constructionDescription.textContent = data.description;

  constructionBuildToggle.textContent =
    constructionMode === 'build' ? 'Обычный вид' : 'Построение';

  constructionOptions.forEach((button) => {
    button.classList.toggle(
      'is-active',
      button.dataset.construction === currentConstruction
    );
  });
}
constructionOptions.forEach((button) => {
  button.addEventListener('click', () => {
    currentConstruction = button.dataset.construction;
    constructionMode = 'default';
    updateConstructionView();
  });
});

if (constructionBuildToggle) {
  constructionBuildToggle.addEventListener('click', () => {
    constructionMode = constructionMode === 'default' ? 'build' : 'default';
    updateConstructionView();
  });
}

updateConstructionView();

/* ОХРАННОЕ ПОЛЕ */

const clearspaceData = {
  main: {
    title: 'Основная версия',
    description: 'Минимальное расстояние вокруг логотипа равно модулю X. В пределах охранного поля нельзя размещать текст, изображения, декоративные элементы или границы макета.',
    image: 'assets/images/clearspace-main.png',
    alt: 'Охранное поле основной версии логотипа NUVIRA'
  },
  sign: {
    title: 'Фирменный знак',
    description: 'Для фирменного знака охранное поле сохраняется со всех сторон. Это помогает знаку оставаться читаемым и узнаваемым даже в компактных форматах.',
    image: 'assets/images/clearspace-sign.png',
    alt: 'Охранное поле фирменного знака NUVIRA'
  }
};

const clearspaceOptions = $$('.clearspace-option');
const clearspaceImage = $('#clearspaceImage');
const clearspaceTitle = $('#clearspaceTitle');
const clearspaceDescription = $('#clearspaceDescription');

function updateClearspaceView(key) {
  const data = clearspaceData[key];

  if (!data || !clearspaceImage || !clearspaceTitle || !clearspaceDescription) return;

  clearspaceImage.style.opacity = '0';

  setTimeout(() => {
    clearspaceImage.src = data.image;
    clearspaceImage.alt = data.alt;
    clearspaceImage.style.opacity = '1';
  }, 180);

  clearspaceTitle.textContent = data.title;
  clearspaceDescription.textContent = data.description;

  clearspaceOptions.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.clearspace === key);
  });
}

clearspaceOptions.forEach((button) => {
  button.addEventListener('click', () => {
    updateClearspaceView(button.dataset.clearspace);
  });
});

updateClearspaceView('main');

/* ЦВЕТОВЫЕ ВЕРСИИ */

const colorVersionData = {
  main: {
    title: 'Основная версия',
    description: 'Основная версия логотипа используется на светлом фоне. Она обеспечивает максимальную читаемость и подходит для большинства носителей бренда.',
    image: 'assets/images/logo-color-main.png',
    alt: 'Основная версия логотипа NUVIRA'
  },
  brand: {
    title: 'Фирменный цвет',
    description: 'На фирменных цветах логотип должен сохранять достаточный контраст. Для каждого цвета используется подходящая версия логотипа.',
    image: 'assets/images/logo-color-brand-primary.png',
    alt: 'Логотип NUVIRA на фирменном цвете'
  },
  complex: {
    title: 'Сложный фон',
    description: 'На сложном фоне логотип размещается только при достаточной читаемости. При необходимости используется плашка, затемнение или контрастная версия.',
    image: 'assets/images/logo-color-complex.png',
    alt: 'Логотип NUVIRA на сложном фоне'
  }
};

const brandColorData = {
  primary: {
    image: 'assets/images/logo-color-brand-primary.png',
    alt: 'Логотип NUVIRA на основном фирменном цвете'
  },
  soft: {
    image: 'assets/images/logo-color-brand-soft.png',
    alt: 'Логотип NUVIRA на светлом фирменном цвете'
  },
  dark: {
    image: 'assets/images/logo-color-brand-dark.png',
    alt: 'Логотип NUVIRA на дополнительном фирменном цвете'
  }
};

const colorVersionOptions = $$('.color-version-option');
const brandColorOptions = $$('.brand-color-option');
const brandColorSwitcher = $('#brandColorSwitcher');

const colorVersionImage = $('#colorVersionImage');
const colorVersionTitle = $('#colorVersionTitle');
const colorVersionDescription = $('#colorVersionDescription');

let currentColorVersion = 'main';
let currentBrandColor = 'primary';

function updateColorVersionView() {
  const versionData = colorVersionData[currentColorVersion];

  if (!versionData || !colorVersionImage || !colorVersionTitle || !colorVersionDescription) return;

  let image = versionData.image;
  let alt = versionData.alt;

  if (currentColorVersion === 'brand') {
    const brandData = brandColorData[currentBrandColor];

    if (brandData) {
      image = brandData.image;
      alt = brandData.alt;
    }
  }

  colorVersionImage.style.opacity = '0';

  setTimeout(() => {
    colorVersionImage.src = image;
    colorVersionImage.alt = alt;
    colorVersionImage.style.opacity = '1';
  }, 180);

  colorVersionTitle.textContent = versionData.title;
  colorVersionDescription.textContent = versionData.description;

  colorVersionOptions.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.colorVersion === currentColorVersion);
  });

  brandColorOptions.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.brandColor === currentBrandColor);
  });

  if (brandColorSwitcher) {
    brandColorSwitcher.hidden = currentColorVersion !== 'brand';
  }
}

colorVersionOptions.forEach((button) => {
  button.addEventListener('click', () => {
    currentColorVersion = button.dataset.colorVersion;

    if (currentColorVersion !== 'brand') {
      currentBrandColor = 'primary';
    }

    updateColorVersionView();
  });
});

brandColorOptions.forEach((button) => {
  button.addEventListener('click', () => {
    currentBrandColor = button.dataset.brandColor;
    currentColorVersion = 'brand';
    updateColorVersionView();
  });
});

updateColorVersionView();

/* ГРАФИКА И ФОТОСТИЛЬ */

const graphicsData = {
  patterns: {
    title: 'Паттерн',
    runner: null,
    items: [
      {
        image: 'assets/images/pattern-1.png',
        alt: 'Фирменный паттерн NUVIRA',
        description: 'Фирменный паттерн используется как мягкий фоновый элемент. Он помогает создать спокойное, дружелюбное и узнаваемое настроение бренда NUVIRA.'
      }
    ]
  },

  graphic: {
    title: 'Графический элемент',
    runner: 'assets/images/runner-3.svg',
    items: [
      {
        image: 'assets/images/graphic-1.png',
        alt: 'Графический элемент NUVIRA 1',
        description: 'Первый графический элемент используется как поддерживающая форма в композиции. Он помогает выстраивать фирменную подачу и усиливает узнаваемость бренда.'
      },
      {
        image: 'assets/images/graphic-2.png',
        alt: 'Графический элемент NUVIRA 2',
        description: 'Второй графический элемент добавляет композиции динамику и может использоваться в digital-носителях, презентациях и рекламных материалах.'
      },
      {
        image: 'assets/images/graphic-3.png',
        alt: 'Графический элемент NUVIRA 3',
        description: 'Третий графический элемент используется как дополнительный акцент. Он помогает разнообразить визуальную систему, не нарушая её целостность.'
      }
    ]
  },

  mascot: {
    title: 'Маскот',
    runner: 'assets/images/runner-14.svg',
    description: 'Маскот делает коммуникацию бренда более дружелюбной, эмоциональной и живой. Он может использоваться в разных позах и сюжетах, сохраняя единый характер бренда.',
    items: Array.from({ length: 14 }, (_, index) => ({
      image: `assets/images/mascot-${index + 1}.png`,
      alt: `Маскот NUVIRA ${index + 1}`
    }))
  },

  photo: {
    title: 'Фотостиль',
    runner: 'assets/images/runner-7.svg',
    description: 'Фотостиль бренда должен быть светлым, спокойным и мягким. Важно использовать изображения с чистой композицией, деликатной цветовой гаммой и дружелюбным настроением.',
    items: Array.from({ length: 7 }, (_, index) => ({
      image: `assets/images/photo-${index + 1}.png`,
      alt: `Фотостиль NUVIRA ${index + 1}`
    }))
  }
};

const graphicsModes = $$('.graphics-mode');
const graphicsImage = $('#graphicsImage');
const graphicsTitle = $('#graphicsTitle');
const graphicsDescription = $('#graphicsDescription');
const graphicsPagination = $('#graphicsPagination');

let currentGraphicsMode = 'patterns';
let currentGraphicsIndex = 0;

/*
  Настройки бегунка:
  высота самой широкой части — 16px;
  белый кружок — 10×10px;
  прыжок кружка — 14px.
*/

const runnerHeight = 28;
const runnerStep = 24;

function getCurrentGraphicsSection() {
  return graphicsData[currentGraphicsMode];
}

function getCurrentGraphicsItems() {
  const section = getCurrentGraphicsSection();
  return section ? section.items : [];
}

function renderGraphicsRunner() {
  const section = getCurrentGraphicsSection();
  const items = getCurrentGraphicsItems();
  const total = items.length;

  if (!graphicsPagination || !section || total <= 1 || !section.runner) {
    if (graphicsPagination) {
      graphicsPagination.innerHTML = '';
      graphicsPagination.classList.add('is-hidden');
    }

    return;
  }

  const runnerWidth = runnerHeight + runnerStep * (total - 1);
  const thumbLeft = runnerHeight / 2 + runnerStep * currentGraphicsIndex;

  graphicsPagination.classList.remove('is-hidden');

  graphicsPagination.innerHTML = `
    <div
      class="graphics-runner"
      style="
        --runner-width: ${runnerWidth}px;
        --runner-thumb-left: ${thumbLeft}px;
      "
    >
      <img
        class="graphics-runner-track"
        src="${section.runner}"
        alt=""
        aria-hidden="true"
      >

      ${items.map((_, index) => {
        const stepLeft = runnerHeight / 2 + runnerStep * index;

        return `
          <button
            class="graphics-runner-step"
            type="button"
            data-graphics-index="${index}"
            style="--step-left: ${stepLeft}px;"
            aria-label="Показать изображение ${index + 1} из ${total}"
          ></button>
        `;
      }).join('')}

      <span class="graphics-runner-thumb" aria-hidden="true"></span>
    </div>
  `;

  const steps = $$('.graphics-runner-step', graphicsPagination);

  steps.forEach((step) => {
    step.addEventListener('click', () => {
      currentGraphicsIndex = Number(step.dataset.graphicsIndex);
      updateGraphicsView();
    });
  });
}

function updateGraphicsView() {
  const section = getCurrentGraphicsSection();
  const items = getCurrentGraphicsItems();

  if (!section || !items.length || !graphicsImage || !graphicsTitle || !graphicsDescription) return;

  if (currentGraphicsIndex > items.length - 1) {
    currentGraphicsIndex = 0;
  }

  const currentItem = items[currentGraphicsIndex];

  graphicsImage.style.opacity = '0';

  setTimeout(() => {
    graphicsImage.src = currentItem.image;
    graphicsImage.alt = currentItem.alt || section.title;
    graphicsImage.style.opacity = '1';
  }, 160);

  graphicsTitle.textContent = section.title;

  graphicsDescription.textContent = section.description
    ? section.description
    : currentItem.description;

  graphicsModes.forEach((button) => {
    button.classList.toggle(
      'is-active',
      button.dataset.graphicsMode === currentGraphicsMode
    );
  });

  renderGraphicsRunner();
}

graphicsModes.forEach((button) => {
  button.addEventListener('click', () => {
    currentGraphicsMode = button.dataset.graphicsMode;
    currentGraphicsIndex = 0;
    updateGraphicsView();
  });
});

updateGraphicsView();

/* ТИПОГРАФИКА — переключение шрифта по клику на плашку */

const fontCards = document.querySelectorAll('#typography .font-card');

fontCards.forEach((card) => {
  card.addEventListener('click', () => {
    const fontName = card.querySelector('h3')?.textContent.trim();

    fontCards.forEach((item) => {
      item.classList.remove('is-active');
    });

    card.classList.add('is-active');

    if (!typePreview || !fontName) return;

    if (fontName === 'Montserrat') {
      typePreview.style.fontFamily = '"Montserrat", sans-serif';
      typePreview.style.fontWeight = '400';
      typePreview.style.letterSpacing = '0';
    }

    if (fontName === 'Advent Pro') {
      typePreview.style.fontFamily = '"Advent Pro", sans-serif';
      typePreview.style.fontWeight = '600';
      typePreview.style.letterSpacing = '-0.035em';
    }
  });
});
/* ФИКС БОКОВОГО МЕНЮ ПРИ STICKY-СТРАНИЦАХ */

document.addEventListener(
  'click',
  (event) => {
    const link = event.target.closest('.toc a[href^="#"], .brand[href^="#"]');

    if (!link) return;

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    document.body.classList.add('nav-jump');

    const meaningSection = document.querySelector('#meaning');
    const graphicsSection = document.querySelector('#graphics');

    if (meaningSection) {
      meaningSection.scrollTop = 0;
    }

    if (graphicsSection) {
      graphicsSection.scrollTop = 0;
    }

    if (sidebar && burger) {
      sidebar.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targetTop = target.offsetTop;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        history.pushState(null, '', targetId);

        clearTimeout(window.navJumpTimer);

        window.navJumpTimer = setTimeout(() => {
          document.body.classList.remove('nav-jump');
        }, 1200);
      });
    });
  },
  true
);
