import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity, calculateCart, clearCart } from '../store/cartSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { formatMoney } from '../utils/format-money';

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);
  const regionCode = useSelector((state) => state.region.code);
  const currencyCode = useSelector((state) => state.region.currencyCode);

  useEffect(() => {
    if (items.length > 0) {
      dispatch(calculateCart());
    }
  }, [items, regionCode, dispatch]);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <EmptyState
          icon="🛒"
          title="Ваша корзина пуста"
          text="Выберите вкусные десерты в нашем меню."
          actionText="В меню"
          onAction={() => { window.location.href = '/menu'; }}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)' }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--color-primary)',
          fontSize: 'var(--font-size-2xl)',
          marginBottom: 'var(--space-5)'
        }}
      >
        Корзина
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Cart items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {items.map((item) => (
            <Card key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{item.name}</h3>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                  {formatMoney(item.unitPrice, currencyCode)} / шт.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    type="button"
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                    style={{ padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                    aria-label="Уменьшить количество"
                  >
                    -
                  </button>
                  <span style={{ padding: '4px 8px', fontWeight: 600 }}>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                    style={{ padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => dispatch(removeItem(item.productId))}>
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearCart())}>
              Очистить корзину
            </Button>
          </div>
        </div>

        {/* Totals Summary */}
        <Card style={{ backgroundColor: '#FAF7F2' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
            Итого к оплате
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Сумма без НДС:</span>
              <span>{formatMoney(totals.subtotal, totals.currencyCode || currencyCode)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>НДС ({Math.round((totals.vatRate || 0.12) * 100)}%):</span>
              <span>{formatMoney(totals.vatAmount, totals.currencyCode || currencyCode)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Сумма с НДС:</span>
              <span>{formatMoney(totals.amountInclVat, totals.currencyCode || currencyCode)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                <span>Скидка ({Math.round((totals.discountRate || 0) * 100)}%):</span>
                <span>-{formatMoney(totals.discountAmount, totals.currencyCode || currencyCode)}</span>
              </div>
            )}
            {totals.deliveryFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Доставка:</span>
                <span>{formatMoney(totals.deliveryFee, totals.currencyCode || currencyCode)}</span>
              </div>
            )}
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
              <span>Итого:</span>
              <span>{formatMoney(totals.total || totals.amountInclVat, totals.currencyCode || currencyCode)}</span>
            </div>
          </div>
          <Link to="/checkout" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" style={{ width: '100%' }}>
              Перейти к оформлению
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default Cart;
