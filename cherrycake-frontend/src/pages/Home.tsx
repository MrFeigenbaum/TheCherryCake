import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

import heroCake from "../assets/hero-cake.png";
import treatCoffee from "../assets/treat-coffee.png";
import treatChocolate from "../assets/treat-chocolate.png";
import treatVanilla from "../assets/treat-vanilla.png";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="cc-home-container">
      {/* 1. Hero Banner */}
      <section className="cc-home-hero" aria-label="Welcome and hero banner">
        <div className="cc-hero-left">
          <div className="cc-hero-tag">
            <span>✨</span> Artisan Bakery &amp; Confectionery
          </div>

          <h1 className="cc-hero-title">
            Sweet Moments
            <span className="cc-hero-title-accent">Start Here</span>
          </h1>

          <p className="cc-eyebrow" style={{ margin: "4px 0" }}>
            Welcome to Cherry Cake
          </p>

          <p className="cc-hero-subtitle">
            Handcrafted artisan cakes, delicate pastries, and velvety desserts baked fresh every morning.
            We use only 100% natural cream, fresh seasonal berries, and the finest Belgian chocolate to bring
            sweet joy to every occasion.
          </p>

          <div className="cc-hero-actions">
            <Button
              type="button"
              onClick={() => navigate("/menu")}
              className="cc-hero-primary-btn"
            >
              View Menu &rarr;
            </Button>

            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="cc-hero-secondary-link"
            >
              Explore Flavors
            </button>
          </div>

          <div className="cc-hero-perks">
            <div className="cc-hero-perk-item">
              <span className="cc-hero-perk-icon">🍓</span>
              <span>Real Berries &amp; Pure Cream</span>
            </div>
            <div className="cc-hero-perk-item">
              <span className="cc-hero-perk-icon">⏰</span>
              <span>Baked Fresh Daily</span>
            </div>
            <div className="cc-hero-perk-item">
              <span className="cc-hero-perk-icon">🚚</span>
              <span>Express Regional Delivery</span>
            </div>
          </div>
        </div>

        <div className="cc-hero-right">
          <div className="cc-hero-image-wrap">
            <img
              src={heroCake}
              alt="Artisan Strawberry Charlotte Cake"
              className="cc-hero-cake-img"
              loading="eager"
            />

            <div className="cc-hero-floating-badge">
              <span>🍰</span>
              <span>Signature Strawberry Cake</span>
            </div>

            <div className="cc-hero-rating-badge">
              <span className="cc-rating-star">★</span>
              <span>4.9 (1,200+ reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Treats Preview ("Holde a cake" from reference) */}
      <section className="cc-home-featured" aria-label="Featured confections">
        <div className="cc-section-header">
          <h2 className="cc-section-title">Our Signature Creations</h2>
          <p className="cc-section-subtitle">
            Take a sneak peek into our bestsellers before diving into the complete regional menu.
          </p>
        </div>

        <div className="cc-featured-grid">
          {/* Card 1: Coffee & Beverages */}
          <div
            className="cc-treat-card"
            onClick={() => navigate("/menu")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/menu")}
          >
            <div className="cc-treat-image-wrap">
              <img
                src={treatCoffee}
                alt="Velvet Latte & Specialty Brews"
                className="cc-treat-img"
                loading="lazy"
              />
            </div>
            <div className="cc-treat-body">
              <h3 className="cc-treat-title">Specialty Coffee &amp; Latte</h3>
              <p className="cc-treat-desc">
                Freshly roasted single-origin Arabica beans paired with silky steamed milk and subtle notes of caramel.
              </p>
              <span className="cc-treat-link">
                View in Menu &rarr;
              </span>
            </div>
          </div>

          {/* Card 2: Chocolate Truffle Cake */}
          <div
            className="cc-treat-card"
            onClick={() => navigate("/menu")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/menu")}
          >
            <div className="cc-treat-image-wrap">
              <img
                src={treatChocolate}
                alt="Artisan Chocolate Truffle Cake"
                className="cc-treat-img"
                loading="lazy"
              />
            </div>
            <div className="cc-treat-body">
              <h3 className="cc-treat-title">Chocolate Truffle Cake</h3>
              <p className="cc-treat-desc">
                Decadent multi-layered Belgian chocolate biscuit layered with velvety dark ganache and fresh forest berries.
              </p>
              <span className="cc-treat-link">
                View in Menu &rarr;
              </span>
            </div>
          </div>

          {/* Card 3: Honey & Vanilla Slices */}
          <div
            className="cc-treat-card"
            onClick={() => navigate("/menu")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/menu")}
          >
            <div className="cc-treat-image-wrap">
              <img
                src={treatVanilla}
                alt="Golden Honey & Vanilla Cake Slices"
                className="cc-treat-img"
                loading="lazy"
              />
            </div>
            <div className="cc-treat-body">
              <h3 className="cc-treat-title">Golden Honey &amp; Cream</h3>
              <p className="cc-treat-desc">
                Tender golden honey-infused sponge layers paired with light sour cream mousse and delicate crumb topping.
              </p>
              <span className="cc-treat-link">
                View in Menu &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Pillars (Quality & Craft) */}
      <section className="cc-home-pillars" aria-label="Bakery standards">
        <div className="cc-pillar-item">
          <div className="cc-pillar-icon-box">🌾</div>
          <h3 className="cc-pillar-title">Pure Natural Ingredients</h3>
          <p className="cc-pillar-desc">
            We use only farm-fresh butter, organic flour, and authentic fruit purees with zero artificial additives.
          </p>
        </div>

        <div className="cc-pillar-item">
          <div className="cc-pillar-icon-box">🧁</div>
          <h3 className="cc-pillar-title">Freshly Baked Every Morning</h3>
          <p className="cc-pillar-desc">
            Every cake is baked and assembled in small batches each day so that you experience the peak of flavor and tenderness.
          </p>
        </div>

        <div className="cc-pillar-item">
          <div className="cc-pillar-icon-box">💝</div>
          <h3 className="cc-pillar-title">Customized For Your Event</h3>
          <p className="cc-pillar-desc">
            Personalize your order with regional modifiers, chocolate plaques, extra berries, or gift boxes right in your cart.
          </p>
        </div>
      </section>

      {/* 4. Bottom Promotional Callout */}
      <section className="cc-home-promo-banner" aria-label="Menu callout">
        <div className="cc-promo-left">
          <h2 className="cc-promo-title">Ready for something sweet?</h2>
          <p className="cc-promo-text">
            Explore our complete seasonal collection with regional prices, customizable toppings, and automated discounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/menu")}
          className="cc-promo-btn"
        >
          Open Full Menu &rarr;
        </button>
      </section>
    </div>
  );
}
