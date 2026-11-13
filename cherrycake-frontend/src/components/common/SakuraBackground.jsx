import React, { useEffect, useRef } from 'react';

export function SakuraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;
    let animationId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petalCount = 35;
    const petals = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 16 + 18,
        speedX: Math.random() * 1.5 - 0.4,
        speedY: Math.random() * 1.2 + 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.45 + 0.25
      });
    }

    const sakuraImg = new Image();
    sakuraImg.src = '/TransparentSakuraFlower.png';

    const drawPetal = (x, y, size, rotation, opacity) => {
      if (!sakuraImg.complete || sakuraImg.naturalWidth === 0) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.drawImage(sakuraImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;
        drawPetal(p.x, p.y, p.size, p.rotation, p.opacity);
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.95
      }}
    />
  );
}

export default SakuraBackground;
