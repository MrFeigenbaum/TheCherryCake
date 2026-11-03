import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { clearCart } from '../store/cartSlice';
import { showToast } from '../store/uiSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Radio, RadioGroup } from '../components/ui/Radio';
import { formatMoney } from '../utils/format-money';
import { validateRequired, validateEmail, validatePhone } from '../utils/validators';

export function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);
  const regionCode = useSelector((state) => state.region.code);

  const [orderType, setOrderType] = useState('PICKUP');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameErr = validateRequired(formData.customerName, 'Имя');
    if (nameErr) newErrors.customerName = nameErr;

    const emailErr = validateEmail(formData.customerEmail);
    if (emailErr) newErrors.customerEmail = emailErr;

    const phoneErr = validatePhone(formData.customerPhone);
    if (phoneErr) newErrors.customerPhone = phoneErr;

    if (orderType === 'DELIVERY') {
      const addrErr = validateRequired(formData.deliveryAddress, 'Адрес доставки');
      if (addrErr) newErrors.deliveryAddress = addrErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        region: regionCode,
        orderType,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: orderType === 'DELIVERY' ? formData.deliveryAddress : null,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity, modifierIds: i.modifierIds || [] }))
      };
      const res = await createOrder(payload);
      dispatch(clearCart());
      dispatch(showToast({ type: 'success', message: `Заказ #${res.orderNumber || res.id} успешно оформлен!` }));
      navigate('/');
    } catch {
      // api/client response interceptor handles showing toast automatically!
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-5)' }}>
        Оформление заказа
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <RadioGroup label="Способ получения">
            <Radio
              name="orderType"
              value="PICKUP"
              label="Самовывоз"
              checked={orderType === 'PICKUP'}
              onChange={() => setOrderType('PICKUP')}
            />
            <Radio
              name="orderType"
              value="DELIVERY"
              label="Доставка курьером"
              checked={orderType === 'DELIVERY'}
              onChange={() => setOrderType('DELIVERY')}
            />
          </RadioGroup>

          <Input
            label="Ваше имя"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            error={errors.customerName}
            required
          />
          <Input
            label="Email"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            error={errors.customerEmail}
            required
          />
          <Input
            label="Телефон"
            name="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={handleChange}
            error={errors.customerPhone}
            required
          />

          {orderType === 'DELIVERY' && (
            <Input
              label="Адрес доставки"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              error={errors.deliveryAddress}
              required
            />
          )}

          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              <span>Сумма к оплате:</span>
              <span style={{ color: 'var(--color-primary)' }}>
                {formatMoney(totals.total || totals.amountInclVat || 0, totals.currencyCode || 'UZS')}
              </span>
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
              Подтвердить заказ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Checkout;
