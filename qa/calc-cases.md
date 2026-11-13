# Тест-кейсы на формулы, API, заказы и бронь (C01-C27, O01-O11, B01-B06)

## 1. Калькулятор цен (C01-C27)
Базовые ставки для тестового стенда:
- `UZ`: VAT 12% (`0.12`), валюта UZS
- `KZ`: VAT 12% (`0.12`), валюта KZT
- `RU`: VAT 20% (`0.20`), валюта RUB
- Пороги скидки: $\ge 200.00 \to 5\%$ (`0.05`), $\ge 500.00 \to 10\%$ (`0.10`)
- Промокод: `PROMO10` $\to 10\%$ (`0.10`)
- Доставка: зона «Центр» = 5.00

| ID | Входные данные | Ожидаемый результат | Что проверяет | Статус |
|:---|:---|:---|:---|:---|
| **C01** | UZ, 1 товар 100.00 × 1, PICKUP | subtotal 100.00, vatRate 0.12, vatAmount 12.00, amountInclVat 112.00, discountAmount 0.00, deliveryFee 0.00, total 112.00 | Базовый расчёт | PASS |
| **C02** | RU, тот же товар (цена 120.00) × 1, PICKUP | subtotal 120.00, vatRate 0.20, vatAmount 24.00, amountInclVat 144.00, total 144.00 | НДС и цена по региону | PASS |
| **C03** | UZ, 100.00 × 2 + модификатор +10.00 | unitPrice 110.00, lineTotal 220.00, vat 26.40, amountInclVat 246.40, discount 12.32 (5%), total 234.08 | Модификатор + порог 200 | PASS |
| **C04** | UZ, subtotal 178.58 | vat 21.43, incl 200.01 $\ge$ 200.00 $\to$ discount 10.00 (5%) | Порог $\ge$ с НДС | PASS |
| **C05** | UZ, subtotal 178.56 | vat 21.43, incl 199.99 < 200.00 $\to$ discount 0.00 | Граница порога снизу | PASS |
| **C06** | UZ, subtotal 178.57 | vat 21.43, incl ровно 200.00 $\to$ discount 10.00 | Ровно граница ($\ge$, не >) | PASS |
| **C07** | UZ, subtotal 446.43 | vat 53.57, incl 500.00 $\to$ discount 50.00 (10%) | Второй порог | PASS |
| **C08** | C03 + DELIVERY зона Центр (fee 5.00) | fee 5.00, total 239.08 (234.08 + 5.00) | Доставка добавляется после скидки | PASS |
| **C09** | C08, но PICKUP | deliveryFee 0.00, total 234.08 | Самовывоз | PASS |
| **C10** | UZ, 33.33 × 3 | subtotal 99.99, vat 12.00 (11.9988 $\to$ 12.00), total 111.99 | Округление HALF_UP | PASS |
| **C11** | UZ, 0.01 × 1 | subtotal 0.01, vat 0.00, total 0.01 | Минимальная сумма | PASS |
| **C12** | quantity = 0 | HTTP 400 Bad Request, errors: `items[0].quantity` | Валидация min = 1 | PASS |
| **C13** | quantity = −1 | HTTP 400 Bad Request | Валидация положительного числа | PASS |
| **C14** | quantity = 1.5 | HTTP 400 Bad Request | Валидация целочисленного значения | PASS |
| **C15** | quantity = "abc" | HTTP 400 Bad Request | Валидация типа | PASS |
| **C16** | Товар с available=false в регионе | HTTP 400 Bad Request («Товар недоступен в выбранном регионе») | Проверка региональной доступности | PASS |
| **C17** | Обязательная группа модификаторов не выбрана | HTTP 400 Bad Request | Валидация isRequired | PASS |
| **C18** | SINGLE-группа с двумя выбранными modifierIds | HTTP 400 Bad Request | Валидация типа SINGLE | PASS |
| **C19** | Промокод PROMO10 (10%) при incl 112.00 | discountRate 0.10, discountAmount 11.20, total 100.80 | Применение промокода | PASS |
| **C20** | Промокод просрочен (`validTo` в прошлом) | HTTP 400 Bad Request («Промокод недействителен») | Валидация срока промокода | PASS |
| **C21** | Промокод 10% + порог 5% | discountRate 0.10 (берется $\max(10\%, 5\%)$, не 15%) | Правило $\max$ | PASS |
| **C22** | Запрос без параметра `?region` | HTTP 400 Bad Request | Обязательность региона | PASS |
| **C23** | Запрос с несуществующим регионом `?region=XX` | HTTP 404 Not Found | Проверка существования региона | PASS |
| **C24** | Пустой массив `items: []` | HTTP 400 Bad Request | Валидация непустой корзины | PASS |
| **C25** | Смена региона UZ $\to$ RU на одном наборе | Валюта, vatRate (0.12 $\to$ 0.20), unitPrice и все суммы пересчитываются | Полный пересчёт по региону | PASS |
| **C26** | DELIVERY без `deliveryZoneId` | HTTP 400 Bad Request | Обязательность зоны при доставке | PASS |
| **C27** | Ответ API `/api/cart/calculate` vs экран корзины | Совпадение 1 в 1 по всем 11 полям | Сверка Front = API | PASS |

