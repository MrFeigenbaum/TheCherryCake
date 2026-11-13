import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeCustomCake, openCartDrawer, showToast } from '../../store/uiSlice';
import { addItem } from '../../store/cartSlice';

const TIER_PRICES = {
  UZS: { 1: 35000, 2: 150000, 3: 250000 },
  RUB: { 1: 260, 2: 1120, 3: 1870 },
  KZT: { 1: 1500, 2: 6500, 3: 10800 },
  EUR: { 1: 3.5, 2: 15, 3: 25 },
  USD: { 1: 3.8, 2: 16.5, 3: 27.5 },
  CNY: { 1: 25, 2: 110, 3: 180 },
  GEL: { 1: 10, 2: 42, 3: 70 },
  UAH: { 1: 140, 2: 600, 3: 1000 },
  BYN: { 1: 11, 2: 48, 3: 80 },
  AMD: { 1: 1500, 2: 6500, 3: 11000 },
  SEK: { 1: 40, 2: 170, 3: 280 },
  MDL: { 1: 65, 2: 280, 3: 470 },
  RON: { 1: 17, 2: 75, 3: 125 },
  TRY: { 1: 120, 2: 520, 3: 870 },
  AZN: { 1: 6.5, 2: 28, 3: 47 }
};

const CFG = {
  RECTANGLE: {
    bw: 102, bh: 54, step: 23,
    fdx: -6, fdy: -6, fw: 113, fh: 49,
    idx: -3.0, idy: -4.0, iw: 108, ih: 53,
    ddx: 45, ddy: 10,
    pan_w: 103, pan_h: 54, pdx: -0.5, pdy: 0,
    sdx: 6.0, sdy: 3.0, sw: 94, sh: 32
  },
  ROUND: {
    bw: 83, bh: 66, step: 23,
    fdx: -6.5, fdy: -7, fw: 96, fh: 60,
    idx: -2.5, idy: -5.0, iw: 87, ih: 58,
    ddx: 32, ddy: 16,
    pan_w: 84, pan_h: 68, pdx: -0.5, pdy: -1,
    sdx: 4.0, sdy: 2.0, sw: 79, sh: 41
  },
  HEART: {
    bw: 85, bh: 67, step: 19,
    fdx: -8.5, fdy: -5, fw: 102, fh: 64,
    idx: -3.5, idy: -5.5, iw: 92, ih: 64,
    ddx: 31, ddy: 17,
    pan_w: 86, pan_h: 67, pdx: -0.5, pdy: 0,
    sdx: 5.5, sdy: 4.5, sw: 81, sh: 44
  }
};

const imageCache = new Map();

function getCachedImage(src, onLoaded) {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src);
    if (!cached.complete && onLoaded) {
      cached.addEventListener('load', onLoaded, { once: true });
    }
    return cached;
  }
  const img = new Image();
  img.src = src;
  if (onLoaded) {
    img.addEventListener('load', onLoaded, { once: true });
  }
  imageCache.set(src, img);
  return img;
}

