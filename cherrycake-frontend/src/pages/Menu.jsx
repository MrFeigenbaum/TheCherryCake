import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, getCategories, getProductById } from '../api/products';
import { addItem } from '../store/cartSlice';
import { openCustomCake, openCartDrawer, showToast } from '../store/uiSlice';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ReserveTableBanner from '../components/common/ReserveTableBanner';
import { MOCK_PRODUCTS } from '../mocks/products.mock';
import { RATES_PER_CU } from '../store/regionSlice';

export function formatVatRate(val) {
  if (val === undefined || val === null) return '12.0%';
  let num = parseFloat(val);
  if (num < 1 && num > 0) num = num * 100;
  return `${num.toFixed(1)}%`;
}

export function formatCardPrice(amount, symbol = "so'm") {
  const num = parseFloat(amount) || 0;
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
}

const MODIFIER_TRANSLATIONS = {
  'Размер торта': 'Dessert Size',
  'Размер десерта': 'Dessert Size',
  'Дополнения': 'Add-ons',
  'Дополнительные опции': 'Add-ons',
  'Молоко': 'Milk Choice',
  'Стандартный (1 кг)': 'Standard (1 kg) — included',
  'Большой (2 кг)': 'Celebration Tier (2 kg)',
  'Большой праздничный (2 кг)': 'Celebration Tier (2 kg)',
  'Экстра вишня': 'Extra Candied Cherries',
  'Экстра-порция вишни': 'Extra Candied Cherries',
  'Праздничная свеча': 'Artisan Celebration Candle',
  'Набор праздничных свечей': 'Artisan Celebration Candle',
  'Овсяное молоко': 'Oat Milk',
  'Миндальное молоко': 'Almond Milk'
};

function translateModifierName(name) {
  return MODIFIER_TRANSLATIONS[name] || name;
}

