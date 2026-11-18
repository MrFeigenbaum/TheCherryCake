import { Link } from 'react-router-dom';
import './Layout.css';

export default function Footer() {
  return (
    <footer className="cc-footer" id="about-section">
      <div className="cc-footer-inner cc-footer-columns">
        {/* Column 1: Brand & Philosophy */}
        <div className="cc-footer-col cc-footer-brand-col">
          <div className="cc-footer-brand">
            <img
              src="/TransparentSakuraFlower.png"
              alt="Cherry Cake Blossom"
              className="cc-footer-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h3 className="cc-footer-brand-title">Cherry Cake</h3>
              <span className="cc-footer-brand-subtitle">Haute Pâtisserie &amp; Café</span>
            </div>
          </div>
          <p className="cc-footer-desc">
            Celebrating the harmony between classic French viennoiserie and delicate Japanese cherry blossom
            botanicals. Handcrafted daily with single-origin butter and premium Belgian cocoa.
          </p>
          <div className="cc-footer-badges">
            <span className="cc-footer-pill">🌸 Fresh Daily</span>
            <span className="cc-footer-pill">🍰 Artisanal Recipes</span>
            <span className="cc-footer-pill">☕ Specialty Roasts</span>
          </div>
        </div>

        {/* Column 2: Artisan Menu */}
        <div className="cc-footer-col">
          <h4 className="cc-footer-heading">Artisan Menu</h4>
          <ul className="cc-footer-links">
            <li><Link to="/menu">Cherry Blossom Heart Gateau</Link></li>
            <li><Link to="/menu">Triple Berry Gumdrop Heart</Link></li>
            <li><Link to="/menu">Golden Vanilla Fudge Heart</Link></li>
            <li><Link to="/menu">Smiley Berry Artisan Square</Link></li>
            <li><Link to="/menu">Sweetheart Chocolate Petite</Link></li>
            <li><Link to="/menu">Lucky Clover Chocolate Gateau</Link></li>
          </ul>
        </div>

        {/* Column 3: Hospitality & Hours */}
        <div className="cc-footer-col">
          <h4 className="cc-footer-heading">Café &amp; Hospitality</h4>
          <ul className="cc-footer-hours">
            <li><span>Mon - Fri:</span> <strong>08:00 - 22:00</strong></li>
            <li><span>Sat - Sun:</span> <strong>09:00 - 23:00</strong></li>
            <li><span>Hub Pickup:</span> <strong>Daily 08:30 - 21:30</strong></li>
          </ul>
          <div style={{ marginTop: '14px' }}>
            <Link to="/menu" className="cc-footer-btn">
              <span>Order Online Now &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Column 4: Client & Portals */}
        <div className="cc-footer-col">
          <h4 className="cc-footer-heading">Client &amp; Information</h4>
          <ul className="cc-footer-links">
            <li><Link to="/reports">Quality &amp; Sales Reports</Link></li>
            <li><Link to="/ui-kit">Design System &amp; UI Kit</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>
      </div>

      {/* Sub-footer copyright */}
      <div className="cc-footer-bottom">
        <div className="cc-footer-inner cc-footer-bottom-inner">
          <p className="cc-footer-copy">
            &copy; 2026 Cherry Cake Bakery &amp; Café. All rights reserved. &bull; Haute Pâtisserie &amp; Specialty Confectionery.
          </p>
          <div className="cc-footer-bottom-links">
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/ui-kit">UI Kit</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
