# 🌸 Cherry Cake — Quality Assurance & Testing Suite (/qa)

> **Team 9:** `t09-cherry-cake`  
> **QA Engineering Leads:** Muhammadyusuf Ismatov (QAJ — API & Math) & Asadbek Yulchiev (QAF — UI & Accessibility)  
> **Milestone:** Week 1 Foundation & Architecture Baseline  

---

## 1. Directory Structure

```text
qa/
├── postman/
│   ├── cherry-cake-api.postman_collection.json      # Complete API test suite (24 requests, 7 folders)
│   └── cherry-cake-local.postman_environment.json   # Local environment variables (localhost:8080)
├── test-cases/
│   └── formula-test-cases.md                        # Mathematical formula specifications across 16 countries
├── checklists/
│   └── ui-accessibility-checklist.md                # 320/768/1200px responsive, WCAG 2.1 AA, Lighthouse & axe
└── README.md                                        # QA documentation index & execution guide
```

---

## 2. Postman Collection Overview

The Postman suite located in [`qa/postman/`](postman/) covers all active Week 1 endpoints and planned Sprint contracts:

| Folder | Request Count | Coverage Summary |
|---|:---:|---|
| **1. Authentication & Security (JWT)** | 3 | Customer login, Admin login, Registration, Token auto-extraction |
| **2. Catalog & 16 Sovereign Regions** | 7 | 16 operating regions, currencies, VAT rates, categories, products, pickup points, delivery zones |
| **3. Cart & BigDecimal Financial Engine** | 5 | Standard cart, item modifiers, promo codes (`WELCOME10`), multi-country recalculations (UZB, FIN, KAZ) |
| **4. Order Management & Checkout** | 3 | Server-side price-locked order creation, order lookup by ID, user order history |
| **5. Table Bookings & Reservations** | 2 | Calendar slot availability, table reservation with double-booking conflict prevention |
| **6. Admin Business Intelligence** | 2 | Aggregated sales revenue report (JSON), accounting CSV export |
| **7. Error Handling & Validation** | 2 | 400 Bad Request on invalid region, Jakarta Bean validation on empty cart |

---

## 3. How to Run the Tests

### Option A: Using Postman Desktop App
1. Open Postman.
2. Click **Import** in the top left corner.
3. Drag and drop both files:
   - `qa/postman/cherry-cake-api.postman_collection.json`
   - `qa/postman/cherry-cake-local.postman_environment.json`
4. In the top-right environment selector, choose **Cherry Cake - Localhost (Spring Boot 3.3)**.
5. Click on the collection name $\to$ Click **Run collection** $\to$ Click **Run Cherry Cake**.

### Option B: Automated Execution via Newman CLI
To execute the entire test suite directly from your terminal with automated HTML/CLI reporting:

```powershell
# 1. Install newman globally (if not already installed)
npm install -g newman

# 2. Run the collection against the local Spring Boot server
newman run qa/postman/cherry-cake-api.postman_collection.json -e qa/postman/cherry-cake-local.postman_environment.json
```

---

## 4. Test Specifications & Quality Checklists

- [**Formula Test Cases (16 Countries)**](test-cases/formula-test-cases.md): Mathematical trace tables comparing inputs to outputs down to two decimal places across regional VAT rates and discount tiers.
- [**UI & Accessibility Checklist**](checklists/ui-accessibility-checklist.md): Breakpoint testing (320px, 768px, 1200px), WCAG 2.1 AA contrast rules, axe-core scans, and Google Lighthouse criteria.

