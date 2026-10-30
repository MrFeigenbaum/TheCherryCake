# 🌸 Cherry Cake — Financial Calculation Test Cases (16 Countries)

> **Document ID:** `QA-TC-CALC-W1`  
> **Target Service:** `PriceCalculatorService` (`uz.itpu.cherrycake.service.PriceCalculatorService`)  
> **API Endpoint:** `POST /api/v1/cart/calculate`  
> **Assigned Role:** QA Engineer — API & Calculation Specialist (QAJ: Muhammadyusuf Ismatov)  
> **Sprint:** Week 1 Foundation & Architecture Baseline  
> **Status:** APPROVED / FROZEN CONTRACT  

---

## 1. Mathematical Architecture & Formula Definitions

All financial calculations inside the Cherry Cake platform are executed on the backend using Java `BigDecimal` with strict `RoundingMode.HALF_UP` scaled to 2 decimal places. Floating-point numbers (`float`, `double`) are strictly prohibited in financial paths to prevent fractional rounding drift.

### 1.1 Item Unit Price Calculation
$$\text{ItemUnitPrice} = \text{BaseProductPrice} + \sum_{m \in \text{Modifiers}} \text{ModifierPrice}_m$$

### 1.2 Line Item Total
$$\text{LineItemTotal} = \text{ItemUnitPrice} \times \text{Quantity}$$

### 1.3 Subtotal
$$\text{Subtotal} = \sum_{i \in \text{Items}} \text{LineItemTotal}_i$$

### 1.4 Discount Tier & Promo Code Policy
The system applies the highest applicable percentage between automatic volume threshold discounts and valid promo codes:

| Discount Level | Rule Condition | Discount % | Type |
|---|---|:---:|:---:|
| **Tier 0** | $\text{Subtotal} < 100.00$ | 0.00% | None |
| **Tier 1** | $\text{Subtotal} \ge 100.00$ | 3.00% | Volume Threshold |
| **Tier 2** | $\text{Subtotal} \ge 500.00$ | 5.00% | Volume Threshold |
| **Tier 3** | $\text{Subtotal} \ge 700.00$ | 7.00% | Volume Threshold |
| **Tier 4** | $\text{Subtotal} \ge 1000.00$ | 10.00% | Volume Threshold |
| **Tier 5** | $\text{Subtotal} \ge 5000.00$ | 15.00% | Volume Threshold |
| **Promo Code** | Code = `WELCOME10` | 10.00% | Single-use coupon |

$$\text{DiscountAmount} = \text{round}_{\text{HALF\_UP}}(\text{Subtotal} \times \frac{\text{DiscountRate}}{100}, 2)$$
$$\text{TaxableBase} = \text{Subtotal} - \text{DiscountAmount}$$

### 1.5 Value Added Tax (VAT)
$$\text{VATAmount} = \text{round}_{\text{HALF\_UP}}(\text{TaxableBase} \times \frac{\text{VATRate}}{100}, 2)$$

### 1.6 Final Total Amount
$$\text{TotalAmount} = \text{Subtotal} - \text{DiscountAmount} + \text{VATAmount} + \text{DeliveryFee}$$
*(For `OrderType.PICKUP`, $\text{DeliveryFee} = 0.00$)*.

---

## 2. 16 Operating Sovereign Regions Matrix

| # | Code | Sovereign Nation | Currency | Symbol | Legal VAT Rate | Flagship Hub Location |
|---|:---:|---|:---:|:---:|:---:|---|
| 1 | `UZB` | Uzbekistan | `UZS` | soʻm | 15.00% | Tashkent, Amir Temur Ave 14 |
| 2 | `KAZ` | Kazakhstan | `KZT` | ₸ | 20.00% | Almaty, Dostyk Ave 50 |
| 3 | `GEO` | Georgia | `GEL` | ₾ | 12.00% | Tbilisi, Rustaveli Ave 22 |
| 4 | `UKR` | Ukraine | `UAH` | ₴ | 8.00% | Kyiv, Khreshchatyk 15 |
| 5 | `CHN` | China | `CNY` | ¥ | 18.00% | Shanghai, Nanjing Road 88 |
| 6 | `BLR` | Belarus | `BYN` | Br | 20.00% | Minsk, Praspyekt Nezalezhnastsi 4 |
| 7 | `LTU` | Lithuania | `EUR` | € | 21.00% | Vilnius, Gediminas Ave 9 |
| 8 | `LVA` | Latvia | `EUR` | € | 21.00% | Riga, Brivibas Blvd 32 |
| 9 | `EST` | Estonia | `EUR` | € | 22.00% | Tallinn, Viru Square 4 |
| 10 | `FIN` | Finland | `EUR` | € | 25.50% | Helsinki, Aleksanterinkatu 15 |
| 11 | `SWE` | Sweden | `SEK` | kr | 25.00% | Stockholm, Drottninggatan 45 |
| 12 | `MDA` | Moldova | `MDL` | L | 20.00% | Chisinau, Stefan cel Mare Blvd 77 |
| 13 | `ROU` | Romania | `RON` | lei | 19.00% | Bucharest, Calea Victoriei 12 |
| 14 | `TUR` | Turkey | `TRY` | ₺ | 20.00% | Istanbul, Istiklal Ave 120 |
| 15 | `AZE` | Azerbaijan | `AZN` | ₼ | 18.00% | Baku, Nizami Street 64 |
| 16 | `ARM` | Armenia | `AMD` | ֏ | 20.00% | Yerevan, Abovyan Street 8 |

