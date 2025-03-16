import { authService } from '../services/authService.js';
import NotificationSystem from '../components/NotificationSystem.js';

// Estado global do header
const HeaderState = {
  currentTheme: localStorage.getItem('theme') || 'dark',
  isMenuOpen: false,
  lastScrollPosition: 0,
  searchQuery: '',
  
  init() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  },
  
  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    NotificationSystem.success(`Tema ${theme === 'dark' ? 'escuro' : 'claro'} ativado`);
  },
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    return this.isMenuOpen;
  }
};

class HeaderManager {
  constructor() {
    this.elements = {
      header: null,
      mobileMenuBtn: null,
      nav: null,
      themeToggle: null,
      searchInput: null
    };
    
    this.mediaQuery = window.matchMedia('(max-width: 768px)');
  }

  // Inicialização principal
  async initialize() {
    try {
      await this.injectHeader();
      this.cacheElements();
      this.setupEventListeners();
      this.handleResponsive();
      this.addScrollBehavior();
      HeaderState.init();
    } catch (error) {
      console.error('Falha na inicialização do header:', error);
      NotificationSystem.error('Erro ao carregar o cabeçalho');
    }
  }

  // Injeta o header no DOM
  async injectHeader() {
    const headerHTML = await this.fetchHeaderTemplate();
    const parser = new DOMParser();
    const doc = parser.parseFromString(headerHTML, 'text/html');
    
    this.elements.header = doc.querySelector('.site-header');
    document.getElementById('header')?.replaceWith(this.elements.header);
  }

  // Busca o template do header
  async fetchHeaderTemplate() {
    try {
      const response = await fetch('/components/header.html');
      return await response.text();
    } catch (error) {
      return this.getFallbackHeader();
    }
  }

  // Template de fallback
  getFallbackHeader() {
    return `
      <header class="site-header">
        <div class="header-container">
          <div class="header-left">
            <a href="/" class="logo">NextSakura</a>
          </div>
        </div>
      </header>
    `;
  }

  // Cache de elementos
  cacheElements() {
    this.elements.mobileMenuBtn = this.elements.header.querySelector('.mobile-menu-btn');
    this.elements.nav = this.elements.header.querySelector('.header-nav');
    this.elements.themeToggle = this.elements.header.querySelector('.theme-toggle');
    this.elements.searchInput = this.elements.header.querySelector('#header-search');
  }

  // Configura eventos
  setupEventListeners() {
    this.elements.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
    this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    window.addEventListener('resize', () => this.handleResponsive());
  }

  // Menu mobile
  toggleMobileMenu() {
    const isOpen = HeaderState.toggleMenu();
    this.elements.header.classList.toggle('menu-active', isOpen);
    this.elements.nav?.classList.toggle('active', isOpen);
    
    if (isOpen) {
      this.animateMenuItems();
    }
  }

  // Animação dos itens do menu
  animateMenuItems() {
    const items = this.elements.nav?.querySelectorAll('a');
    items?.forEach((item, index) => {
      item.style.animation = `menuItemFade 0.3s ease forwards ${index * 0.1}s`;
    });
  }

  // Alternância de tema
  toggleTheme() {
    const newTheme = HeaderState.currentTheme === 'dark' ? 'light' : 'dark';
    HeaderState.setTheme(newTheme);
    this.updateThemeIcon(newTheme);
  }

  // Atualiza ícone do tema
  updateThemeIcon(theme) {
    const icon = this.elements.themeToggle.querySelector('i');
    icon.className = `fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => icon.style.transform = '', 500);
  }

  // Comportamento de scroll
  addScrollBehavior() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const scrollDelta = currentScroll - lastScroll;
      
      if (currentScroll > 100 && scrollDelta > 0) {
        this.elements.header.classList.add('header-hidden');
      } else {
        this.elements.header.classList.remove('header-hidden');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Clique externo
  handleOutsideClick(e) {
    if (!this.elements.header.contains(e.target) && HeaderState.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  // Responsividade
  handleResponsive() {
    if (!this.mediaQuery.matches && HeaderState.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  const headerManager = new HeaderManager();
  headerManager.initialize();
});

// Export para uso externo
export const headerService = {
  getCurrentTheme: () => HeaderState.currentTheme,
  toggleTheme: () => HeaderState.toggleTheme()
};