export function Menu() {
  const dispatch = useDispatch();
  const regionCode = useSelector((state) => state.region.code);
  const currencyCode = useSelector((state) => state.region.currencyCode);
  const regions = useSelector((state) => state.region.regions);
  const currentRegion = regions.find((r) => r.code === regionCode) || {
    name: 'Uzbekistan',
    code: 'UZB',
    currencySymbol: "so'm",
    currencyCode: 'UZS',
    vatRate: 12.0
  };

  const currencySymbol = currentRegion.currencySymbol || currentRegion.currencyCode || currencyCode || "so'm";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active product modal states
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeModifierGroups, setActiveModifierGroups] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getCategories().catch(() => [
        { id: 'all', name: 'All Delicacies' },
        { id: 'sig', name: 'Signature Cakes' },
        { id: 'art', name: 'Artisan Cakes' },
        { id: 'cls', name: 'Classic Cakes' }
      ]),
      getProducts({ region: regionCode, categoryId: selectedCategory || undefined }).catch(() => [])
    ]).then(([cats, prods]) => {
      if (isMounted) {
        setCategories(
          cats && cats.length > 0
            ? cats
            : [
                { id: 'all', name: 'All Delicacies' },
                { id: 'sig', name: 'Signature Cakes' },
                { id: 'art', name: 'Artisan Cakes' },
                { id: 'cls', name: 'Classic Cakes' }
              ]
        );
        const list = prods && prods.length > 0 ? prods : MOCK_PRODUCTS;
        setProducts(list);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [regionCode, selectedCategory]);

  const filteredProducts =
    selectedCategory && selectedCategory !== 'all'
      ? products.filter(
          (p) =>
            p.categoryName?.toLowerCase() === selectedCategory.toLowerCase() ||
            p.categoryId === selectedCategory
        )
      : products;

  // Build default artisan modifier groups if none exist on product
  const getProductModifierGroups = (product, basePrice) => {
    let rawGroups = product.modifierGroups || [];
    if (rawGroups.length === 0 && product.modifiers && product.modifiers.length > 0) {
      rawGroups = [
        {
          id: 1,
          name: 'Add-ons',
          type: 'MULTI',
          isRequired: false,
          modifiers: product.modifiers
        }
      ];
    }

    if (rawGroups.length > 0) {
      return rawGroups.map((g) => ({
        ...g,
        name: translateModifierName(g.name),
        modifiers: (g.modifiers || []).map((m) => ({
          ...m,
          name: translateModifierName(m.name)
        }))
      }));
    }

    // Default cake artisan modifiers (matching Image 9 1:1)
    const largeDelta = Math.round(basePrice * 0.4);
    const cherryDelta = currentRegion.currencyCode === 'UZS' ? 15000 : Math.round(basePrice * 0.08);
    const candleDelta = currentRegion.currencyCode === 'UZS' ? 5000 : Math.round(basePrice * 0.03);

    return [
      {
        id: 'size_group',
        name: 'Dessert Size',
        type: 'SINGLE',
        isRequired: true,
        modifiers: [
          {
            id: 'size_std',
            name: 'Standard (1 kg) — included',
            priceDelta: 0
          },
          {
            id: 'size_large',
            name: 'Large (2 kg)',
            priceDelta: largeDelta
          }
        ]
      },
      {
        id: 'addons_group',
        name: 'Add-ons',
        type: 'MULTI',
        isRequired: false,
        modifiers: [
          {
            id: 'addon_cherry',
            name: 'Extra Cherry',
            priceDelta: cherryDelta
          },
          {
            id: 'addon_candle',
            name: 'Celebration Candle',
            priceDelta: candleDelta
          }
        ]
      }
    ];
  };

  const getProductPrice = (p) => {
    if (!p) return 0;
    const rawPrice =
      p.price !== undefined
        ? p.price
        : p.regionalPrices?.[regionCode]?.price || 0;
    if (p.price !== undefined && !p.regionalPrices) {
      const rate = currentRegion.exchangeRate || RATES_PER_CU[currencyCode] || 3000;
      return Math.round((rawPrice / 3000) * rate * 100) / 100;
    }
    return rawPrice;
  };

  const openProductModal = (product) => {
    const basePrice = getProductPrice(product);

    const groups = getProductModifierGroups(product, basePrice);
    setActiveProduct(product);
    setActiveModifierGroups(groups);
    setQuantity(1);

    // Initial default modifiers
    const initialMods = {};
    groups.forEach((grp) => {
      if (grp.type === 'SINGLE' && grp.modifiers && grp.modifiers.length > 0) {
        const first = grp.modifiers[0];
        initialMods[first.id || first.name] = first;
      }
    });
    setSelectedModifiers(initialMods);

    // Asynchronously fetch full product detail if available
    getProductById(product.id, { region: regionCode })
      .then((detail) => {
        if (detail && detail.modifierGroups && detail.modifierGroups.length > 0) {
          const loadedGroups = getProductModifierGroups(detail, basePrice);
          setActiveModifierGroups(loadedGroups);
        }
      })
      .catch(() => {});
  };

  const handleAddCustomized = () => {
    if (!activeProduct) return;
    const basePrice = getProductPrice(activeProduct);
    const modTotal = Object.values(selectedModifiers).reduce(
      (sum, val) => sum + (val.priceDelta || 0),
      0
    );
    const unitPrice = basePrice + modTotal;

    dispatch(
      addItem({
        productId: activeProduct.id,
        name: activeProduct.name,
        unitPrice,
        quantity,
        imageUrl: activeProduct.imageUrl,
        modifiers: Object.values(selectedModifiers).map((m) => m.name)
      })
    );

    dispatch(showToast({ type: 'success', message: `${activeProduct.name} added to your bag!` }));
    setActiveProduct(null);
    dispatch(openCartDrawer());
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--space-7) var(--space-4)' }}>
      {/* Menu Header Section */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--sakura-pink)',
            fontWeight: 700,
            display: 'block',
            marginBottom: 'var(--space-2)'
          }}
        >
          Artisanal Pâtisserie &amp; Café
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--cheesecake-cream)',
            marginBottom: 'var(--space-2)'
          }}
        >
          Handcrafted Delicacies
        </h2>
        <p
          style={{
            color: 'var(--text-dim)',
            maxWidth: '600px',
            margin: '0 auto var(--space-4)',
            fontSize: 'var(--font-size-md)'
          }}
        >
          Freshly baked morning viennoiserie, multi-layered celebration cakes, and specialty barista roasts.
        </p>

        {/* Territory Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(45, 14, 36, 0.7)',
            border: '2px solid var(--cherry-border)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-dim)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          <span>Active Territory:</span>
          <strong style={{ color: 'var(--sakura-pink)' }}>
            {currentRegion.name} ({currentRegion.code})
          </strong>
          <span>•</span>
          <span>
            Currency: <strong style={{ color: 'var(--crust-gold)' }}>{currencySymbol}</strong>
          </span>
          <span>•</span>
          <span
            style={{
              backgroundColor: 'rgba(56, 193, 114, 0.2)',
              color: 'var(--mint-fresh)',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 600,
              border: '1px solid rgba(56, 193, 114, 0.4)'
            }}
          >
            {formatVatRate(currentRegion.vatRate)} Legal VAT
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-6)'
        }}
      >
        {categories.map((cat) => {
          const isSelected =
            selectedCategory === cat.id ||
            (!selectedCategory && cat.id === 'all');
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: isSelected ? '2px solid var(--raspberry-coulis)' : '2px solid var(--cherry-border)',
                backgroundColor: isSelected ? 'var(--raspberry-coulis)' : 'var(--cherry-card)',
                color: isSelected ? '#FFFFFF' : 'var(--text-dim)',
                fontWeight: 600,
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? '0 4px 16px rgba(230, 57, 96, 0.4)' : 'none'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Bespoke Studio Banner */}
      <div
        id="bespoke-custom-cake"
        style={{
          background: 'var(--cherry-card)',
          border: '2px solid var(--cherry-border-glow)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          boxShadow: '0 4px 20px rgba(230, 57, 96, 0.15)'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--sakura-pink)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '4px'
            }}
          >
            ✦ BESPOKE STUDIO
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--cheesecake-cream)',
              marginBottom: '4px'
            }}
          >
            Order a Handcrafted Custom Cake
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Pick your cake shape (Heart, Round, Square), sponge flavor, cream filling, glaze topping &amp; accessories with live 1–3 tier pricing!
          </p>
        </div>
        <button
          type="button"
          className="btn-checkout"
          style={{ width: 'auto', padding: '12px 24px', fontSize: '0.95rem' }}
          onClick={() => dispatch(openCustomCake())}
        >
          Design Your Cake 🎂
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Loader size="lg" label="Loading artisan delicacies..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No delicacies found in this category" />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-5)',
            marginBottom: 'var(--space-7)'
          }}
        >
          {filteredProducts.map((p) => {
            const price = getProductPrice(p);
            const isAvail = p.isAvailable !== false;
            const catLabel = p.badge || (p.categoryName ? p.categoryName.toUpperCase() : 'DELICACY');

            return (
              <div
                key={p.id}
                className="product-card"
                data-testid={`product-card-${p.id}`}
              >
                {/* Full-bleed Top Image Area */}
                <div
                  className="product-card-image"
                  onClick={() => openProductModal(p)}
                >
                  <div className="product-category-emblem">
                    <span style={{ color: 'var(--crust-gold)' }}>✦</span>
                    <span>{catLabel}</span>
                  </div>

                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="purble-cake-img"
                    />
                  ) : (
                    <span style={{ fontSize: '56px' }}>🍰</span>
                  )}
                </div>

                {/* Content Area */}
                <div className="product-card-content">
                  <h3
                    className="product-card-title display-font"
                    onClick={() => openProductModal(p)}
                  >
                    {p.name}
                  </h3>
                  <p className="product-card-desc">{p.description}</p>

                  <div className="product-card-footer">
                    <div className="product-price-box">
                      <span className="price-amount">
                        {formatCardPrice(price, currencySymbol)}
                      </span>
                      <span className="price-vat-note">
                        {formatVatRate(currentRegion.vatRate)} Legal VAT Incl.
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-card-add"
                      disabled={!isAvail}
                      onClick={() => openProductModal(p)}
                    >
                      {isAvail ? 'Choose Options' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Flagship Experience: Table Reservation Banner */}
      <ReserveTableBanner />

      {/* ============================================================= */}
      {/* CONFECTIONERY CUSTOMIZATION MODAL (MATCHING IMAGE 9 1:1)      */}
      {/* ============================================================= */}
      {activeProduct && (
        <div
          className="cc-modal open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalProductTitle"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveProduct(null);
          }}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: 'var(--cherry-panel)',
              border: '2px solid var(--cherry-border)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Modal Header: Title + Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}
            >
              <h3
                id="modalProductTitle"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#ff5c8a',
                  margin: 0,
                  paddingRight: '16px',
                  lineHeight: 1.2
                }}
              >
                {activeProduct.name}
              </h3>
              <button
                type="button"
                className="modal-close-round-btn"
                onClick={() => setActiveProduct(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Subtitle / Description */}
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                margin: '0 0 20px 0'
              }}
            >
              {activeProduct.description}
            </p>

            {/* Modifiers & Add-ons (Single / Multi) */}
            <div>
              {activeModifierGroups.map((grp) => {
                const isSingle = grp.type === 'SINGLE';
                return (
                  <div key={grp.id || grp.name} style={{ marginBottom: '18px' }}>
                    <div
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: '8px'
                      }}
                    >
                      {grp.name}
                    </div>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                      role={isSingle ? 'radiogroup' : 'group'}
                    >
                      {(grp.modifiers || []).map((m) => {
                        const isChecked = Boolean(selectedModifiers[m.id || m.name]);
                        const deltaFormatted =
                          m.priceDelta && m.priceDelta > 0
                            ? ` — +${formatCardPrice(m.priceDelta, currencySymbol)}`
                            : m.name.includes('included')
                            ? ''
                            : ' — no extra charge';

                        return (
                          <div
                            key={m.id || m.name}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 0',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              if (isSingle) {
                                const next = { ...selectedModifiers };
                                (grp.modifiers || []).forEach((other) => {
                                  delete next[other.id || other.name];
                                });
                                next[m.id || m.name] = m;
                                setSelectedModifiers(next);
                              } else {
                                const next = { ...selectedModifiers };
                                if (isChecked) delete next[m.id || m.name];
                                else next[m.id || m.name] = m;
                                setSelectedModifiers(next);
                              }
                            }}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                margin: 0,
                                fontSize: '0.92rem',
                                color: isChecked ? '#FFFFFF' : 'var(--text-dim)',
                                fontWeight: isChecked ? 600 : 400
                              }}
                            >
                              <input
                                type={isSingle ? 'radio' : 'checkbox'}
                                name={`mod_grp_${grp.id || grp.name}`}
                                checked={isChecked}
                                onChange={() => {}}
                                style={{
                                  accentColor: '#ff3b71',
                                  width: '18px',
                                  height: '18px',
                                  cursor: 'pointer'
                                }}
                              />
                              <span>
                                {m.name}
                                {deltaFormatted}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity Stepper Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  margin: '22px 0 24px 0'
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Quantity:
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="modal-qty-btn"
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '2px solid var(--cherry-border)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <input
                    type="number"
                    className="modal-qty-input"
                    data-testid="modal-quantity"
                    value={quantity}
                    min="1"
                    max="99"
                    style={{
                      width: '48px',
                      height: '36px',
                      border: '2px solid var(--cherry-border)',
                      borderRadius: '8px',
                      background: 'var(--input-bg)',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 700
                    }}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v >= 1 && v <= 99) setQuantity(v);
                    }}
                  />
                  <button
                    type="button"
                    className="modal-qty-btn"
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '2px solid var(--cherry-border)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    aria-label="Increase quantity"
                  >
                    &#43;
                  </button>
                </div>
              </div>

              {/* Action Buttons: Cancel + Add to Bag (Matching Image 9) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid rgba(255, 183, 197, 0.12)',
                  paddingTop: '20px'
                }}
              >
                <button
                  type="button"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid rgba(255, 183, 197, 0.3)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '10px 24px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setActiveProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-checkout"
                  data-testid="modal-add"
                  onClick={handleAddCustomized}
                  style={{
                    backgroundColor: '#ff3b71',
                    border: '2px solid #ff3b71',
                    borderRadius: '9999px',
                    padding: '10px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(255, 59, 113, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>
                    Add to Bag ·{' '}
                    {formatCardPrice(
                      (getProductPrice(activeProduct) +
                        Object.values(selectedModifiers).reduce((sum, v) => sum + (v.priceDelta || 0), 0)) *
                        quantity,
                      currencySymbol
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
