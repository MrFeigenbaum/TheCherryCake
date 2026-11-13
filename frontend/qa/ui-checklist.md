# Чеклист интерфейса и доступности (QA Frontend UI Checklist)

## 1. Общие правила для всех экранов
- [x] **Дизайн-система**: Все цвета строго соответствуют палитре токенов (`--color-primary: #7B1E3C`, `--color-primary-hover: #5E1530`, `--color-accent: #F5E6D3`, `--color-text: #222222`, `--color-border: #DDDDDD`).
- [x] **Шкала отступов**: Все отступы берутся из сетки `--space-1` (4px) — `--space-8` (64px).
- [x] **Типографика**: Иерархия заголовков `h1` $\to$ `h2` $\to$ `h3` без пропусков уровней.
- [x] **Интерактивные элементы**: Минимальный размер области нажатия (Touch Target) $\ge 44 \times 44$ px, зазор между кликабельными элементами $\ge 8$ px.
- [x] **Фокус клавиатуры**: Видимое кольцо фокуса (`outline: 2px solid #7B1E3C`, `outline-offset: 2px`) на всех интерактивных элементах при навигации клавишей `Tab`.
- [x] **Контрастность**: Коэффициент контрастности основного текста к фону $\ge 4.5:1$ (соответствие WCAG AA).
- [x] **Состояния компонентов**:
  - Кнопки: `default`, `hover`, `active`, `focus-visible`, `disabled`.
  - Поля ввода: `empty`, `filled`, `focus`, `error` (с текстом ошибки под полем), `disabled`.
  - Списки данных: `loading` (спиннер/скелетон), `empty` (дружелюбная заглушка EmptyState), `error` (сообщение об ошибке + кнопка повтора).

---

## 2. Постраничные чеклисты

### 2.1. Шапка (Header) и переключатель региона
- [x] Селектор страны `<select data-testid="country-switcher">` загружает активные регионы из `/api/regions`.
- [x] При смене страны значение записывается в `localStorage['cc_region']`.
- [x] При смене страны инициируется пересчет цен в каталоге и корзине.
- [x] Бейдж корзины `<button data-testid="cart-badge">` динамически отображает суммарное число товаров.
- [x] Кнопка выхода `<button data-testid="header-logout">` очищает сессию (`cc_token`, `cc_user`).

### 2.2. Каталог и Меню
- [x] Вкладки категорий поддерживают атрибуты `role="tablist"` и `role="tab"`.
- [x] Карточка товара имеет атрибут `data-testid="product-card-${id}"`.
- [x] Кнопка добавления в корзину имеет атрибут `data-testid="product-add-${id}"`.
- [x] При `available == false` карточка товара снабжена бейджем «Нет в наличии», кнопка заблокирована (`disabled`).

### 2.3. Модальное окно товара (ProductModal)
- [x] Поле ввода количества `<input data-testid="modal-quantity" type="number" min="1" step="1">`.
- [x] Валидация количества: при вводе 0, отрицательного или дробного значения кнопка добавления блокируется.
- [x] Группы модификаторов `SINGLE` отображаются как Radio-group, группы `MULTI` — как Checkbox-group.
- [x] Если группа `isRequired`, выбор опции обязателен для разблокировки добавления.
- [x] Кнопка «Добавить в корзину» имеет атрибут `data-testid="modal-add"`.

### 2.4. Корзина (Cart Drawer / Page)
- [x] Строка каждого товара `<div data-testid="cart-item-${id}">`.
- [x] Поле количества `<input data-testid="cart-qty-${id}">` с кнопками «−» и «+».
- [x] Кнопка удаления `<button data-testid="cart-remove-${id}" aria-label="Удалить">`.
- [x] Поле промокода `<input data-testid="cart-promo-input">` и кнопка `<button data-testid="cart-promo-apply">`.
- [x] Блок итогов содержит обязательные data-testid:
  - `cart-subtotal`
  - `cart-vat`
  - `cart-amount-incl-vat`
  - `cart-discount`
  - `cart-delivery-fee`
  - `cart-total`
- [x] Кнопка перехода к чекауту `<button data-testid="cart-checkout">`.

### 2.5. Пошаговое оформление заказа (Checkout Stepper)
- [x] 4 шага оформления: `checkout-step-1`, `checkout-step-2`, `checkout-step-3`, `checkout-step-4`.
- [x] Шаг 1: `checkout-name`, `checkout-phone`, `checkout-email`, `checkout-next`.
- [x] Шаг 2: `checkout-type-pickup`, `checkout-type-delivery`, `checkout-pickup-point`, `checkout-delivery-zone`, `checkout-back`, `checkout-next`.
- [x] Шаг 3: `checkout-date` (не ранее сегодня), тайм-слоты `slot-HH-MM` (занятые имеют `disabled`), `checkout-back`, `checkout-next`.
- [x] Шаг 4: сводка, `checkout-promo`, `checkout-submit`.
- [x] Экран успеха: отображение номера заказа `<strong data-testid="order-success-number">`.

### 2.6. Бронирование столиков (Booking)
- [x] Поле даты `<input data-testid="booking-date">` (не ранее сегодня).
- [x] Селектор времени `<select data-testid="booking-time">` (10:00-22:00).
- [x] Поле гостей `<input data-testid="booking-guests">` (целое число от 1 до 12).
- [x] Кнопка отправки `<button data-testid="booking-submit">`.
- [x] Успешное бронирование: номер `<span data-testid="booking-number">`.
- [x] Конфликт бронирования (409): сообщение об ошибке `<div data-testid="booking-error">`.

### 2.7. Авторизация и Личный кабинет
- [x] Форма входа: `login-email`, `login-password`, `login-submit`.
- [x] Форма регистрации: `register-submit`.
- [x] Кабинет: история заказов `<div data-testid="account-orders">`, карточка заказа `data-testid="account-order-${orderNumber}"`.
- [x] Кабинет: история бронирований `<div data-testid="account-bookings">`.

### 2.8. Отчёты о продажах (Reports)
- [x] Фильтры: `report-from`, `report-to`, `report-region`, `report-groupby`, `report-apply`.
- [x] Карточка выручки `<div data-testid="kpi-total">`.
- [x] График Chart.js `<canvas data-testid="report-chart"></canvas>`.
- [x] Таблица строк отчёта `<div data-testid="report-table">`.
- [x] Экспорт: кнопки `report-csv` и `report-pdf`.

