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

      if (!isOpen && panel) {
        setTimeout(() => {
          const panelRect = panel.getBoundingClientRect();
          const viewportBottom = window.innerHeight - 40;

          if (panelRect.bottom > viewportBottom) {
            window.scrollBy({
              top: panelRect.bottom - viewportBottom,
              behavior: 'smooth'
            });
          }
        }, 80);
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
  {
  title: 'Блокнот для записей',
  type: 'Внешний носитель',
  text: [
    'Назначение: блокнот для записей — фирменный печатный носитель NUVIRA, предназначенный для личных заметок, фиксации мыслей, эмоциональных состояний и небольших рефлексивных практик. Носитель поддерживает идею бренда: бережно помогать пользователю выражать мнение, мысли и чувства.',

    'Дизайн: оформление обложки построено на крупной акцентной фразе «Выражаю мнение, мысли, чувства», маскоте, фирменном знаке, декоративных графических элементах и мягком волнообразном фоне. На корешке размещается поддерживающая фраза «Я свободен от тревожных мыслей», благодаря чему блокнот остаётся узнаваемым даже в закрытом виде.',

    'Цветовое оформление: носитель может использоваться в трёх фирменных цветовых версиях — лавандовой, светло-розовой и светло-синей. Основные графические и текстовые элементы выполняются фирменным тёмно-синим цветом. Маскот сохраняет фирменную розовую заливку и тёмно-синий контур.',

    'Шрифтовое оформление: акцентная фраза «Выражаю» набирается гарнитурой Advent Pro, размер —  24 pt, начертание — SemiBold. Дополнительная часть фразы «мнение, мысли, чувства» — Montserrat, размер — 16 pt, начертание — Regular. Текст на корешке — Montserrat, размер — 16 pt, начертание — Regular.',

    'Размер носителя: 148 × 210 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-1.png',
  layoutImage: 'assets/images/carrier-1-layout.png'
},
 {
  title: 'Стикеры для Telegram',
  type: 'Внешний носитель',
  text: [
    'Назначение: стикеры для Telegram — digital-носитель NUVIRA, предназначенный для повседневной эмоциональной коммуникации с пользователем. Стикеры помогают передавать настроение бренда в мягкой, дружелюбной и поддерживающей форме.',

    'Дизайн: набор состоит из девяти стикеров с маскотом NUVIRA. Каждый стикер передаёт отдельную эмоцию или реакцию: поддержку, усталость, радость, тревогу, уверенность или самоиронию. Текстовые фразы размещаются рядом с маскотом и повторяют изгиб композиции, поэтому выглядят как часть иллюстрации.',

    'Цветовое оформление: основной фон набора — фирменный тёмно-синий цвет. Маскот сохраняет фирменную розовую заливку и тёмно-синий контур. Для подложек и деталей используется светлый цвет, который отделяет персонажа от фона и делает стикеры читаемыми в интерфейсе мессенджера.',

    'Шрифтовое оформление: фразы на стикерах набираются гарнитурой Advent Pro, размер — 32 px, начертание — SemiBold. Текст должен оставаться крупным, коротким и хорошо читаемым даже при уменьшении стикера в чате.',

    'Размер носителя: стикеры адаптированы под формат Telegram. Максимальная сторона — 512 px.'
  ].join('\n\n'),
  image: 'assets/images/carrier-2.png',
  layoutImage: 'assets/images/carrier-2-layout.png'
},

 {
  title: '3D стикеры для гаджетов',
  type: 'Внешний носитель',
  text: [
    'Назначение: 3D стикеры для гаджетов — фирменный печатный носитель NUVIRA, предназначенный для персонализации телефона, ноутбука, ежедневника и других личных предметов пользователя. Носитель помогает перенести визуальный язык бренда в повседневную среду.',

    'Дизайн: большой набор включает несколько фирменных элементов: карточки эмоций, маскота, графические элементы, логотип, QR-код и карточку с фразой «Выражаю мнение, мысли, чувства». Малый формат строится вокруг одного центрального стикера с маскотом и сохраняет ту же композиционную систему. На упаковке также размещается QR-код для перехода в приложение.',

    'Цветовое оформление: основой упаковки является мягкий лавандовый фон с волнообразным фирменным паттерном. Стикеры используют основные цвета NUVIRA: розовый для маскота, светлые оттенки для подложек, оранжевый для акцентной эмоции и фирменный тёмно-синий для текста, логотипа, QR-кода и контурной графики.',

    'Шрифтовое оформление: надпись «3D стикеры для гаджетов» набирается гарнитурой Montserrat, размер — 16 pt для большого формата и  24 pt для малого формата, начертание — Regular.',

    'Размер носителя: большой набор — 150 × 150 мм, малый набор — 60 × 80 мм. '
  ].join('\n\n'),
  image: 'assets/images/carrier-3.png',
  layoutImage: 'assets/images/carrier-3-layout.png'
},

 {
  title: 'Набор открыток',
  type: 'Внешний носитель',
  text: [
    'Назначение: набор открыток — фирменный печатный носитель NUVIRA, предназначенный для мягкой офлайн-коммуникации с пользователем. Открытки могут использоваться как вложение к мерчу, небольшой подарок, напоминание о заботе о себе или карточка с поддерживающей фразой.',

    'Дизайн: набор состоит из открыток с разными композиционными решениями. На лицевой стороне размещаются короткие поддерживающие фразы, фирменный знак, паттерн или декоративные графические элементы. На оборотной стороне может располагаться QR-код с подписью «Приложение» для перехода в NUVIRA. Композиция сохраняет большое количество свободного пространства, чтобы носитель воспринимался спокойно и легко.',

    'Цветовое оформление: используются фирменные светлые оттенки NUVIRA — лавандовый, светло-розовый и светло-синий. Для текста, логотипа, QR-кода и основных графических элементов применяется фирменный тёмно-синий цвет. Декоративные элементы могут дополняться розовыми и светло-синими акцентами.',

    'Шрифтовое оформление: крупная фраза «А что если всё получится?» набирается гарнитурой Advent Pro, размер —  96 pt, начертание — SemiBold. Малые поддерживающие фразы — Advent Pro, размер — 24 pt, начертание — SemiBold. Дополнительная подпись «Просто попробуй» — Montserrat, размер — 16 pt, начертание — Regular.',

    'Размер носителя: 148 × 210 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-4.png',
  layoutImage: 'assets/images/carrier-4-layout.png'
},
{
  title: 'Баннеры в городе',
  type: 'Внешний носитель',
  text: [
    'Назначение: городские баннеры — наружный рекламный носитель NUVIRA, предназначенный для знакомства аудитории с приложением в городской среде. Баннер должен быстро считываться на расстоянии и сразу передавать главную идею бренда: с NUVIRA пользователь может почувствовать себя свободнее от тревожных мыслей.',

    'Дизайн: композиция строится на крупной акцентной фразе «С NUVIRA ты свободен от тревожных мыслей», логотипе в верхней правой части, кратком описании приложения, крупном маскоте и QR-коде для перехода в приложение. Основной визуальный акцент расположен в нижней части макета: маскот занимает большую площадь и делает коммуникацию более дружелюбной.',

    'Цветовое оформление: фон баннера выполнен в светлом фирменном оттенке с мягкой волнообразной графикой. Для текста, логотипа, QR-кода и контуров используется фирменный тёмно-синий цвет. Маскот сохраняет розовую заливку и тёмно-синий контур. Слово «NUVIRA» выделяется светло-розовой плашкой как смысловой акцент внутри заголовка.',

    'Шрифтовое оформление: основная фраза набирается гарнитурой Advent Pro, размер — 128 pt, начертание — SemiBold. Выделенное слово «NUVIRA» сохраняет тот же шрифт и размер, но размещается на мягкой цветовой плашке. Описание приложения набирается Montserrat, размер — 24 pt, начертание — Regular.',

    'Размер носителя: 841 × 1189 мм. Формат подходит для вертикального городского рекламного баннера или постера.'
  ].join('\n\n'),
  image: 'assets/images/carrier-5.png',
  layoutImage: 'assets/images/carrier-5-layout.png'
},

  {
  title: 'Мягкая игрушка',
  type: 'Внешний носитель',
  text: [
    'Назначение: мягкая игрушка — предметный фирменный носитель NUVIRA, предназначенный для усиления эмоционального образа бренда. Игрушка работает как тактильный символ поддержки и помогает перенести маскота из цифровой среды в реальное пространство пользователя.',

    'Дизайн: форма игрушки повторяет фирменного маскота NUVIRA. Основной объём строится на мягкой облачной форме головы, вытянутых ногах, округлых руках и характерном завитке сверху. Важно сохранить узнаваемые черты персонажа: крупные глаза, небольшую улыбку, румяные штрихи и спокойное дружелюбное выражение.',

    'Цветовое оформление: основная часть маскота выполняется в фирменном розовом цвете. Ноги и руки — светлые, ближе к белому оттенку. Контурные элементы, глаза, рот, ресницы и завиток выполняются фирменным тёмно-синим цветом. Использование небрендовых ярких оттенков не допускается, чтобы игрушка сохраняла мягкий и спокойный характер.',

    'Шрифтовое оформление: на самой игрушке текст не используется.',

    'Размер носителя: 200 × 350 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-6.png',
  layoutImage: 'assets/images/carrier-6-layout.png'
},

  {
  title: 'Тканевый шоппер',
  type: 'Внешний носитель',
  text: [
    'Назначение: тканевый шоппер — фирменный предметный носитель NUVIRA, предназначенный для повседневного использования. Он переносит визуальный образ бренда в городскую среду и работает как мягкое напоминание о заботе о себе.',

    'Дизайн: основная композиция размещается на внешнем кармане шоппера. В центре кармана расположен маскот, под ним — короткая поддерживающая фраза «Пережить день — тоже план». Фоновая графика выполнена в виде мягкой волнообразной формы, которая поддерживает спокойный визуальный характер бренда. Сам шоппер остаётся лаконичным, без лишних декоративных элементов.',

    'Цветовое оформление: основа шоппера выполнена в светлом лавандовом оттенке. Карман оформляется в фирменной палитре NUVIRA: светлый фон, мягкая лавандовая графика, розовый маскот и фирменный тёмно-синий цвет для контура и текста. Использование ярких небрендовых цветов не рекомендуется.',

    'Шрифтовое оформление: поддерживающая фраза набирается гарнитурой Advent Pro, размер — 16 pt, начертание — SemiBold. Текст должен оставаться коротким, читаемым и визуально связанным с маскотом. Дополнительные подписи на носителе не используются, чтобы сохранить чистую композицию.',

    'Размер носителя: шоппер — 380 × 680 мм. Размер кармана с фирменной композицией — 180 × 200 мм. Центральная зона с маскотом и текстом занимает 100 × 140 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-7.png',
  layoutImage: 'assets/images/carrier-7-layout.png'
},
  {
  title: 'Маска для сна',
  type: 'Внешний носитель',
  text: [
    'Назначение: маска для сна — предметный фирменный носитель NUVIRA, связанный с темой отдыха, восстановления и заботы о себе. Носитель поддерживает эмоциональный образ бренда и переносит элементы фирменного знака в повседневный ритуал отдыха.',

    'Дизайн: форма маски строится на мягком вытянутом силуэте со скруглёнными краями и выемкой в нижней части. На лицевой стороне размещаются фирменные глаза и короткие декоративные штрихи, которые отсылают к эмоциональным карточкам знака NUVIRA. Благодаря этому маска остаётся узнаваемой даже без логотипа и текста.',

    'Цветовое оформление: маска представлена в двух фирменных цветовых версиях — тёмно-синей и розовой. В тёмно-синей версии глаза и акценты выполняются в розовом и светлом цвете. В розовой версии основные детали выполняются фирменным тёмно-синим цветом. Использование дополнительных ярких оттенков не рекомендуется.',

    'Шрифтовое оформление: текст на самой маске не используется, так как носитель строится на графических элементах бренда.',

    'Размер носителя: основная часть маски — 200 × 90 мм. Резинка — 500 × 40 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-8.png',
  layoutImage: 'assets/images/carrier-8-layout.png'
},

 {
  title: 'Фирменная футболка',
  type: 'Внешний носитель',
  text: [
    'Назначение: фирменная футболка — мерч-носитель NUVIRA, предназначенный для продвижения бренда в повседневной среде. Футболка помогает перенести образ маскота и поддерживающий тон коммуникации в офлайн-пространство.',

    'Дизайн: футболка представлена в двух цветовых версиях. В розовой версии используется композиция с маскотом и фразой «Выдыхай и лови дзен». В светло-синей версии используется композиция с маскотом и фразой «Излучаю только позитивные вибрации». Принт размещается на передней части футболки в центральной зоне груди. Оборотная сторона остаётся без нанесения, чтобы сохранить чистый и спокойный вид носителя.',

    'Цветовое оформление: основа футболки выполняется в фирменных цветах #FDEDED и #C9D2FD. Маскот сохраняет фирменную розовую заливку, тёмно-синий контур и светлые дополнительные элементы. Для текста и контурной графики используется фирменный тёмно-синий цвет. Дополнительные графические элементы выполняются в мягкой розово-синей палитре.',

    'Шрифтовое оформление: поддерживающие фразы набираются гарнитурой Advent Pro, размер — 32 pt, начертание — SemiBold. Текст размещается по дуге вокруг маскота и должен оставаться читаемым при нанесении на ткань. Дополнительный текст на футболке не используется.',

    'Размер носителя: базовый размер футболки — 520 × 660 мм. Размер зоны нанесения: для розовой версии — 430 × 250 мм, для светло-синей версии — 300 × 250 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-9-fdeded.png',
  layoutImage: 'assets/images/carrier-9-fdeded-layout.png',
  variants: [
    {
      name: '#FDEDED',
      color: '#FDEDED',
      image: 'assets/images/carrier-9-fdeded.png',
      layoutImage: 'assets/images/carrier-9-fdeded-layout.png'
    },
    {
      name: '#C9D2FD',
      color: '#C9D2FD',
      image: 'assets/images/carrier-9-c9d2fd.png',
      layoutImage: 'assets/images/carrier-9-c9d2fd-layout.png'
    }
  ]
},

{
  title: 'Постеры в кофейнях',
  type: 'Внешний носитель',
  text: [
    'Назначение: Постеры в кофейнях — рекламный печатный носитель NUVIRA, предназначенный для размещения в кофейнях, коворкингах, вузах и других общественных пространствах. Постер помогает быстро познакомить пользователя с приложением и направить его к простому действию — перейти по QR-коду.',

    'Дизайн: композиция строится на фирменном знаке в верхней левой части, крупной поддерживающей фразе «Приложение, которое знает как тебе помочь», большом маскоте и QR-коде в нижней правой части. Маскот занимает центральную часть макета и становится главным эмоциональным акцентом. Фон дополнен мягким фирменным паттерном, который не мешает считыванию текста.',

    'Цветовое оформление: основа постера выполнена в светлом фирменном оттенке с деликатным паттерном. Маскот сохраняет фирменную розовую заливку, тёмно-синий контур и светлые детали. Для заголовка, логотипа, QR-кода и подписи используется фирменный тёмно-синий цвет.',

    'Шрифтовое оформление: заголовок «Приложение, которое знает как тебе помочь» набирается гарнитурой Advent Pro, размер — 32 pt, начертание — SemiBold. Текст расположен в три строки с равномерным межстрочным интервалом.',

    'Размер носителя: 297 × 420 мм. Формат соответствует вертикальному постеру A3. Размер зоны с маскотом — 228 × 270 мм. '
  ].join('\n\n'),
  image: 'assets/images/carrier-10.png',
  layoutImage: 'assets/images/carrier-10-layout.png'
},

{
  title: 'Шаблоны для соцсетей',
  type: 'Внутренний носитель',
  text: [
    'Назначение: шаблоны для соцсетей — digital-носитель NUVIRA, предназначенный для оформления сторис, постов и рекламных публикаций бренда. Шаблоны помогают сохранять единый визуальный стиль в социальных сетях и быстро доносить до пользователя пользу приложения.',

    'Дизайн: серия состоит из трёх сторис-макетов. Первый шаблон строится на эмоциональной фразе «Тревога никогда не приходит без причины», маскоте и коротком поддерживающем тексте. Второй шаблон показывает интерфейс приложения и объясняет, что NUVIRA помогает в трудную минуту. Третий шаблон демонстрирует приложение в руке и усиливает идею постоянной поддержки: «с NUVIRA поддержка всегда под рукой». Во всех макетах используется верхняя зона с логотипом, элементы интерфейса сторис и мягкий фирменный фон.',

    'Цветовое оформление: основа шаблонов выполнена в светлом фирменном оттенке с лавандовым фоном и мягкой волнообразной графикой. Маскот сохраняет розовую заливку и тёмно-синий контур. Для текста, логотипа и интерфейсных элементов используется фирменный тёмно-синий цвет. Слово «NUVIRA» может выделяться розовой плашкой как смысловой акцент.',

    'Шрифтовое оформление: основные фразы набираются гарнитурой Advent Pro, размер —  20 px, начертание — SemiBold. Дополнительный поддерживающий текст — Montserrat, размер — 16 px, начертание — SemiBold.',

    'Размер носителя: формат сторис — 862 × 1078 px. '
  ].join('\n\n'),
  image: 'assets/images/carrier-11.png',
  layoutImage: 'assets/images/carrier-11-layout.png'
},

{
  title: 'App Store',
  type: 'Внутренний носитель',
  text: [
    'Назначение: карточки App Store — digital-носитель NUVIRA, предназначенный для презентации приложения в магазинах и на промо-страницах. Носитель помогает быстро объяснить пользу приложения, показать интерфейс и сформировать первое впечатление о бренде до установки.',

    'Дизайн: оформление строится на широкой фирменной обложке с логотипом NUVIRA и серии вертикальных промо-карточек. В карточках используются крупные заголовки, экраны приложения, маскот и мягкий фирменный фон. Первая карточка представляет приложение как помощника в борьбе с тревогой, вторая показывает поддержку в трудную минуту, третья и четвёртая раскрывают функцию дневника состояния, а пятая демонстрирует отслеживание прогресса пользователя.',

    'Цветовое оформление: основа карточек выполнена в светлом фирменном оттенке с лавандовым паттерном. Для текста, логотипа и интерфейсных элементов используется фирменный тёмно-синий цвет. Маскот сохраняет розовую заливку, тёмно-синий контур и светлые детали. Акцентные элементы интерфейса могут использовать фирменные розовый, лавандовый и оранжевый оттенки.',

    'Шрифтовое оформление: название NUVIRA в верхней обложке набирается гарнитурой Advent Pro, размер — 128 px, начертание — SemiBold. Заголовки промо-карточек — Advent Pro, размер — 32 px, начертание — SemiBold. ',

    'Размер носителя: фирменная обложка магазина — 1920 × 385 px. Вертикальные промо-карточки — 1320 × 2868 px.'
  ].join('\n\n'),
  image: 'assets/images/carrier-12.png',
  layoutImage: 'assets/images/carrier-12-layout.png'
},

{
  title: 'Аватар и обложки для соцсетей',
  type: 'Внутренний носитель',
  text: [
    'Назначение: аватар и обложки для соцсетей — digital-носитель NUVIRA, предназначенный для оформления брендовых страниц в социальных сетях. Носитель формирует первое визуальное впечатление о бренде и помогает сохранить узнаваемость NUVIRA на разных платформах.',

    'Дизайн: оформление строится на широкой обложке с фирменным знаком, поддерживающей фразой «Свободен от тревожных мыслей», кратким описанием приложения и крупным маскотом в правой части. Аватар использует компактный фрагмент маскота, поэтому остаётся читаемым даже в маленьком размере. Дополнительные обложки для разделов оформляются на основе фирменного паттерна.',

    'Цветовое оформление: основа обложек выполнена в светлом фирменном оттенке с мягким лавандовым паттерном. Для текста, логотипа и контурной графики используется фирменный тёмно-синий цвет. Маскот сохраняет розовую заливку, тёмно-синий контур и светлые детали. Цветовая система должна оставаться спокойной и не перегружать интерфейс социальной сети.',

    'Шрифтовое оформление: основная фраза «Свободен от тревожных мыслей» набирается гарнитурой Advent Pro, размер — 72 px, начертание — SemiBold. Описание приложения набирается Montserrat, размер —  24 px, начертание — Regular. Текстовые элементы должны сохранять читаемость при адаптации обложки под разные устройства.',

    'Размер носителя: основная обложка — 1920 × 643 px. Аватар — 200 × 200 px. Дополнительные обложки разделов —  376 × 256 px.'
  ].join('\n\n'),
  image: 'assets/images/carrier-13.png',
  layoutImage: 'assets/images/carrier-13-layout.png'
},

{
  title: 'Визитки психологов-партнеров',
  type: 'Внутренний носитель',
  text: [
    'Назначение: визитка психолога-партнёра — фирменный печатный носитель NUVIRA, предназначенный для представления специалиста и передачи контактной информации. Носитель помогает связать личную коммуникацию психолога с визуальной системой бренда.',

    'Дизайн: лицевая сторона визитки содержит имя специалиста, должность, контактные данные и фирменный знак NUVIRA. Знак размещается справа и работает как главный визуальный акцент. Оборотная сторона оформлена мягким фирменным паттерном и содержит QR-код с подписью «Приложение» для перехода в NUVIRA.',

    'Цветовое оформление: основа визитки выполнена в светлом фирменном оттенке. Для текста, QR-кода и графических элементов используется фирменный тёмно-синий цвет. Элементы фирменного знака сохраняют основную палитру NUVIRA: розовый, лавандовый, светлый бежевый и оранжевый акцент.',

    'Шрифтовое оформление: имя специалиста набирается гарнитурой Advent Pro, размер — 24 pt, начертание — SemiBold. Должность набирается Montserrat, размер — 16 pt, начертание — Regular. Контактная информация — Montserrat, размер — 16 pt, начертание — Regular.',

    'Размер носителя: 90 × 50 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-14.png',
  layoutImage: 'assets/images/carrier-14-layout.png'
},

{
  title: 'Фирменная ручка психолога-партнёра',
  type: 'Внутренний носитель',
  text: [
    'Назначение: фирменная ручка психолога-партнёра — компактный предметный носитель NUVIRA, предназначенный для ежедневного использования специалистом во время консультаций, встреч и работы с записями. Носитель поддерживает профессиональный, спокойный и аккуратный образ бренда.',

    'Дизайн: оформление ручки строится на минималистичном размещении фирменного знака в правой части корпуса. Знак используется без дополнительного текста, чтобы сохранить чистый внешний вид и не перегружать небольшой формат носителя. Основная поверхность ручки остаётся свободной.',

    'Цветовое оформление: основа ручки выполнена в светлом нейтральном оттенке. Фирменный знак сохраняет основные цвета NUVIRA: розовый, лавандовый, светлый бежевый и оранжевый акцент. Контурные элементы внутри знака выполняются фирменным тёмно-синим цветом.',

    'Шрифтовое оформление: текст на ручке не используется из-за малого размера зоны нанесения.',

    'Размер носителя: длина ручки — 150 мм, высота корпуса — 15 мм. Размер фирменного знака на корпусе — 10 × 10 мм.'
  ].join('\n\n'),
  image: 'assets/images/carrier-15.png',
  layoutImage: 'assets/images/carrier-15-layout.png'
},

 {
  title: 'Бейдж психолога-партнёра',
  type: 'Внутренний носитель',
  text: [
    'Назначение: бейдж психолога-партнёра — фирменный печатный носитель NUVIRA, предназначенный для идентификации специалиста на мероприятиях, консультациях, встречах и партнёрских активностях бренда. Носитель помогает аккуратно обозначить профессиональную роль психолога и визуально связать его с системой NUVIRA.',

    'Дизайн: композиция бейджа строится на имени специалиста, должности, фирменном знаке, маскоте и декоративных графических элементах. Имя и должность размещаются в верхней части слева, фирменный знак — в верхней части справа. Нижняя часть бейджа отведена под крупный фрагмент маскота, который создаёт дружелюбный и эмоциональный образ. Декоративные элементы поддерживают композицию и не должны мешать считыванию текста.',

    'Цветовое оформление: основа бейджа выполнена в светлом нейтральном оттенке. Для имени, должности, контура маскота и декоративной графики используется фирменный тёмно-синий цвет. Маскот сохраняет розовую заливку и светлые детали. Фирменный знак используется в основной цветовой версии с розовым, лавандовым, светлым бежевым и оранжевым акцентом.',

    'Шрифтовое оформление: имя специалиста набирается гарнитурой Advent Pro, размер — 24 pt, начертание — SemiBold. Должность «ведущий психолог» набирается Montserrat, размер — 16 pt, начертание — Regular. Текст должен оставаться хорошо читаемым с близкого расстояния.',

    'Размер носителя: 60 × 92 мм. '
  ].join('\n\n'),
  image: 'assets/images/carrier-16.png',
  layoutImage: 'assets/images/carrier-16-layout.png'
},

{
  title: 'Приложение NUVIRA',
  type: 'Носитель бренда',
  text: '',
  image: 'assets/images/carrier-17.png',
  layoutImage: '',
  fullGrid: true,
  noModal: true
}
];

const galleryGrid = $('#galleryGrid');
const carrierPrev = $('#carrierPrev');
const carrierNext = $('#carrierNext');
const carrierCounter = $('#carrierCounter');

const galleryModalType = $('#galleryModalType');
const galleryModalTitle = $('#galleryModalTitle');
const galleryModalText = $('#galleryModalText');
const galleryModalImage = $('#galleryModalImage');
const galleryToggleView = $('#galleryToggleView');
const galleryVariantSwitcher = $('#galleryVariantSwitcher');

let galleryPage = 0;
const galleryPerPage = 8;

let currentGalleryItem = null;
let currentGalleryView = 'carrier';
let currentGalleryVariantIndex = 0;

function updateGalleryModal() {
  if (!currentGalleryItem || !galleryModalImage || !galleryToggleView) return;

  const isLayout = currentGalleryView === 'layout';
  const currentVariant = currentGalleryItem.variants
    ? currentGalleryItem.variants[currentGalleryVariantIndex]
    : currentGalleryItem;

  galleryModalImage.src = isLayout
    ? currentVariant.layoutImage
    : currentVariant.image;

  galleryModalImage.alt = isLayout
    ? `Макет: ${currentGalleryItem.title}`
    : `Носитель: ${currentGalleryItem.title}`;

  galleryToggleView.textContent = isLayout
    ? 'Показать носитель'
    : 'Показать макет';

  if (galleryVariantSwitcher) {
    if (currentGalleryItem.variants) {
      galleryVariantSwitcher.hidden = false;

      galleryVariantSwitcher.innerHTML = currentGalleryItem.variants.map((variant, index) => `
        <button
          class="gallery-variant-button ${index === currentGalleryVariantIndex ? 'is-active' : ''}"
          type="button"
          data-gallery-variant="${index}"
          style="--variant-c:${variant.color}"
          aria-label="Показать вариант ${variant.name}"
        >
          ${variant.name}
        </button>
      `).join('');

      $$('.gallery-variant-button', galleryVariantSwitcher).forEach((button) => {
        button.addEventListener('click', () => {
          currentGalleryVariantIndex = Number(button.dataset.galleryVariant);
          updateGalleryModal();
        });
      });
    } else {
      galleryVariantSwitcher.hidden = true;
      galleryVariantSwitcher.innerHTML = '';
    }
  }
}

function openGalleryItem(index) {
  currentGalleryItem = galleryItems[index];
currentGalleryView = 'carrier';
currentGalleryVariantIndex = 0;

  if (!currentGalleryItem) return;

  if (galleryModalType) {
    galleryModalType.textContent = currentGalleryItem.type;
  }

  if (galleryModalTitle) {
    galleryModalTitle.textContent = currentGalleryItem.title;
  }

  if (galleryModalText) {
    galleryModalText.textContent = currentGalleryItem.text;
  }

  updateGalleryModal();
  openModal('galleryModal');
}

function renderGallery() {
  if (!galleryGrid) return;

  const start = galleryPage * galleryPerPage;
  const end = start + galleryPerPage;
  const visibleItems = galleryItems.slice(start, end);

  galleryGrid.innerHTML = visibleItems.map((item, index) => {
    const itemIndex = start + index;
    const cardClass = item.fullGrid
      ? 'gallery-card gallery-card-full'
      : 'gallery-card';

    return `
      <article class="${cardClass}" data-gallery-index="${itemIndex}">
        <div class="gallery-card-image">
          <img src="${item.image}" alt="${item.title}">
        </div>

        <h3>${item.title}</h3>
      </article>
    `;
  }).join('');

  if (carrierCounter) {
    carrierCounter.textContent = `${start + 1}–${Math.min(end, galleryItems.length)} из ${galleryItems.length}`;
  }

  $$('.gallery-card', galleryGrid).forEach((card) => {
    card.addEventListener('click', () => {
      const itemIndex = Number(card.dataset.galleryIndex);
      const item = galleryItems[itemIndex];

      if (item.noModal) return;

      openGalleryItem(itemIndex);
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

if (galleryToggleView) {
  galleryToggleView.addEventListener('click', () => {
    currentGalleryView = currentGalleryView === 'carrier' ? 'layout' : 'carrier';
    updateGalleryModal();
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

/* НАВИГАЦИЯ ПО ЯКОРЯМ — ФИКС ПЕРЕХОДА ВВЕРХ */

function closeMobileMenu() {
  if (!sidebar || !burger) return;

  sidebar.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}

function resetInnerScrolls(targetId) {
  const meaningScroll = document.querySelector('#meaning .meaning-scroll');

  if (meaningScroll) {
    meaningScroll.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }

  const graphics = document.querySelector('#graphics');

  if (graphics && targetId !== '#graphics') {
    graphics.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }
}

function getStableSectionTop(targetId) {
  if (targetId === '#cover') {
    return 0;
  }

  const target = document.querySelector(targetId);

  if (!target) return 0;

  const screens = Array.from(document.querySelectorAll('main > .screen'));

  let top = 0;

  for (const screen of screens) {
    if (screen === target) {
      return Math.max(0, top);
    }

    top += screen.offsetHeight;
  }

  return Math.max(0, window.scrollY + target.getBoundingClientRect().top);
}

function setActiveMenuLink(targetId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === targetId);
  });
}

function jumpToSection(targetId) {
  const target = document.querySelector(targetId);

  if (!target) return;

  closeMobileMenu();
  resetInnerScrolls(targetId);

  const targetTop = getStableSectionTop(targetId);

  window.scrollTo({
    top: targetTop,
    left: 0,
    behavior: 'auto'
  });

  /*
    Повторяем прокрутку после пересчёта sticky-экранов.
    Это важно именно для перехода из нижних блоков в верхние.
  */
  requestAnimationFrame(() => {
    window.scrollTo({
      top: targetTop,
      left: 0,
      behavior: 'auto'
    });
  });

  setTimeout(() => {
    window.scrollTo({
      top: targetTop,
      left: 0,
      behavior: 'auto'
    });

    if (targetId === '#meaning') {
      const meaningScroll = document.querySelector('#meaning .meaning-scroll');

      if (meaningScroll) {
        meaningScroll.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      }
    }

    setActiveMenuLink(targetId);

    if (typeof updateProgress === 'function') {
      updateProgress();
    }
  }, 80);

  history.pushState(null, '', targetId);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') return;
    if (!document.querySelector(targetId)) return;

    event.preventDefault();
    jumpToSection(targetId);
  });
});

/* ПОСТРОЕНИЕ */

const constructionData = {
logo: {
  title: 'Основная версия',
  description: 'Основная версия фирменного блока бренда NUVIRA. Используется в большинстве носителей и является главным вариантом визуальной идентичности.',
  buildDescription: 'На схеме обозначены основные пропорции элементов: фирменный знак вписан в квадрат 70×70 условных единиц, расстояние между знаком и логотипом составляет 3 условные единицы, высота логотипа — 17 условных единиц. Логотип набран шрифтом Advent Pro с межбуквенным интервалом 100%.',
  defaultImage: 'assets/images/construction-logo.png',
  buildImage: 'assets/images/construction-logo-build.png',
  alt: 'Логотип NUVIRA'
},
  sign: {
  title: 'Знак',
  description: 'Фирменный знак NUVIRA используется как самостоятельный элемент айдентики в компактных форматах. Знак состоит из четырёх округлых карточек с эмоциональными образами и передаёт идею бренда — «эмоции — это просто».',
  buildDescription: 'Фирменный знак построен на основе модульной сетки 2×2. В основе композиции лежат округлые карточки, окружности и направляющие, которые задают пропорции эмоциональных образов. Наклон диагональных элементов в правой нижней карточке составляет 45°.',
  defaultImage: 'assets/images/construction-sign.png',
  buildImage: 'assets/images/construction-sign-build.png',
  alt: 'Фирменный знак NUVIRA'
},
 icon: {
  title: 'Иконка',
  description: 'Иконка NUVIRA используется в digital-среде: как иконка мобильного приложения. В её основе — фирменный знак, размещённый внутри мягкой округлой формы.',
  buildDescription: 'Иконка построена на основе фирменного знака и округлого контейнера. Модульная сетка задаёт пропорции, центрирование и внутренние отступы, а направляющие помогают сохранить равномерное расположение элементов внутри формы.',
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
  constructionDescription.textContent =
  constructionMode === 'build' && data.buildDescription
    ? data.buildDescription
    : data.description;

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
    description: 'Минимальное расстояние вокруг логотипа равно модулю X - квадрат с магкими углами, который используется в фирменном знаке. В пределах охранного поля нельзя размещать текст, изображения, декоративные элементы или границы макета.',
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
    description: 'Основная версия логотипа используется на светлом фоне. Это обеспечивает максимальную читаемость и подходит для некоторых носителей бренда.',
    image: 'assets/images/logo-color-main.png',
    alt: 'Основная версия логотипа NUVIRA'
  },
  brand: {
    title: 'Фирменный цвет',
    description: 'На фирменных цветах логотип должен сохранять достаточный контраст. Поэтому в таких случаях он используется в фирменном темно синем цвете.',
    image: 'assets/images/logo-color-brand-blue.png',
    alt: 'Логотип NUVIRA на фирменном цвете'
  }
};

const brandColorData = {
  blue: {
    color: '#C9D2FD',
    image: 'assets/images/logo-color-brand-blue.png',
    alt: 'Логотип NUVIRA на светло-синем фирменном цвете'
  },
  lavender: {
    color: '#ECE8FF',
    image: 'assets/images/logo-color-brand-lavender.png',
    alt: 'Логотип NUVIRA на лавандовом фирменном цвете'
  },
  pink: {
    color: '#FDEDED',
    image: 'assets/images/logo-color-brand-pink.png',
    alt: 'Логотип NUVIRA на светло-розовом фирменном цвете'
  }
};

const colorVersionOptions = $$('.color-version-option');
const brandColorOptions = $$('.brand-color-option');
const brandColorSwitcher = $('#brandColorSwitcher');

const colorVersionImage = $('#colorVersionImage');
const colorVersionTitle = $('#colorVersionTitle');
const colorVersionDescription = $('#colorVersionDescription');

let currentColorVersion = 'main';
let currentBrandColor = 'blue';

function updateColorVersionView() {
  const versionData = colorVersionData[currentColorVersion];

  if (!versionData || !colorVersionImage || !colorVersionTitle || !colorVersionDescription) return;

 let image = versionData.image;
let alt = versionData.alt;
let backgroundColor = '';

if (currentColorVersion === 'brand') {
  const brandData = brandColorData[currentBrandColor];

  if (brandData) {
    image = brandData.image;
    alt = brandData.alt;
    backgroundColor = brandData.color;
  }
}

const colorVersionImageBox = document.querySelector('#logo-colors .color-version-image');

if (colorVersionImageBox) {
  colorVersionImageBox.style.backgroundColor = backgroundColor;
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
      currentBrandColor = 'blue';
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
    description: 'Фирменный паттерн используется как мягкий фоновый элемент. Он помогает создать спокойное, дружелюбное и узнаваемое настроение бренда NUVIRA. Используется в 3 представленных вариантах.',
    colors: {
      '#ECE8FF': {
        image: 'assets/images/pattern-1-ece8ff.png',
        alt: 'Фирменный паттерн NUVIRA на фоне #ECE8FF'
      },
      '#F7F8FC': {
        image: 'assets/images/pattern-1-f7f8fc.png',
        alt: 'Фирменный паттерн NUVIRA на фоне #F7F8FC'
      },
      '#C9D2FD': {
        image: 'assets/images/pattern-1-c9d2fd.png',
        alt: 'Фирменный паттерн NUVIRA на фоне #C9D2FD'
      }
    }
  },

  graphic: {
    title: 'Графический элемент',
    runner: 'assets/images/runner-3.svg',
    items: [
      {
        images: {
          '#FDEDED': 'assets/images/graphic-1-fdeded.png',
          '#ECE8FF': 'assets/images/graphic-1-ece8ff.png',
          '#F7F8FC': 'assets/images/graphic-1-f7f8fc.png',
          '#C9D2FD': 'assets/images/graphic-1-c9d2fd.png'
        },
        alt: 'Графический элемент NUVIRA 1',
        description: 'Первый графический элемент используется как поддерживающая форма в композиции. Он помогает выстраивать фирменную подачу и усиливает узнаваемость бренда. Примеры использования представлены на разных фирменных цветах.'
      },
      {
        images: {
          '#FDEDED': 'assets/images/graphic-2-fdeded.png',
          '#ECE8FF': 'assets/images/graphic-2-ece8ff.png',
          '#F7F8FC': 'assets/images/graphic-2-f7f8fc.png',
          '#C9D2FD': 'assets/images/graphic-2-c9d2fd.png'
        },
        alt: 'Графический элемент NUVIRA 2',
        description: 'Второй графический элемент добавляет композиции динамику и может использоваться в digital-носителях, презентациях и рекламных материалах за маскотом в качестве фонового элемента.'
      },
      {
        images: {
          '#FDEDED': 'assets/images/graphic-3-fdeded.png',
          '#ECE8FF': 'assets/images/graphic-3-ece8ff.png',
          '#F7F8FC': 'assets/images/graphic-3-f7f8fc.png',
          '#C9D2FD': 'assets/images/graphic-3-c9d2fd.png'
        },
        alt: 'Графический элемент NUVIRA 3',
        description: 'Третий графический элемент так же добавляет композиции динамику и может использоваться в digital-носителях, презентациях и рекламных материалах за маскотом в качестве фонового элемента.'
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

const graphicsModeColors = {
  patterns: ['#ECE8FF', '#F7F8FC', '#C9D2FD'],
  graphic: ['#FDEDED', '#ECE8FF', '#F7F8FC', '#C9D2FD']
};

const graphicsModes = $$('.graphics-mode');
const graphicsImage = $('#graphicsImage');
const graphicsTitle = $('#graphicsTitle');
const graphicsDescription = $('#graphicsDescription');
const graphicsPagination = $('#graphicsPagination');

const graphicsColorSwitcher = $('#graphicsColorSwitcher');
const graphicsColorOptions = $$('.graphics-color-option');
const graphicsImageBox = $('.graphics-image-box');

let currentGraphicsMode = 'patterns';
let currentGraphicsIndex = 0;
let currentGraphicsColor = '#F7F8FC';

const runnerHeight = 28;
const runnerStep = 24;

function getCurrentGraphicsSection() {
  return graphicsData[currentGraphicsMode];
}

function getCurrentGraphicsItems() {
  const section = getCurrentGraphicsSection();
  return section && Array.isArray(section.items) ? section.items : [];
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

  /*
    Сдвиг только белого кружка в разделе "Маскот".
    Дорожка и кликабельные точки остаются как были.
  */
const mascotThumbOffset = currentGraphicsMode === 'mascot' ? 0 : 0;
const mascotThumbStep = 24;

const thumbLeft =
  runnerHeight / 2 +
  (currentGraphicsMode === 'mascot' ? mascotThumbStep : runnerStep) * currentGraphicsIndex +
  mascotThumbOffset;

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

  if (!section || !graphicsImage || !graphicsTitle || !graphicsDescription) return;

  const allowedColors = graphicsModeColors[currentGraphicsMode] || [];
  const hasColorSwitcher = allowedColors.length > 0;

  if (hasColorSwitcher && !allowedColors.includes(currentGraphicsColor)) {
    currentGraphicsColor = allowedColors.includes('#F7F8FC')
      ? '#F7F8FC'
      : allowedColors[0];
  }

  let image = '';
  let alt = '';
  let description = section.description || '';

  if (currentGraphicsMode === 'patterns') {
    const patternVariant = section.colors[currentGraphicsColor];

    if (!patternVariant) return;

    image = patternVariant.image;
    alt = patternVariant.alt;
  } else {
    const items = getCurrentGraphicsItems();

    if (!items.length) return;

    if (currentGraphicsIndex > items.length - 1) {
      currentGraphicsIndex = 0;
    }

    const currentItem = items[currentGraphicsIndex];

    if (currentGraphicsMode === 'graphic') {
      image = currentItem.images[currentGraphicsColor];
      alt = currentItem.alt;
      description = currentItem.description;
    } else {
      image = currentItem.image;
      alt = currentItem.alt || section.title;
      description = section.description || currentItem.description || '';
    }
  }

  graphicsImage.style.opacity = '0';

  setTimeout(() => {
    graphicsImage.src = image;
    graphicsImage.alt = alt;
    graphicsImage.style.opacity = '1';
  }, 160);

  graphicsTitle.textContent = section.title;
  graphicsDescription.textContent = description;

  graphicsModes.forEach((button) => {
    button.classList.toggle(
      'is-active',
      button.dataset.graphicsMode === currentGraphicsMode
    );
  });

  if (graphicsColorSwitcher) {
    graphicsColorSwitcher.hidden = !hasColorSwitcher;
  }

  graphicsColorOptions.forEach((button) => {
    const buttonColor = button.dataset.graphicsColor;
    const isAllowed = allowedColors.includes(buttonColor);

    button.hidden = !isAllowed;
    button.classList.toggle('is-active', buttonColor === currentGraphicsColor);
  });

  if (graphicsImageBox) {
    if (hasColorSwitcher) {
      graphicsImageBox.style.setProperty(
        'background-color',
        currentGraphicsColor,
        'important'
      );
    } else {
      graphicsImageBox.style.removeProperty('background-color');
    }
  }

  renderGraphicsRunner();
}

graphicsModes.forEach((button) => {
  button.addEventListener('click', () => {
    currentGraphicsMode = button.dataset.graphicsMode;
    currentGraphicsIndex = 0;
    updateGraphicsView();
  });
});

graphicsColorOptions.forEach((button) => {
  button.addEventListener('click', () => {
    currentGraphicsColor = button.dataset.graphicsColor;
    updateGraphicsView();
  });
});

updateGraphicsView();


/* ТИПОГРАФИКА — переключение шрифта по клику на плашку */

const fontCards = document.querySelectorAll('#typography .font-card');
const typePreviewLabel = document.querySelector('#typography .type-preview-surface .type-label');

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

      if (typePreviewLabel) {
        typePreviewLabel.textContent = 'Body';
      }
    }

    if (fontName === 'Advent Pro') {
      typePreview.style.fontFamily = '"Advent Pro", sans-serif';
      typePreview.style.fontWeight = '600';
      typePreview.style.letterSpacing = '-0.035em';

      if (typePreviewLabel) {
        typePreviewLabel.textContent = 'Display';
      }
    }
  });
});

/* UI KIT — переключение светлой / тёмной палитры только в карточке цветов */

const uiColorPaletteCard = document.getElementById('uiColorPaletteCard');
const uiColorThemeToggle = document.getElementById('uiColorThemeToggle');

if (uiColorPaletteCard && uiColorThemeToggle) {
  uiColorThemeToggle.addEventListener('click', () => {
    const isDarkPalette = uiColorPaletteCard.classList.toggle('is-dark-palette');

    uiColorThemeToggle.setAttribute('aria-pressed', String(isDarkPalette));
    uiColorThemeToggle.textContent = isDarkPalette ? 'Светлая тема' : 'Тёмная тема';

    uiColorPaletteCard.querySelectorAll('.swatch').forEach((swatch) => {
      const nextHex = isDarkPalette
        ? swatch.dataset.darkHex
        : swatch.dataset.lightHex;

      if (nextHex) {
        swatch.dataset.hex = nextHex;
      }
    });
  });
}

/* БОКОВОЕ МЕНЮ — ВЫПАДАЮЩИЕ СПИСКИ */

function setTocDropdownState(dropdown, isOpen) {
  const button = dropdown.querySelector('.toc-dropdown-toggle');
  const submenu = dropdown.querySelector('.toc-submenu');

  if (!button || !submenu) return;

  dropdown.classList.toggle('is-open', isOpen);
  button.setAttribute('aria-expanded', String(isOpen));
  submenu.hidden = !isOpen;
}

document.querySelectorAll('.toc-dropdown').forEach((dropdown) => {
  const button = dropdown.querySelector('.toc-dropdown-toggle');

  if (!button) return;

  button.addEventListener('click', () => {
    const isOpen = dropdown.classList.contains('is-open');
    setTocDropdownState(dropdown, !isOpen);
  });
});

/*
  Если активный пункт находится внутри выпадающего списка,
  список автоматически раскрывается.
*/
const tocActiveObserver = new MutationObserver(() => {
  document.querySelectorAll('.toc-dropdown').forEach((dropdown) => {
    const hasActiveChild = Boolean(dropdown.querySelector('.toc-submenu a.active'));

    if (hasActiveChild) {
      setTocDropdownState(dropdown, true);
    }
  });
});

document.querySelectorAll('.toc a').forEach((link) => {
  tocActiveObserver.observe(link, {
    attributes: true,
    attributeFilter: ['class']
  });
});
/* ГРАФИКА И ФОТОСТИЛЬ — свайп фото на мобильной версии */

let graphicsTouchStartX = 0;
let graphicsTouchStartY = 0;

if (graphicsImageBox) {
  graphicsImageBox.addEventListener('touchstart', (event) => {
    if (window.innerWidth > 820) return;

    const touch = event.touches[0];

    graphicsTouchStartX = touch.clientX;
    graphicsTouchStartY = touch.clientY;
  }, { passive: true });

  graphicsImageBox.addEventListener('touchend', (event) => {
    if (window.innerWidth > 820) return;

    const items = getCurrentGraphicsItems();

    if (!items || items.length <= 1) return;

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - graphicsTouchStartX;
    const deltaY = touch.clientY - graphicsTouchStartY;

    if (Math.abs(deltaX) < 45) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < 0) {
      currentGraphicsIndex =
        currentGraphicsIndex >= items.length - 1 ? 0 : currentGraphicsIndex + 1;
    } else {
      currentGraphicsIndex =
        currentGraphicsIndex <= 0 ? items.length - 1 : currentGraphicsIndex - 1;
    }

    updateGraphicsView();
  }, { passive: true });
}

/* ГРАФИКА И ФОТОСТИЛЬ — короткая карточка на мобильной для Маскота и Фотостиля */

function updateShortGraphicsMobileCard() {
  const graphicsCard = document.querySelector('#graphics .graphics-showcase-card');
  const activeGraphicsButton = document.querySelector('#graphics .graphics-mode.is-active');

  if (!graphicsCard || !activeGraphicsButton) return;

  const mode = activeGraphicsButton.dataset.graphicsMode;

  graphicsCard.classList.toggle(
    'is-short-mobile-graphics-card',
    mode === 'mascot' || mode === 'photo'
  );
}

document.querySelectorAll('#graphics .graphics-mode').forEach((button) => {
  button.addEventListener('click', () => {
    setTimeout(updateShortGraphicsMobileCard, 50);
  });
});

updateShortGraphicsMobileCard();

/* UI KIT — открытие фото полностью на мобильной версии */

const imagePreviewModal = document.getElementById('imagePreviewModal');
const imagePreviewModalImg = document.getElementById('imagePreviewModalImg');

const zoomableUiImages = document.querySelectorAll(`
  #ui-grid .uikit-grid-image-card img,
  #ui-buttons .uikit-buttons-image img,
  #ui-dropdowns .uikit-dropdowns-image img,
  #ui-tabs-checkboxes .uikit-photo-card-image img,
  #ui-cards .uikit-photo-card-image img,
  #ui-modals .uikit-photo-card-image img
`);

zoomableUiImages.forEach((image) => {
  image.addEventListener('click', () => {
    if (window.innerWidth > 820) return;
    if (!imagePreviewModal || !imagePreviewModalImg) return;

    imagePreviewModalImg.src = image.src;
    imagePreviewModalImg.alt = image.alt || '';

    imagePreviewModal.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});
