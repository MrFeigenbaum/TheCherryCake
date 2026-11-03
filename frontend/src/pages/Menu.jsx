import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, getCategories } from '../api/products';
import { addItem } from '../store/cartSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { formatMoney } from '../utils/format-money';

export function Menu() {
  const dispatch = useDispatch();
  const regionCode = useSelector((state) => state.region.code);
  const currencyCode = useSelector((state) => state.region.currencyCode);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getCategories().catch(() => []),
      getProducts({ region: regionCode, categoryId: selectedCategory || undefined }).catch(() => [])
    ]).then(([cats, prods]) => {
      if (isMounted) {
        setCategories(cats);
        setProducts(prods);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [regionCode, selectedCategory]);

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)' }}>
          Наше меню
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Цены и наличие отображаются для региона: <strong>{regionCode}</strong> ({currencyCode})
        </p>
      </div>

      {/* Category filter pills */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        <Button
          variant={selectedCategory === null ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Все
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Loader size="lg" label="Загрузка меню..." />
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="В этой категории пока нет товаров" />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)'
          }}
        >
          {products.map((p) => {
            const price = p.price !== undefined ? p.price : (p.regionalPrices?.[regionCode]?.price || 0);
            const isAvail = p.isAvailable !== false;
            return (
              <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--space-3)'
                      }}
                    />
                  )}
                  <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                    {p.name}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                    {p.description}
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
                      {formatMoney(price, currencyCode)}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        color: isAvail ? 'var(--color-success)' : 'var(--color-error)'
                      }}
                    >
                      {isAvail ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    disabled={!isAvail}
                    onClick={() => dispatch(addItem({ productId: p.id, name: p.name, unitPrice: price, imageUrl: p.imageUrl }))}
                    style={{ width: '100%' }}
                  >
                    {isAvail ? 'В корзину' : 'Недоступно'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Menu;
