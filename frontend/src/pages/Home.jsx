import React from 'react';
import Menu from './Menu';

export function Home() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 1. HERO / WELCOME SECTION (matching Swagger Portal Landing 1:1) */}
      <section className="hero" id="hero">
        <div className="blossom-emblem-wrap">
          <div className="blossom-glow-ring"></div>
          <div className="blossom-card">
            <img
              src="/TransparentSakuraFlower.png"
              alt="Cherry Cake Blossom Logo"
            />
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-pretitle">ITP UZ TEAM 9 &bull; CONFECTIONERY &amp; CAFÉ PLATFORM</div>
          <h1 className="hero-title script-font" style={{ fontFamily: "'Parisienne', cursive", fontSize: 'clamp(3.4rem, 7.5vw, 5.6rem)', color: '#FFFFFF', textShadow: '0 4px 30px rgba(230, 57, 96, 0.45)', margin: '0 0 4px 0', lineHeight: 1.1 }}>
            Cherry Cake
          </h1>
          <span className="hero-script display-font" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: 'var(--sakura-pink)', fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.04em', display: 'block', margin: '0 0 28px 0' }}>
            Bakery &amp; Café
          </span>
          <div className="hero-actions">
            <a
              href="/swagger.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              data-testid="explore-swagger-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Explore Swagger API</span>
            </a>
            <a
              href="/api/v1/catalog/regions"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              data-testid="regions-api-btn"
            >
              GET /api/v1/catalog/regions
            </a>
          </div>
        </div>
      </section>

      {/* 2. ARTISAN MENU STOREFRONT SECTION */}
      <section id="storefront-section">
        <Menu />
      </section>
    </div>
  );
}

export default Home;