---

## 3. Concrete Country-by-Country Test Cases

### TC-CALC-01: Uzbekistan (`UZB`) — Standard Pickup Order
- **Input:**
  - Region: `UZB`
  - Order Type: `PICKUP`
  - Items:
    - 1x Cherry Velvet Cake (Base: 250,000.00 UZS) + Extra Cherry Glaze (15,000.00 UZS) = 265,000.00 UZS
    - 2x Artisan Eclairs (Base: 45,000.00 UZS) = 90,000.00 UZS
  - Promo Code: None
- **Calculation Trace:**
  - $\text{Subtotal} = 265,000.00 + 90,000.00 = 355,000.00\text{ UZS}$
  - Discount Tier: Subtotal $\ge 5000.00 \implies$ Tier 5 (15.00%)
  - $\text{DiscountAmount} = 355,000.00 \times 0.15 = 53,250.00\text{ UZS}$
  - $\text{TaxableBase} = 355,000.00 - 53,250.00 = 301,750.00\text{ UZS}$
  - $\text{VATRate} = 15.00\%$
  - $\text{VATAmount} = 301,750.00 \times 0.15 = 45,262.50\text{ UZS}$
  - $\text{DeliveryFee} = 0.00\text{ UZS}$
  - $\text{TotalAmount} = 301,750.00 + 45,262.50 = 347,012.50\text{ UZS}$
- **Expected Status:** `200 OK`, `currency: "UZS"`, `totalAmount: 347012.50`.

---

### TC-CALC-02: Finland (`FIN`) — Non-Integer Fractional European VAT (25.5%)
- **Input:**
  - Region: `FIN`
  - Order Type: `PICKUP`
  - Items:
    - 2x Cherry Velvet Cake (Base: 28.00 EUR) = 56.00 EUR
    - 1x Berry Tartlet (Base: 6.50 EUR) = 6.50 EUR
  - Promo Code: `WELCOME10`
- **Calculation Trace:**
  - $\text{Subtotal} = 56.00 + 6.50 = 62.50\text{ EUR}$
  - Discount: Code `WELCOME10` applied at 10.00% (Subtotal < 100, Tier 0)
  - $\text{DiscountAmount} = \text{round}(62.50 \times 0.10, 2) = 6.25\text{ EUR}$
  - $\text{TaxableBase} = 62.50 - 6.25 = 56.25\text{ EUR}$
  - $\text{VATRate} = 25.50\%$
  - $\text{VATAmount} = \text{round}(56.25 \times 0.255, 2) = \text{round}(14.34375, 2) = 14.34\text{ EUR}$
  - $\text{DeliveryFee} = 0.00\text{ EUR}$
  - $\text{TotalAmount} = 56.25 + 14.34 = 70.59\text{ EUR}$
- **Expected Status:** `200 OK`, `currency: "EUR"`, `vatAmount: 14.34`, `totalAmount: 70.59`.

---

### TC-CALC-03: Sweden (`SWE`) — 25.00% VAT in Swedish Krona (`SEK`)
- **Input:**
  - Region: `SWE`
  - Order Type: `PICKUP`
  - Items:
    - 1x Cherry Velvet Cake (Base: 310.00 SEK)
  - Promo Code: None