---

## 2. Заказы и слоты (O01-O11)

| ID | Сценарий | Ожидаемый результат | Статус |
|:---|:---|:---|:---|
| **O01** | PICKUP + точка самовывоза + свободный слот | HTTP 201 Created, orderNumber `CC-2026-XXXXXX`, статус `NEW`, суммы совпадают с `/api/cart/calculate` | PASS |
| **O02** | DELIVERY + зона доставки | `deliveryFee` равно тарифу зоны, `total` включает доставку | PASS |
| **O03** | PICKUP без указания `pickupPointId` | HTTP 400 Bad Request | PASS |
| **O04** | `orderDate` в прошлом | HTTP 400 Bad Request | PASS |
| **O05** | Заказ в слот с `bookedCount >= capacity` | HTTP 409 Conflict, счетчик `bookedCount` не изменился | PASS |
| **O06** | 5 параллельных запросов в слот с capacity = 3 | Ровно 3 успешных 201 Created, 2 отказа 409 Conflict, `bookedCount = 3` | PASS |
| **O07** | Фронтенд прислал `total = 1.00` в теле запроса | Игнорируется, сервер сохраняет результат своей формулы | PASS |
| **O08** | `GET /api/orders/my` без JWT токена | HTTP 401 Unauthorized | PASS |
| **O09** | `GET /api/orders/my` с валидным JWT | Список содержит только заказы текущего авторизованного пользователя | PASS |
| **O10** | Смена статуса заказа `NEW` $\to$ `DONE` напрямую | HTTP 400 / 409 Conflict (запрещённый переход минуя `CONFIRMED`) | PASS |
| **O11** | Изменение цены товара в админке после оформления | Ранее оформленный заказ отображает зафиксированные на момент покупки суммы | PASS |

---

## 3. Бронирование столиков (B01-B06)

| ID | Сценарий | Ожидаемый результат | Статус |
|:---|:---|:---|:---|
| **B01** | 2 гостя, 19:00, столики свободны | HTTP 201 Created, `bookingNumber` вида `BK-2026-XXXXXX`, столик с минимальной подходящей вместимостью | PASS |
| **B02** | Все столики подходящей вместимости заняты в интервале $\pm 2$ часа | HTTP 409 Conflict («Нет свободного столика на это время, попробуйте другое») | PASS |
| **B03** | Та же дата, то же количество гостей, время 21:30 (за пределами окна 19:00) | HTTP 201 Created на тот же столик | PASS |
| **B04** | Количество гостей 13 или 0 | HTTP 400 Bad Request (допустимо 1-12) | PASS |
| **B05** | Время бронирования 23:30 (кафе закрыто) | HTTP 400 Bad Request | PASS |
| **B06** | Дата бронирования в прошлом | HTTP 400 Bad Request | PASS |

---

## 4. RBAC-матрица доступа

| Путь | Метод | Гость | CUSTOMER | VIEWER | STAFF | ADMIN |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| `/api/products` | GET | 200 | 200 | 200 | 200 | 200 |
| `/api/cart/calculate` | POST | 200 | 200 | 200 | 200 | 200 |
| `/api/orders` | POST | 201 | 201 | 201 | 201 | 201 |
| `/api/orders/my` | GET | 401 | 200 | 200 | 200 | 200 |
| `/api/bookings` | POST | 201 | 201 | 201 | 201 | 201 |
| `/api/bookings/my` | GET | 401 | 200 | 200 | 200 | 200 |
| `/api/reports/sales` | GET | 401 | 403 | 200 | 200 | 200 |
| `/api/admin/orders` | GET | 401 | 403 | 403 | 200 | 200 |
| `/api/admin/products` | POST | 401 | 403 | 403 | 403 | 201 |
| `/api/admin/regions/**` | PUT | 401 | 403 | 403 | 403 | 200 |

