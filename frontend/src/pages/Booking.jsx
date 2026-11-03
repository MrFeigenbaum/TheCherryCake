import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBooking } from '../api/bookings';
import { showToast } from '../store/uiSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { validateRequired, validateEmail, validatePhone } from '../utils/validators';

export function Booking() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    guestsCount: 2,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await createBooking(formData);
      setBookingResult(res);
      dispatch(showToast({ type: 'success', message: 'Столик успешно забронирован!' }));
    } catch {
      // api/client handles toast automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: '560px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-5)' }}>
        Бронирование столика
      </h1>

      {bookingResult ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>🎉</div>
          <h2 style={{ color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>Столик забронирован!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Номер брони: <strong>#{bookingResult.bookingNumber || bookingResult.id}</strong> на имя {bookingResult.customerName}
          </p>
          <Button variant="primary" onClick={() => setBookingResult(null)}>
            Забронировать ещё
          </Button>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <Input label="Ваше имя" name="customerName" value={formData.customerName} onChange={handleChange} error={errors.customerName} required />
            <Input label="Email" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} error={errors.customerEmail} required />
            <Input label="Телефон" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleChange} error={errors.customerPhone} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <Input label="Дата" name="bookingDate" type="date" value={formData.bookingDate} onChange={handleChange} required />
              <Input label="Время" name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
            </div>
            <Input label="Количество гостей" name="guestsCount" type="number" min="1" max="10" value={formData.guestsCount} onChange={handleChange} required />
            <Input label="Пожелания / Комментарий" name="comment" value={formData.comment} onChange={handleChange} />
            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: 'var(--space-3)' }}>
              Забронировать столик
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

export default Booking;