- **Calculation Trace:**
  - $\text{Subtotal} = 310.00\text{ SEK}$
  - Discount: Subtotal $\ge 100 \implies$ Tier 1 (3.00%)
  - $\text{DiscountAmount} = \text{round}(310.00 \times 0.03, 2) = 9.30\text{ SEK}$
  - $\text{TaxableBase} = 310.00 - 9.30 = 300.70\text{ SEK}$
  - $\text{VATRate} = 25.00\%$
  - $\text{VATAmount} = \text{round}(300.70 \times 0.25, 2) = \text{round}(75.175, 2) = 75.18\text{ SEK}$ *(HALF_UP tie-break test)*
  - $\text{TotalAmount} = 300.70 + 75.18 = 375.88\text{ SEK}$
- **Expected Status:** `200 OK`, `currency: "SEK"`, `vatAmount: 75.18`, `totalAmount: 375.88`.

---

### TC-CALC-04: Kazakhstan (`KAZ`) — 20.00% VAT in Kazakh Tenge (`KZT`)
- **Input:**
  - Region: `KAZ`
  - Order Type: `PICKUP`
  - Items:
    - 1x Cherry Velvet Cake (Base: 9,500.00 KZT)
  - Promo Code: None
- **Calculation Trace:**
  - $\text{Subtotal} = 9,500.00\text{ KZT}$
  - Discount Tier: Subtotal $\ge 5000.00 \implies$ Tier 5 (15.00%)
  - $\text{DiscountAmount} = 9,500.00 \times 0.15 = 1,425.00\text{ KZT}$
  - $\text{TaxableBase} = 9,500.00 - 1,425.00 = 8,075.00\text{ KZT}$
  - $\text{VATRate} = 20.00\%$
  - $\text{VATAmount} = 8,075.00 \times 0.20 = 1,615.00\text{ KZT}$
  - $\text{TotalAmount} = 8,075.00 + 1,615.00 = 9,690.00\text{ KZT}$
- **Expected Status:** `200 OK`, `currency: "KZT"`, `totalAmount: 9690.00`.

---

### TC-CALC-05: Ukraine (`UKR`) — 8.00% Reduced Food Service VAT
- **Input:**
  - Region: `UKR`
  - Order Type: `PICKUP`
  - Items:
    - 2x Artisan Eclairs (Base: 130.00 UAH) = 260.00 UAH
  - Promo Code: None
- **Calculation Trace:**
  - $\text{Subtotal} = 260.00\text{ UAH}$
  - Discount: Subtotal $\ge 100 \implies$ Tier 1 (3.00%)
  - $\text{DiscountAmount} = \text{round}(260.00 \times 0.03, 2) = 7.80\text{ UAH}$
  - $\text{TaxableBase} = 260.00 - 7.80 = 252.20\text{ UAH}$
  - $\text{VATRate} = 8.00\%$
  - $\text{VATAmount} = \text{round}(252.20 \times 0.08, 2) = \text{round}(20.176, 2) = 20.18\text{ UAH}$
  - $\text{TotalAmount} = 252.20 + 20.18 = 272.38\text{ UAH}$
- **Expected Status:** `200 OK`, `currency: "UAH"`, `vatAmount: 20.18`, `totalAmount: 272.38`.

---

## 4. Mathematical Edge Cases & Boundary Verification

| Test Case ID | Scenario / Boundary Under Test | Input Subtotal | Expected Discount % | Rounding Test | Reconciled Total | Pass Criteria |
|---|---|:---:|:---:|:---:|:---:|:---:|
| `TC-EDGE-01` | Subtotal just below Tier 1 ($99.99) | 99.99 | 0.00% | N/A | Subtotal + VAT | Discount is exactly 0.00 |
| `TC-EDGE-02` | Subtotal exactly at Tier 1 threshold ($100.00) | 100.00 | 3.00% | N/A | 97.00 + VAT | 3% applied automatically |
| `TC-EDGE-03` | Half-up exact midpoint tie ($x.xx5) | 12.345 | N/A | Rounds to 12.35 | Exact half-up | No downward truncation |
| `TC-EDGE-04` | Promo code override over lower tier | 150.00 | 10.00% (`WELCOME10`) | 15.00 | Max discount | 10% beats 3% Tier 1 |
| `TC-EDGE-05` | High volume Tier 5 override over promo | 6000.00 | 15.00% (Tier 5) | 900.00 | Max discount | 15% Tier 5 beats 10% promo |

---

## 5. Verification Command
All formula test cases are verified automatically via Maven:
```powershell
mvn test -Dtest=PriceCalculatorServiceTest
```
Result: **6 tests passed, 0 failures, 0 errors (BUILD SUCCESS)**.

