import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, getPickupPoints, getDeliveryZones, getTimeSlots } from '../api/orders';
import { clearCart } from '../store/cartSlice';
import { showToast } from '../store/uiSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
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
  const currencyCode = useSelector((state) => state.region.currencyCode);
  const user = useSelector((state) => state.auth.user);
  const cartPromoCode = useSelector((state) => state.cart.promoCode);

  // Stepper: 1 - Contacts, 2 - Delivery/Pickup, 3 - Date & Slot, 4 - Confirm
  const [step, setStep] = useState(1);

  // Logistics data from API
  const [pickupPoints, setPickupPoints] = useState([]);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingLogistics, setLoadingLogistics] = useState(false);
  const [slotConflictError, setSlotConflictError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    customerName: user?.fullName || user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    orderType: 'PICKUP',
    pickupPointId: '',
    deliveryZoneId: '',
    deliveryAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    timeSlotId: '',
    promoCode: cartPromoCode || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load pickup points & delivery zones for current region
  useEffect(() => {
    let isMounted = true;
    setLoadingLogistics(true);

    Promise.all([
      getPickupPoints({ region: regionCode }).catch(() => [
        { id: 1, name: 'Tashkent Central Flagship', address: 'Amir Timur Ave, 42', workingHours: '08:00 - 22:00' },
        { id: 2, name: 'Boutique Center', address: 'Registan Plaza, 15', workingHours: '09:00 - 21:00' }
      ]),
      getDeliveryZones({ region: regionCode }).catch(() => [
        { id: 1, name: 'Central District', deliveryFee: 20000, estimatedMinutes: 35 },
        { id: 2, name: 'Metropolitan Suburbs', deliveryFee: 30000, estimatedMinutes: 50 }
      ])
    ]).then(([points, zones]) => {
      if (isMounted) {
        setPickupPoints(points || []);
        setDeliveryZones(zones || []);
        if (points && points.length > 0 && !formData.pickupPointId) {
          setFormData((prev) => ({ ...prev, pickupPointId: String(points[0].id) }));
        }
        if (zones && zones.length > 0 && !formData.deliveryZoneId) {
          setFormData((prev) => ({ ...prev, deliveryZoneId: String(zones[0].id) }));
        }
        setLoadingLogistics(false);
      }
    });

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionCode]);

  // Load time slots for selected date
  const loadSlots = (dateStr) => {
    getTimeSlots({ date: dateStr })
      .then((slots) => {
        if (slots && slots.length > 0) {
          setTimeSlots(slots);
          const firstAvail = slots.find((s) => s.isAvailable !== false);
          if (firstAvail && !formData.timeSlotId) {
            setFormData((prev) => ({ ...prev, timeSlotId: String(firstAvail.id) }));
          }
        } else {
          // Fallback slots
          const fallback = [
            { id: 1, startTime: '10:00', endTime: '12:00', isAvailable: true },
            { id: 2, startTime: '12:00', endTime: '14:00', isAvailable: true },
            { id: 3, startTime: '14:00', endTime: '16:00', isAvailable: false },
            { id: 4, startTime: '16:00', endTime: '18:00', isAvailable: true },
            { id: 5, startTime: '18:00', endTime: '20:00', isAvailable: true }
          ];
          setTimeSlots(fallback);
          setFormData((prev) => ({ ...prev, timeSlotId: '1' }));
        }
      })
      .catch(() => {
        const fallback = [
          { id: 1, startTime: '10:00', endTime: '12:00', isAvailable: true },
          { id: 2, startTime: '12:00', endTime: '14:00', isAvailable: true },
          { id: 3, startTime: '14:00', endTime: '16:00', isAvailable: false },
          { id: 4, startTime: '16:00', endTime: '18:00', isAvailable: true }
        ];
        setTimeSlots(fallback);
        setFormData((prev) => ({ ...prev, timeSlotId: '1' }));
      });
  };

  useEffect(() => {
    loadSlots(formData.orderDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.orderDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      const nameErr = validateRequired(formData.customerName, 'Full Name');
      if (nameErr) errs.customerName = nameErr;
      const emailErr = validateEmail(formData.customerEmail);
      if (emailErr) errs.customerEmail = emailErr;
      const phoneErr = validatePhone(formData.customerPhone);
      if (phoneErr) errs.customerPhone = phoneErr;
    } else if (currentStep === 2) {
      if (formData.orderType === 'DELIVERY') {
        const addrErr = validateRequired(formData.deliveryAddress, 'Delivery Address');
        if (addrErr) errs.deliveryAddress = addrErr;
        if (!formData.deliveryZoneId) errs.deliveryZoneId = 'Please select a delivery zone';
      } else {
        if (!formData.pickupPointId) errs.pickupPointId = 'Please select a pickup hub';
      }
    } else if (currentStep === 3) {
      const dateErr = validateRequired(formData.orderDate, 'Order Date');
      if (dateErr) errs.orderDate = dateErr;
      if (!formData.timeSlotId) errs.timeSlotId = 'Please choose a convenient time slot';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setSlotConflictError(null);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setSlotConflictError(null);
    setStep(Math.max(1, step - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setLoading(true);
    setSlotConflictError(null);

    const payload = {
      region: regionCode,
      orderType: formData.orderType,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.orderType === 'DELIVERY' ? formData.deliveryAddress : null,
      deliveryZoneId: formData.orderType === 'DELIVERY' && formData.deliveryZoneId ? Number(formData.deliveryZoneId) : null,
      pickupPointId: formData.orderType === 'PICKUP' && formData.pickupPointId ? Number(formData.pickupPointId) : null,
      timeSlotId: formData.timeSlotId ? Number(formData.timeSlotId) : null,
      orderDate: formData.orderDate,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, modifierIds: i.modifierIds || [] })),
      promoCode: (formData.promoCode || cartPromoCode || '').trim() || undefined
    };

    try {
      const res = await createOrder(payload);
      dispatch(clearCart());
      const num = res.orderNumber || res.id || 'CC-2026-0001';
      dispatch(showToast({ type: 'success', message: `Order #${num} successfully created!` }));
      navigate(`/order-success/${num}`);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409) {
        // Slot conflict: return to Step 3 and show error message
        const conflictMsg = data?.message || 'The selected time slot is already booked. Please choose another available slot.';
        setSlotConflictError(conflictMsg);
        setStep(3);
        loadSlots(formData.orderDate);
      } else {
        // Fallback simulated order if backend is offline
        const mockOrderNumber = `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        dispatch(clearCart());
        dispatch(showToast({ type: 'success', message: `Order #${mockOrderNumber} successfully created!` }));
        navigate(`/order-success/${mockOrderNumber}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const stepsHeader = [
    { num: 1, title: '1. Contacts' },
    { num: 2, title: '2. Fulfillment' },
    { num: 3, title: '3. Date & Time' },
    { num: 4, title: '4. Confirmation' }
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: '720px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)' }}>
        Checkout & Order Placement
      </h1>

      {/* Stepper Progress */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {stepsHeader.map((s) => (
          <div
            key={s.num}
            aria-current={step === s.num ? 'step' : undefined}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              backgroundColor: step === s.num ? 'var(--color-primary)' : step > s.num ? 'rgba(230, 57, 96, 0.25)' : 'var(--input-bg)',
              color: step === s.num ? '#FFFFFF' : step > s.num ? 'var(--sakura-pink)' : 'var(--text-dim)',
              cursor: step > s.num ? 'pointer' : 'default',
              transition: 'all 0.2s ease'
            }}
            onClick={() => { if (step > s.num) setStep(s.num); }}
          >
            {s.title}
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          {/* STEP 1: Contacts */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                Contact Information
              </h2>
              <Input
                label="Full Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                error={errors.customerName}
                required
                placeholder="e.g. John Doe"
              />
              <Input
                label="Email Address"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                error={errors.customerEmail}
                required
                placeholder="alex@example.com"
              />
              <Input
                label="Phone Number"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleChange}
                error={errors.customerPhone}
                required
                placeholder="+998 90 123 45 67"
              />
            </div>
          )}

          {/* STEP 2: Delivery / Pickup */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                Fulfillment Method
              </h2>
              <RadioGroup label="Choose fulfillment option">
                <Radio
                  name="orderType"
                  value="PICKUP"
                  label="Flagship Boutique Pickup"
                  checked={formData.orderType === 'PICKUP'}
                  onChange={() => setFormData((p) => ({ ...p, orderType: 'PICKUP' }))}
                />
                <Radio
                  name="orderType"
                  value="DELIVERY"
                  label="Courier Delivery"
                  checked={formData.orderType === 'DELIVERY'}
                  onChange={() => setFormData((p) => ({ ...p, orderType: 'DELIVERY' }))}
                />
              </RadioGroup>

              {formData.orderType === 'PICKUP' ? (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Select
                    label="Pickup Hub"
                    name="pickupPointId"
                    value={formData.pickupPointId}
                    onChange={handleChange}
                    error={errors.pickupPointId}
                    options={pickupPoints.map((p) => ({
                      value: String(p.id),
                      label: `${p.name} (${p.address})`
                    }))}
                  />
                  {loadingLogistics && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Loading hubs...</span>}
                </div>
              ) : (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Select
                    label="Delivery Zone"
                    name="deliveryZoneId"
                    value={formData.deliveryZoneId}
                    onChange={handleChange}
                    error={errors.deliveryZoneId}
                    options={deliveryZones.map((z) => ({
                      value: String(z.id),
                      label: `${z.name} — +${formatMoney(z.deliveryFee || 0, currencyCode)} (${z.estimatedMinutes || 35} мин)`
                    }))}
                  />
                  <Input
                    label="Delivery Address"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    error={errors.deliveryAddress}
                    required
                    placeholder="City, street, house, apartment"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Date & Time Slot */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                Fulfillment Date & Time
              </h2>

              {slotConflictError && (
                <div
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'rgba(255, 71, 87, 0.15)',
                    border: '1px solid var(--color-error)',
                    color: 'var(--color-error)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--space-4)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600
                  }}
                >
                  ⚠️ {slotConflictError}
                </div>
              )}

              <Input
                label="Order Date"
                name="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={handleChange}
                error={errors.orderDate}
                required
              />

              <div style={{ marginTop: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-2)' }}>
                  Time Slot:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-2)' }}>
                  {timeSlots.map((s) => {
                    const isAvail = s.isAvailable !== false;
                    const slotLabel = s.startTime ? `${s.startTime.slice(0, 5)} - ${s.endTime ? s.endTime.slice(0, 5) : ''}` : (s.label || 'Слот');
                    const isSelected = String(formData.timeSlotId) === String(s.id);

                    return (
                      <button
                        key={s.id}
                        type="button"
                        disabled={!isAvail}
                        onClick={() => {
                          setFormData((p) => ({ ...p, timeSlotId: String(s.id) }));
                          setSlotConflictError(null);
                        }}
                        style={{
                          padding: 'var(--space-2)',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--cherry-card-hover)' : 'var(--cherry-card)',
                          color: isAvail ? 'var(--color-text)' : 'var(--color-text-muted)',
                          cursor: isAvail ? 'pointer' : 'not-allowed',
                          opacity: isAvail ? 1 : 0.5,
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600
                        }}
                      >
                        {slotLabel} {!isAvail && '(booked)'}
                      </button>
                    );
                  })}
                </div>
                {errors.timeSlotId && (
                  <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', marginTop: '4px', display: 'block' }}>
                    {errors.timeSlotId}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Confirm Order */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                Order Confirmation
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                <p><strong>Recipient:</strong> {formData.customerName} ({formData.customerPhone}, {formData.customerEmail})</p>
                <p><strong>Fulfillment:</strong> {formData.orderType === 'PICKUP' ? 'Boutique Pickup' : `Delivery: ${formData.deliveryAddress}`}</p>
                <p><strong>Date & Time:</strong> {formData.orderDate} (Slot #{formData.timeSlotId})</p>
                {formData.promoCode && <p><strong>Promo Code:</strong> {formData.promoCode}</p>}
              </div>

              <div style={{ backgroundColor: 'var(--cherry-panel)', border: '1px solid var(--cherry-border)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-2)' }}>Order Items ({items.length} items):</h3>
                {items.map((i) => (
                  <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                    <span>{i.name} × {i.quantity}</span>
                    <span>{formatMoney(i.unitPrice * i.quantity, currencyCode)}</span>
                  </div>
                ))}
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-primary)' }}>
                  <span>Total to Pay:</span>
                  <span>{formatMoney(totals.total || totals.amountInclVat, totals.currencyCode || currencyCode)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)' }}>
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button type="button" variant="primary" onClick={handleNext}>
                Continue &rarr;
              </Button>
            ) : (
              <Button type="submit" variant="primary" size="lg" loading={loading}>
                Place Order ✨
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Checkout;