export function CustomCakeStudioModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui?.isCustomCakeOpen);
  const regionCode = useSelector((state) => state.region?.code || 'UZB');
  const regions = useSelector((state) => state.region?.regions || []);
  const currentRegion = regions.find((r) => r.code === regionCode) || {
    currencySymbol: "so'm",
    currencyCode: 'UZS'
  };
  const currencySymbol = currentRegion.currencySymbol || "so'm";
  const currencyCode = (currentRegion.currencyCode || 'UZS').toUpperCase();

  const [shape, setShape] = useState('HEART');
  const [flavor, setFlavor] = useState('CHOCOLATE');
  const [cream, setCream] = useState('VANILLA');
  const [glazeStyle, setGlazeStyle] = useState('BURNT');
  const [topping, setTopping] = useState('CHOCOLATE');
  const [sugar, setSugar] = useState(true);
  const [accessory, setAccessory] = useState('HEART');
  const [layers, setLayers] = useState(3);

  const canvasRef = useRef(null);

  const getTierPrice = useCallback(
    (layerCount) => {
      const curMap = TIER_PRICES[currencyCode] || TIER_PRICES['UZS'];
      return curMap[layerCount] || curMap[3];
    },
    [currencyCode]
  );

  const currentPrice = getTierPrice(layers);

  const formatPrice = (amount) => {
    const num = parseFloat(amount) || 0;
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}`;
  };

  const drawCake = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const c = CFG[shape] || CFG['HEART'];
    const scale = 2.4;
    const baseCenterX = canvas.width / 2;
    const bw = Math.round(c.bw * scale);
    const bh = Math.round(c.bh * scale);
    const bx = Math.round(baseCenterX - (c.bw / 2.0) * scale);
    const step = Math.round(c.step * scale);

    // If flavor is NONE, show empty pan
    if (flavor === 'NONE') {
      const extraY = (3 - 1) * 12;
      const baseY = Math.round(canvas.height - 25 - bh - extraY);
      const panSrc = `/assets/purble_place/PAN${shape}SPRITE.png`;
      const imgPan = getCachedImage(panSrc, drawCake);
      if (imgPan.complete && imgPan.naturalWidth > 0) {
        const pw = Math.round(c.pan_w * scale);
        const ph = Math.round(c.pan_h * scale);
        const px = Math.round(bx + c.pdx * scale);
        const py = Math.round(baseY + c.pdy * scale);
        ctx.drawImage(imgPan, px, py, pw, ph);
      }
      return;
    }

    const extraY = (3 - layers) * 12;
    const baseY = Math.round(canvas.height - 25 - bh - extraY);

    // 1. Sponge tiers and intermediate cream fillings
    for (let l = 1; l <= layers; l++) {
      const by = Math.round(baseY - (l - 1) * step);
      const batterSrc = `/assets/purble_place/BATTER${flavor}${shape}SPRITE.png`;
      const imgB = getCachedImage(batterSrc, drawCake);
      if (imgB.complete && imgB.naturalWidth > 0) {
        ctx.drawImage(imgB, bx, by, bw, bh);
      }
      if (l < layers) {
        const fillingSrc = `/assets/purble_place/FILLING${cream}${shape}SPRITE.png`;
        const fw = Math.round(c.fw * scale);
        const fh = Math.round(c.fh * scale);
        const fx = Math.round(bx + c.fdx * scale);
        const fy = Math.round(by + c.fdy * scale);
        const imgF = getCachedImage(fillingSrc, drawCake);
        if (imgF.complete && imgF.naturalWidth > 0) {
          ctx.drawImage(imgF, fx, fy, fw, fh);
        }
      }
    }

    // 2. Top Glaze / Finish
    const topBy = Math.round(baseY - (layers - 1) * step);
    const iw = Math.round(c.iw * scale);
    const ih = Math.round(c.ih * scale);
    const ix = Math.round(bx + c.idx * scale);
    const iy = Math.round(topBy + c.idy * scale);

    if (glazeStyle === 'BURNT' && topping !== 'NONE') {
      const burntSrc = `/assets/purble_place/FINALTOUCHBURNTGLAZE${topping}${shape}.png`;
      const imgBurnt = getCachedImage(burntSrc, drawCake);
      if (imgBurnt.complete && imgBurnt.naturalWidth > 0) {
        const bw_w = Math.round(imgBurnt.naturalWidth * scale);
        const bw_h = Math.round(imgBurnt.naturalHeight * scale);
        ctx.drawImage(imgBurnt, ix, iy, bw_w, bw_h);
      }
    } else if (glazeStyle === 'ICING' && topping !== 'NONE') {
      const icingSrc = `/assets/purble_place/ICING${topping}${shape}SPRITE.png`;
      const imgI = getCachedImage(icingSrc, drawCake);
      if (imgI.complete && imgI.naturalWidth > 0) {
        ctx.drawImage(imgI, ix, iy, iw, ih);
      }
    }

    // 3. Powdered Sugar Dusting
    if (sugar) {
      const sugarSrc = `/assets/purble_place/FINALTOUCHSUGAR${shape}SPRITE.png`;
      const imgS = getCachedImage(sugarSrc, drawCake);
      if (imgS.complete && imgS.naturalWidth > 0) {
        const sw = Math.round(c.sw * scale);
        const sh = Math.round(c.sh * scale);
        const sx = Math.round(ix + c.sdx * scale);
        const sy = Math.round(iy + c.sdy * scale);
        ctx.drawImage(imgS, sx, sy, sw, sh);
      }
    }

    // 4. Top Accessory / Decoration
    if (accessory && accessory !== 'NONE') {
      const accCode = accessory === 'GUMDROPS' ? 'GUMDROP' : accessory;
      const decorSrc = `/assets/purble_place/DECORATION${accCode}SPRITE.png`;
      const imgD = getCachedImage(decorSrc, drawCake);
      if (imgD.complete && imgD.naturalWidth > 0) {
        const dw = Math.round(imgD.naturalWidth * scale);
        const dh = Math.round(imgD.naturalHeight * scale);
        const dx = Math.round(ix + c.ddx * scale);
        const dy = Math.round(iy + c.ddy * scale);
        ctx.drawImage(imgD, dx, dy, dw, dh);
      }
    }
  }, [shape, flavor, cream, glazeStyle, topping, sugar, accessory, layers]);

  useEffect(() => {
    if (isOpen) {
      drawCake();
    }
  }, [isOpen, drawCake]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (flavor === 'NONE') {
      dispatch(showToast({ type: 'warning', message: 'Please select a sponge batter flavor to fill the pan!' }));
      return;
    }

    let cakeThumb = '';
    if (canvasRef.current) {
      try {
        cakeThumb = canvasRef.current.toDataURL('image/png');
      } catch {
        cakeThumb = '/TransparentSakuraFlower.png';
      }
    }

    const shapeNames = { HEART: 'Romantic Heart', ROUND: 'Classic Round', RECTANGLE: 'Artisan Square' };
    const flavorNames = { VANILLA: 'Golden Vanilla', CHOCOLATE: 'Dark Fudge', STRAWBERRY: 'Sweet Strawberry' };

    const cakeTitle = `Bespoke ${layers}-Layer ${shapeNames[shape] || 'Cake'}`;
    const descParts = [
      `${flavorNames[flavor] || flavor} Batter`,
      layers > 1 ? `${cream} Cream` : null,
      glazeStyle !== 'NONE' ? `${glazeStyle} ${topping}` : 'Naked Sponge',
      sugar ? 'Powdered Sugar' : null,
      accessory !== 'NONE' ? accessory : null
    ].filter(Boolean);

    dispatch(
      addItem({
        productId: `custom-${Date.now()}`,
        name: cakeTitle,
        imageUrl: cakeThumb,
        unitPrice: currentPrice,
        quantity: 1,
        isCustomCake: true,
        customizations: {
          shape,
          flavor,
          cream,
          glazeStyle,
          topping,
          sugar,
          accessory,
          layers,
          specs: descParts.join(' · ')
        }
      })
    );

    dispatch(showToast({ type: 'success', message: `${cakeTitle} added to your bag!` }));
    dispatch(closeCustomCake());
    dispatch(openCartDrawer());
  };

  return (
    <div
      className="cc-modal open"
      id="customCakeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customCakeModalTitle"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 3500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dispatch(closeCustomCake());
      }}
    >
      <div className="modal-dialog custom-cake-dialog">
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--crust-gold)' }}>
              <svg
                className="inline-svg-icon"
                style={{ width: '1.8rem', height: '1.8rem' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
                <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
                <path d="M2 21h20" />
                <path d="M7 8v2" />
                <path d="M12 8v2" />
                <path d="M17 8v2" />
                <path d="M7 4h.01" />
                <path d="M12 4h.01" />
                <path d="M17 4h.01" />
              </svg>
            </span>
            <div>
              <h3
                className="modal-title"
                id="customCakeModalTitle"
                style={{
                  color: 'var(--crust-gold)',
                  fontFamily: "'Playfair Display', serif",
                  margin: 0,
                  fontSize: '1.35rem'
                }}
              >
                Custom Cake Studio
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Design your bespoke confectionery: choose your shape, layers, cream, glaze topping &amp; accessory
              </div>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => dispatch(closeCustomCake())}
            aria-label="Close custom cake studio"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body custom-cake-body">
          {/* Left: Live Custom Cake Stage */}
          <div className="custom-cake-stage-card">
            <div className="custom-cake-pedestal-stage" id="customCakePedestal">
              <div className="cake-display-plate">
                <div className="cake-assembly-stack" id="customCakeAssemblyStack">
                  <canvas
                    ref={canvasRef}
                    id="customCakeCanvas"
                    width={340}
                    height={360}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                      filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.55))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="custom-cake-controls-panel">
            {/* 1. Form & Shape */}
            <div className="custom-cake-section">
              <label className="custom-cake-section-label">1. Form &amp; Shape</label>
              <div className="custom-cake-btn-grid">
                <button
                  type="button"
                  className={`cake-opt-btn ${shape === 'HEART' ? 'active' : ''}`}
                  onClick={() => setShape('HEART')}
                >
                  <span className="opt-icon">♡</span> Romantic Heart
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${shape === 'ROUND' ? 'active' : ''}`}
                  onClick={() => setShape('ROUND')}
                >
                  <span className="opt-icon">○</span> Classic Round
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${shape === 'RECTANGLE' ? 'active' : ''}`}
                  onClick={() => setShape('RECTANGLE')}
                >
                  <span className="opt-icon">□</span> Artisan Square
                </button>
              </div>
            </div>

            {/* 2. Sponge Batter Flavor */}
            <div className="custom-cake-section">
              <label className="custom-cake-section-label">2. Sponge Batter Flavor</label>
              <div className="custom-cake-btn-grid">
                <button
                  type="button"
                  className={`cake-opt-btn ${flavor === 'NONE' ? 'active' : ''}`}
                  onClick={() => setFlavor('NONE')}
                >
                  <span className="opt-icon">○</span> Empty Pan
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${flavor === 'STRAWBERRY' ? 'active' : ''}`}
                  onClick={() => setFlavor('STRAWBERRY')}
                >
                  <span className="opt-icon">✿</span> Strawberry
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${flavor === 'CHOCOLATE' ? 'active' : ''}`}
                  onClick={() => setFlavor('CHOCOLATE')}
                >
                  <span className="opt-icon">▦</span> Chocolate
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${flavor === 'VANILLA' ? 'active' : ''}`}
                  onClick={() => setFlavor('VANILLA')}
                >
                  <span className="opt-icon">⚚</span> Vanilla
                </button>
              </div>
            </div>

            {/* 3. Cream Filling */}
            <div className="custom-cake-section">
              <label className="custom-cake-section-label">3. Cream Filling</label>
              <div className="custom-cake-btn-grid">
                <button
                  type="button"
                  className={`cake-opt-btn ${cream === 'RASPBERRY' ? 'active' : ''}`}
                  onClick={() => setCream('RASPBERRY')}
                >
                  <span className="opt-icon">⊙</span> Wild Raspberry Cream
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${cream === 'FUDGE' ? 'active' : ''}`}
                  onClick={() => setCream('FUDGE')}
                >
                  <span className="opt-icon">▦</span> Chocolate Fudge Cream
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${cream === 'VANILLA' ? 'active' : ''}`}
                  onClick={() => setCream('VANILLA')}
                >
                  <span className="opt-icon">▵</span> Vanilla Custard Cream
                </button>
              </div>
            </div>

            {/* 4. Top Glaze, Burnt Finish & Powdered Sugar */}
            <div className="custom-cake-section">
              <label className="custom-cake-section-label">4. Top Glaze, Burnt Finish &amp; Powdered Sugar</label>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                GLAZE FINISH
              </div>
              <div className="custom-cake-btn-grid" style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  className={`cake-opt-btn ${glazeStyle === 'ICING' ? 'active' : ''}`}
                  onClick={() => setGlazeStyle('ICING')}
                >
                  <span className="opt-icon">❇</span> Classic Icing
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${glazeStyle === 'BURNT' ? 'active' : ''}`}
                  onClick={() => setGlazeStyle('BURNT')}
                >
                  <span className="opt-icon">♨</span> Burnt Flame Glaze
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${glazeStyle === 'NONE' ? 'active' : ''}`}
                  onClick={() => setGlazeStyle('NONE')}
                >
                  <span className="opt-icon">⊘</span> Naked Sponge
                </button>
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                GLAZE FLAVOR
              </div>
              <div className="custom-cake-btn-grid" style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  className={`cake-opt-btn ${topping === 'CHOCOLATE' ? 'active' : ''}`}
                  onClick={() => setTopping('CHOCOLATE')}
                >
                  <span className="opt-icon">▦</span> Dark Chocolate
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${topping === 'STRAWBERRY' ? 'active' : ''}`}
                  onClick={() => setTopping('STRAWBERRY')}
                >
                  <span className="opt-icon">✿</span> Strawberry
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${topping === 'VANILLA' ? 'active' : ''}`}
                  onClick={() => setTopping('VANILLA')}
                >
                  <span className="opt-icon">⚚</span> White Vanilla
                </button>
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                POWDERED SUGAR DUSTING
              </div>
              <div className="custom-cake-btn-grid">
                <button
                  type="button"
                  className={`cake-opt-btn ${!sugar ? 'active' : ''}`}
                  onClick={() => setSugar(false)}
                >
                  <span className="opt-icon">✕</span> No Sugar
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${sugar ? 'active' : ''}`}
                  onClick={() => setSugar(true)}
                >
                  <span className="opt-icon">❄</span> Powdered Sugar Shaker
                </button>
              </div>
            </div>

            {/* 5. Accessory & Decoration */}
            <div className="custom-cake-section">
              <label className="custom-cake-section-label">5. Accessory &amp; Decoration</label>
              <div className="custom-cake-btn-grid">
                <button
                  type="button"
                  className={`cake-opt-btn ${accessory === 'SMILEY' ? 'active' : ''}`}
                  onClick={() => setAccessory('SMILEY')}
                >
                  <span className="opt-icon">😊</span> Smiley Face
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${accessory === 'HEART' ? 'active' : ''}`}
                  onClick={() => setAccessory('HEART')}
                >
                  <span className="opt-icon">❤️</span> Sugar Heart
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${accessory === 'SHAMROCK' ? 'active' : ''}`}
                  onClick={() => setAccessory('SHAMROCK')}
                >
                  <span className="opt-icon">☘</span> Lucky Clover
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${accessory === 'GUMDROPS' ? 'active' : ''}`}
                  onClick={() => setAccessory('GUMDROPS')}
                >
                  <span className="opt-icon">🍬</span> Sweet Gumdrops
                </button>
                <button
                  type="button"
                  className={`cake-opt-btn ${accessory === 'NONE' ? 'active' : ''}`}
                  onClick={() => setAccessory('NONE')}
                >
                  <span className="opt-icon">✧</span> None (Minimalist)
                </button>
              </div>
            </div>

            {/* 6. Select Layers & Tiers */}
            <div className="custom-cake-section">
              <label className="custom-cake-section-label">6. Select Layers &amp; Tiers</label>
              <div className="custom-cake-tiers-grid">
                <button
                  type="button"
                  className={`tier-card-btn ${layers === 1 ? 'active' : ''}`}
                  onClick={() => setLayers(1)}
                >
                  <span className="tier-num">1 Layer</span>
                  <span className="tier-cost">{formatPrice(getTierPrice(1))}</span>
                  <span className="tier-sub">Single Tier</span>
                </button>
                <button
                  type="button"
                  className={`tier-card-btn ${layers === 2 ? 'active' : ''}`}
                  onClick={() => setLayers(2)}
                >
                  <span className="tier-num">2 Layers</span>
                  <span className="tier-cost">{formatPrice(getTierPrice(2))}</span>
                  <span className="tier-sub">Double Tier</span>
                </button>
                <button
                  type="button"
                  className={`tier-card-btn ${layers === 3 ? 'active' : ''}`}
                  onClick={() => setLayers(3)}
                >
                  <span className="tier-num">3 Layers</span>
                  <span className="tier-cost">{formatPrice(getTierPrice(3))}</span>
                  <span className="tier-sub">Grand Celebration</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="custom-cake-footer">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)' }}>Total:</span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--crust-gold)'
              }}
            >
              {formatPrice(currentPrice)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(closeCustomCake())}
              style={{ padding: '10px 22px', borderRadius: '9999px', fontWeight: 600, border: '2px solid var(--cherry-border)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={flavor === 'NONE'}
              onClick={handleAddToCart}
              style={{
                padding: '10px 24px',
                borderRadius: '9999px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--raspberry-coulis), var(--raspberry-bright))',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 18px rgba(230, 57, 96, 0.45)',
                cursor: flavor === 'NONE' ? 'not-allowed' : 'pointer',
                opacity: flavor === 'NONE' ? 0.6 : 1
              }}
            >
              🛒 Add to Order · {formatPrice(currentPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomCakeStudioModal;

