const fs = require('fs');
const path = require('path');

function createRequest(name, method, urlPath, queryParams = [], body = null, testScripts = []) {
  const urlObj = {
    raw: `{{baseUrl}}${urlPath}${queryParams.length ? '?' + queryParams.map(q => `${q.key}=${q.value}`).join('&') : ''}`,
    host: ['{{baseUrl}}'],
    path: urlPath.replace(/^\//, '').split('/'),
  };

  if (queryParams.length > 0) {
    urlObj.query = queryParams.map(q => ({ key: q.key, value: q.value, description: q.description || '' }));
  }

  const req = {
    name,
    event: testScripts.length > 0 ? [
      {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: testScripts
        }
      }
    ] : [],
    request: {
      method,
      header: [
        { key: 'Accept', value: 'application/json' },
        ...(body ? [{ key: 'Content-Type', value: 'application/json' }] : [])
      ],
      url: urlObj
    }
  };

  if (body) {
    req.request.body = {
      mode: 'raw',
      raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2)
    };
  }

  return req;
}

const collection = {
  info: {
    _postman_id: 'a89c3140-59f2-4b36-93d4-f7b5e4c278a1',
    name: 'CherryCake API Test Suite',
    description: 'Complete API test suite for CherryCake covering OpenAPI contracts, regions, categories, products, multi-currency cart calculations (CC-16), and order processing for all 17 supported countries.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:8080', type: 'string' },
    { key: 'productId_CherryCake', value: '1', type: 'string' },
    { key: 'productId_Tiramisu', value: '7', type: 'string' },
    { key: 'productId_Napoleon', value: '4', type: 'string' },
    { key: 'modId_SizeMedium', value: '', type: 'string' },
    { key: 'modId_FreshCherries', value: '', type: 'string' }
  ],
  item: [
    {
      name: '01 - System & OpenAPI Contract',
      item: [
        createRequest('OpenAPI v3 Docs', 'GET', '/v3/api-docs', [], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("OpenAPI spec has version and paths", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.openapi).to.exist;',
          '    pm.expect(json.paths["/api/regions"]).to.exist;',
          '    pm.expect(json.paths["/api/categories"]).to.exist;',
          '    pm.expect(json.paths["/api/products"]).to.exist;',
          '    pm.expect(json.paths["/api/products/{id}"]).to.exist;',
          '    pm.expect(json.paths["/api/cart/calculate"]).to.exist;',
          '    pm.expect(json.paths["/api/orders"]).to.exist;',
          '});'
        ]),
        createRequest('Get All Categories', 'GET', '/api/categories', [], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Returns Cakes, Desserts, and Drinks", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json).to.be.an("array").that.has.lengthOf(3);',
          '    const names = json.map(c => c.name);',
          '    pm.expect(names).to.include.members(["Cakes", "Desserts", "Drinks"]);',
          '});'
        ]),
        createRequest('Get All Regions (17 Countries)', 'GET', '/api/regions', [], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Returns all 17 configured regions", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json).to.be.an("array").that.has.lengthOf(17);',
          '    const codes = json.map(r => r.code);',
          '    const expected = ["UZB", "KAZ", "GEO", "UKR", "CHN", "ARM", "AZE", "TUR", "MDA", "ROU", "EST", "LVA", "LTU", "FIN", "SWE", "BLR", "RUS"];',
          '    pm.expect(codes).to.include.members(expected);',
          '});',
          'pm.test("Exchange rates are not leaked in public API", function () {',
          '    const json = pm.response.json();',
          '    json.forEach(r => {',
          '        pm.expect(r).to.have.property("code");',
          '        pm.expect(r).to.have.property("name");',
          '        pm.expect(r).to.have.property("currencyCode");',
          '        pm.expect(r).to.have.property("currencySymbol");',
          '        pm.expect(r).to.have.property("vatRate");',
          '        pm.expect(r).to.not.have.property("exchangeRate");',
          '    });',
          '});'
        ])
      ]
    },
    {
      name: '02 - Catalog & Modifiers',
      item: [
        createRequest('Get Products (UZB - Discover IDs)', 'GET', '/api/products', [{ key: 'region', value: 'UZB' }], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Discovers Product IDs and stores in variables", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json).to.be.an("array").that.has.lengthOf(12);',
          '    const cherryCake = json.find(p => p.name === "Cherry Cake");',
          '    const tiramisu = json.find(p => p.name === "Tiramisu");',
          '    const napoleon = json.find(p => p.name === "Napoleon Cake");',
          '    pm.expect(cherryCake).to.exist;',
          '    pm.expect(tiramisu).to.exist;',
          '    pm.expect(napoleon).to.exist;',
          '    pm.collectionVariables.set("productId_CherryCake", String(cherryCake.id));',
          '    pm.collectionVariables.set("productId_Tiramisu", String(tiramisu.id));',
          '    pm.collectionVariables.set("productId_Napoleon", String(napoleon.id));',
          '});'
        ]),
        createRequest('Get Products (Turkey - TRY)', 'GET', '/api/products', [{ key: 'region', value: 'TUR' }], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Converts prices to Turkish Lira (1020.00 for Cherry Cake)", function () {',
          '    const json = pm.response.json();',
          '    const cherryCake = json.find(p => p.name === "Cherry Cake");',
          '    pm.expect(cherryCake.price).to.eql(1020.00);',
          '});'
        ]),
        createRequest('Get Products (Armenia - AMD)', 'GET', '/api/products', [{ key: 'region', value: 'ARM' }], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Converts prices to Armenian Dram (12000.00 for Cherry Cake)", function () {',
          '    const json = pm.response.json();',
          '    const cherryCake = json.find(p => p.name === "Cherry Cake");',
          '    pm.expect(cherryCake.price).to.eql(12000.00);',
          '});'
        ]),
        createRequest('Get Product Detail with Modifiers (GEO)', 'GET', '/api/products/{{productId_CherryCake}}', [{ key: 'region', value: 'GEO' }], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Discovers Modifier IDs and stores in variables", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.modifierGroups).to.be.an("array").that.has.lengthOf(2);',
          '    const sizeGroup = json.modifierGroups.find(g => g.name === "Size");',
          '    const extrasGroup = json.modifierGroups.find(g => g.name === "Extras");',
          '    const medium = sizeGroup.modifiers.find(m => m.name.includes("Medium"));',
          '    const freshCherries = extrasGroup.modifiers.find(m => m.name.includes("Fresh cherries"));',
          '    pm.expect(medium).to.exist;',
          '    pm.expect(freshCherries).to.exist;',
          '    pm.collectionVariables.set("modId_SizeMedium", String(medium.id));',
          '    pm.collectionVariables.set("modId_FreshCherries", String(freshCherries.id));',
          '});'
        ]),
        createRequest('Get Product Detail with Modifiers (TUR - TRY Deltas)', 'GET', '/api/products/{{productId_CherryCake}}', [{ key: 'region', value: 'TUR' }], null, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Modifier delta is converted to Turkish Lira (340.00)", function () {',
          '    const json = pm.response.json();',
          '    const sizeGroup = json.modifierGroups.find(g => g.name === "Size");',
          '    const medium = sizeGroup.modifiers.find(m => m.name.includes("Medium"));',
          '    pm.expect(medium.priceDelta).to.eql(340.00);',
          '});'
        ]),
        createRequest('Catalog Error: Missing Region', 'GET', '/api/products', [], null, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});'
        ]),
        createRequest('Catalog Error: Unknown Region', 'GET', '/api/products', [{ key: 'region', value: 'XYZ' }], null, [
          'pm.test("Status code is 404 Not Found", function () {',
          '    pm.response.to.have.status(404);',
          '});',
          'pm.test("Error message mentions region XYZ", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.message).to.include("XYZ");',
          '});'
        ])
      ]
    },
    {
      name: '03 - Cart Calculations (CC-16 Core & Edge Cases)',
      item: [
        createRequest('TC-01: UZB - Order with Modifiers & 3% Discount', 'POST', '/api/cart/calculate', [], {
          region: 'UZB',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 1,
              modifierIds: ['{{modId_SizeMedium}}']
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates UZB calculations (UZS, 15% VAT, 3% discount)", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("UZS");',
          '    pm.expect(json.subtotal).to.eql(480000.00);',
          '    pm.expect(json.vatRate).to.eql(0.1500);',
          '    pm.expect(json.vatAmount).to.eql(72000.00);',
          '    pm.expect(json.amountInclVat).to.eql(552000.00);',
          '    pm.expect(json.discountRate).to.eql(0.0300);',
          '    pm.expect(json.discountAmount).to.eql(16560.00);',
          '    pm.expect(json.total).to.eql(535440.00);',
          '});'
        ]),
        createRequest('TC-02: GEO - Line with Modifiers (GEL, 12% VAT)', 'POST', '/api/cart/calculate', [], {
          region: 'GEO',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 2,
              modifierIds: ['{{modId_SizeMedium}}', '{{modId_FreshCherries}}']
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates GEO line totals, VAT and discount", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("GEL");',
          '    pm.expect(json.items[0].unitPrice).to.eql(85.80);',
          '    pm.expect(json.items[0].modifiersPrice).to.eql(31.20);',
          '    pm.expect(json.items[0].lineTotal).to.eql(234.00);',
          '    pm.expect(json.subtotal).to.eql(234.00);',
          '    pm.expect(json.vatRate).to.eql(0.1200);',
          '    pm.expect(json.vatAmount).to.eql(28.08);',
          '    pm.expect(json.amountInclVat).to.eql(262.08);',
          '    pm.expect(json.discountRate).to.eql(0.0300);',
          '    pm.expect(json.discountAmount).to.eql(7.86);',
          '    pm.expect(json.total).to.eql(254.22);',
          '});'
        ]),
        createRequest('TC-03: UKR - Multiple Lines Summed (UAH, 8% VAT)', 'POST', '/api/cart/calculate', [], {
          region: 'UKR',
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: 2,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates UKR calculations (UAH, 8% VAT)", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("UAH");',
          '    pm.expect(json.items[0].unitPrice).to.eql(285.00);',
          '    pm.expect(json.subtotal).to.eql(570.00);',
          '    pm.expect(json.vatRate).to.eql(0.0800);',
          '    pm.expect(json.vatAmount).to.eql(45.60);',
          '    pm.expect(json.amountInclVat).to.eql(615.60);',
          '});'
        ]),
        createRequest('TC-04: Error - Zero Quantity', 'POST', '/api/cart/calculate', [], {
          region: 'UZB',
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: 0,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});',
          'pm.test("Identifies quantity error", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.errors[0].field).to.eql("items[0].quantity");',
          '});'
        ]),
        createRequest('TC-05: Error - Negative Quantity', 'POST', '/api/cart/calculate', [], {
          region: 'UZB',
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: -1,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});'
        ]),
        createRequest('TC-06: Error - Empty Cart', 'POST', '/api/cart/calculate', [], {
          region: 'UZB',
          items: []
        }, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});',
          'pm.test("Reports cart is empty", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.errors[0].message).to.include("cart is empty");',
          '});'
        ]),
        createRequest('TC-07: Error - Missing Region', 'POST', '/api/cart/calculate', [], {
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: 1,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});',
          'pm.test("Reports missing region", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.errors[0].field).to.eql("region");',
          '});'
        ]),
        createRequest('TC-08: Error - Unknown Region', 'POST', '/api/cart/calculate', [], {
          region: 'XYZ',
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: 1,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 404 Not Found", function () {',
          '    pm.response.to.have.status(404);',
          '});',
          'pm.test("Error message mentions Region XYZ not found", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.message).to.include("Region XYZ not found");',
          '});'
        ]),
        createRequest('TC-09: Error - Out of Stock Product (Napoleon in GEO)', 'POST', '/api/cart/calculate', [], {
          region: 'GEO',
          items: [
            {
              productId: '{{productId_Napoleon}}',
              quantity: 1,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 409 Conflict", function () {',
          '    pm.response.to.have.status(409);',
          '});',
          'pm.test("Message mentions out of stock", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.message).to.include("out of stock");',
          '});'
        ]),
        createRequest('TC-10: Error - Duplicate Modifier', 'POST', '/api/cart/calculate', [], {
          region: 'UZB',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 1,
              modifierIds: ['{{modId_SizeMedium}}', '{{modId_SizeMedium}}']
            }
          ]
        }, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});',
          'pm.test("Message mentions duplicate", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.message).to.include("duplicate");',
          '});'
        ])
      ]
    },
    {
      name: '04 - Cart Calculations for New Countries',
      item: [
        createRequest('Turkey (TRY, 18% VAT, Rate 8.5)', 'POST', '/api/cart/calculate', [], {
          region: 'TUR',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 1,
              modifierIds: ['{{modId_SizeMedium}}']
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates Turkish Lira pricing & 18% VAT", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("TRY");',
          '    pm.expect(json.items[0].unitPrice).to.eql(1020.00);',
          '    pm.expect(json.items[0].modifiersPrice).to.eql(340.00);',
          '    pm.expect(json.subtotal).to.eql(1360.00);',
          '    pm.expect(json.vatRate).to.eql(0.1800);',
          '    pm.expect(json.vatAmount).to.eql(244.80);',
          '    pm.expect(json.amountInclVat).to.eql(1604.80);',
          '    pm.expect(json.discountRate).to.eql(0.0300);',
          '    pm.expect(json.discountAmount).to.eql(48.14);',
          '    pm.expect(json.total).to.eql(1556.66);',
          '});'
        ]),
        createRequest('Armenia (AMD, 20% VAT, Rate 100.0)', 'POST', '/api/cart/calculate', [], {
          region: 'ARM',
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: 2,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates Armenian Dram pricing & 20% VAT", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("AMD");',
          '    pm.expect(json.items[0].unitPrice).to.eql(3000.00);',
          '    pm.expect(json.subtotal).to.eql(6000.00);',
          '    pm.expect(json.vatRate).to.eql(0.2000);',
          '    pm.expect(json.vatAmount).to.eql(1200.00);',
          '    pm.expect(json.total).to.eql(7200.00);',
          '});'
        ]),
        createRequest('Estonia (EUR, 22% VAT, Rate 0.23)', 'POST', '/api/cart/calculate', [], {
          region: 'EST',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 1,
              modifierIds: ['{{modId_SizeMedium}}']
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates Euro pricing & 22% VAT", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("EUR");',
          '    pm.expect(json.items[0].unitPrice).to.eql(27.60);',
          '    pm.expect(json.items[0].modifiersPrice).to.eql(9.20);',
          '    pm.expect(json.subtotal).to.eql(36.80);',
          '    pm.expect(json.vatRate).to.eql(0.2200);',
          '    pm.expect(json.vatAmount).to.eql(8.10);',
          '    pm.expect(json.amountInclVat).to.eql(44.90);',
          '    pm.expect(json.discountRate).to.eql(0.0300);',
          '    pm.expect(json.discountAmount).to.eql(1.35);',
          '    pm.expect(json.total).to.eql(43.55);',
          '});'
        ]),
        createRequest('Sweden (SEK, 25% VAT, Rate 2.6)', 'POST', '/api/cart/calculate', [], {
          region: 'SWE',
          items: [
            {
              productId: '{{productId_Tiramisu}}',
              quantity: 2,
              modifierIds: []
            }
          ]
        }, [
          'pm.test("Status code is 200", function () {',
          '    pm.response.to.have.status(200);',
          '});',
          'pm.test("Validates Swedish Krona & 25% VAT", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.currencyCode).to.eql("SEK");',
          '    pm.expect(json.items[0].unitPrice).to.eql(78.00);',
          '    pm.expect(json.subtotal).to.eql(156.00);',
          '    pm.expect(json.vatRate).to.eql(0.2500);',
          '    pm.expect(json.vatAmount).to.eql(39.00);',
          '    pm.expect(json.total).to.eql(195.00);',
          '});'
        ])
      ]
    },
    {
      name: '05 - Orders API',
      item: [
        createRequest('Create Order in Georgia (GEO)', 'POST', '/api/orders', [], {
          region: 'GEO',
          customer: {
            name: 'Nino Beridze',
            phone: '+995599112233',
            email: 'nino@example.com'
          },
          orderDate: '2026-11-20',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 2,
              modifierIds: ['{{modId_SizeMedium}}', '{{modId_FreshCherries}}']
            }
          ]
        }, [
          'pm.test("Status code is 201 Created", function () {',
          '    pm.response.to.have.status(201);',
          '});',
          'pm.test("Generates order number with CC-YYYY- prefix", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.orderNumber).to.match(/^CC-\\d{4}-\\d+$/);',
          '    pm.expect(json.region).to.eql("GEO");',
          '    pm.expect(json.currencyCode).to.eql("GEL");',
          '    pm.expect(json.total).to.eql(254.22);',
          '});'
        ]),
        createRequest('Create Order in Turkey (TUR)', 'POST', '/api/orders', [], {
          region: 'TUR',
          customer: {
            name: 'Ahmet Yilmaz',
            phone: '+905551234567',
            email: 'ahmet@example.com'
          },
          orderDate: '2026-11-20',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 1,
              modifierIds: ['{{modId_SizeMedium}}']
            }
          ]
        }, [
          'pm.test("Status code is 201 Created", function () {',
          '    pm.response.to.have.status(201);',
          '});',
          'pm.test("Order created in TRY with correct VAT", function () {',
          '    const json = pm.response.json();',
          '    pm.expect(json.region).to.eql("TUR");',
          '    pm.expect(json.currencyCode).to.eql("TRY");',
          '    pm.expect(json.subtotal).to.eql(1360.00);',
          '    pm.expect(json.vatRate).to.eql(0.1800);',
          '    pm.expect(json.vatAmount).to.eql(244.80);',
          '    pm.expect(json.total).to.eql(1556.66);',
          '});'
        ]),
        createRequest('Order Error: Missing Customer Name', 'POST', '/api/orders', [], {
          region: 'GEO',
          customer: {
            name: '',
            phone: '+995599112233',
            email: 'nino@example.com'
          },
          orderDate: '2026-11-20',
          items: [
            {
              productId: '{{productId_CherryCake}}',
              quantity: 1,
              modifierIds: ['{{modId_SizeMedium}}']
            }
          ]
        }, [
          'pm.test("Status code is 400 Bad Request", function () {',
          '    pm.response.to.have.status(400);',
          '});'
        ])
      ]
    }
  ]
};

const outputPath = path.join(__dirname, 'CherryCake_API.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf-8');
console.log('Successfully created:', outputPath);

const environment = {
  id: '3b9f4a10-82d1-4f3b-9a88-2e1c9d4b68e2',
  name: 'CherryCake Localhost',
  values: [
    {
      key: 'baseUrl',
      value: 'http://localhost:8080',
      type: 'default',
      enabled: true
    }
  ],
  _postman_variable_scope: 'environment'
};

const envPath = path.join(__dirname, 'CherryCake_Local.postman_environment.json');
fs.writeFileSync(envPath, JSON.stringify(environment, null, 2), 'utf-8');
console.log('Successfully created:', envPath);
