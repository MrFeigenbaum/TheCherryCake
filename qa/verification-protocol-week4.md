# Протокол сверки отчетов о продажах (Week 4 Verification Protocol)

## 1. Методология сверки
Сверка проводится между 4 источниками данных:
1. **Эталонный SQL-запрос** напрямую в СУБД (PostgreSQL / H2)
2. **REST API JSON-ответ** (`GET /api/reports/sales`)
3. **CSV-экспорт** (`GET /api/reports/sales?format=CSV`)
4. **PDF-документ с таблицей и диаграммой** (`GET /api/reports/sales?format=PDF`)

### Эталонный SQL-запрос
```sql
SELECT 
    r.code AS group_key,
    COUNT(o.id) AS orders_count,
    ROUND(COALESCE(SUM(o.subtotal), 0), 2) AS subtotal,
    ROUND(COALESCE(SUM(o.vat_amount), 0), 2) AS vat_amount,
    ROUND(COALESCE(SUM(o.discount_amount), 0), 2) AS discount_amount,
    ROUND(COALESCE(SUM(o.delivery_fee), 0), 2) AS delivery_fee,
    ROUND(COALESCE(SUM(o.total_amount), 0), 2) AS total
FROM orders o
JOIN regions r ON o.region_id = r.id
WHERE o.status IN ('CONFIRMED', 'DONE')
  AND o.order_date BETWEEN '2026-02-01' AND '2026-03-31'
GROUP BY r.code
ORDER BY r.code;
```

---

## 2. Результаты сверки для Набора №1: Все регионы (2026-02-01 — 2026-03-31, groupBy=REGION)

| Метрика / Строка | SQL Эталон | JSON API | CSV Экспорт | PDF Таблица | Статус |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Строка UZ (Заказов)** | 3 | 3 | 3 | 3 | OK |
| **Строка UZ Subtotal** | 766.43 | 766.43 | 766.43 | 766.43 | OK |
| **Строка UZ VAT** | 91.97 | 91.97 | 91.97 | 91.97 | OK |
| **Строка UZ Discount** | 62.32 | 62.32 | 62.32 | 62.32 | OK |
| **Строка UZ Delivery** | 5.00 | 5.00 | 5.00 | 5.00 | OK |
| **Строка UZ Total** | 801.08 | 801.08 | 801.08 | 801.08 | OK |
| **Строка KZ (Заказов)** | 2 | 2 | 2 | 2 | OK |
| **Строка KZ Subtotal** | 450.00 | 450.00 | 450.00 | 450.00 | OK |
| **Строка KZ Total** | 493.20 | 493.20 | 493.20 | 493.20 | OK |
| **Строка RU (Заказов)** | 2 | 2 | 2 | 2 | OK |
| **Строка RU Subtotal** | 360.00 | 360.00 | 360.00 | 360.00 | OK |
| **Строка RU Total** | 425.60 | 425.60 | 425.60 | 425.60 | OK |
| **KPI Total Orders** | 7 | 7 | 7 | 7 | OK |
| **KPI Total Revenue** | 1719.88 | 1719.88 | 1719.88 | 1719.88 | OK |
| **KPI Average Check** | 245.70 | 245.70 | 245.70 | 245.70 | OK |

---

## 3. Результаты сверки для Набора №2: Фильтр по региону UZ (2026-02-01 — 2026-03-31)

| Метрика / Строка | SQL Эталон | JSON API | CSV Экспорт | PDF Таблица | Статус |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Orders Count** | 3 | 3 | 3 | 3 | OK |
| **Subtotal** | 766.43 | 766.43 | 766.43 | 766.43 | OK |
| **VAT Amount** | 91.97 | 91.97 | 91.97 | 91.97 | OK |
| **Discount Amount**| 62.32 | 62.32 | 62.32 | 62.32 | OK |
| **Total Revenue** | 801.08 | 801.08 | 801.08 | 801.08 | OK |
| **Average Check** | 267.03 | 267.03 | 267.03 | 267.03 | OK |

---

## 4. Результаты сверки для Набора №3: Группировка по месяцам (groupBy=MONTH)

| Период / Месяц | SQL Orders | SQL Total | JSON Orders | JSON Total | CSV Total | PDF Total | Статус |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **2026-02** | 4 | 663.08 | 4 | 663.08 | 663.08 | 663.08 | OK |
| **2026-03** | 3 | 1056.80 | 3 | 1056.80 | 1056.80 | 1056.80 | OK |
| **ИТОГО** | 7 | 1719.88 | 7 | 1719.88 | 1719.88 | 1719.88 | OK |

---

## 5. Проверка формата файлов и спецификации
- **CSV**: Кодировка UTF-8 со стартовым маркером байтов BOM (`\uFEFF`), разделитель запятая `,`, числа с 2 десятичными знаками, заголовок строго соответствует Глоссарию: `period,region,ordersCount,subtotal,vatAmount,discountAmount,deliveryFee,total`.
- **PDF**: В шапке указаны фильтры (`from`, `to`, `region`, `groupBy`) и дата генерации `generatedAt` в ISO UTC. Диаграмма JFreeChart отображает идентичные итоговые суммы. Числовые колонки выровнены по правому краю с форматированием `0.00`.
- **Итог**: 100% совпадение математических значений во всех четырех представлениях.

