import assert from "node:assert/strict";
// Uruchomienie: cd server && npx tsx test-api.ts
// Opcjonalna zmienna BASE_URL wskazuje inny serwer.
// Skrypt sprawdza statusy HTTP, filtry, sortowanie i metadane paginacji.
const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const cases: { name: string; query: string; status: number }[] = [
  {
    "name": "Wszystkie produkty",
    "query": "",
    "status": 200
  },
  {
    "name": "Wyszukiwanie po nazwie/opisie",
    "query": "search=keyboard",
    "status": 200
  },
  {
    "name": "Minimalna cena",
    "query": "minPrice=100",
    "status": 200
  },
  {
    "name": "Maksymalna cena",
    "query": "maxPrice=500",
    "status": 200
  },
  {
    "name": "Zakres cen",
    "query": "minPrice=100&maxPrice=500",
    "status": 200
  },
  {
    "name": "Cena rosnąco",
    "query": "sort=price_asc",
    "status": 200
  },
  {
    "name": "Cena malejąco",
    "query": "sort=price_desc",
    "status": 200
  },
  {
    "name": "Najnowsze",
    "query": "sort=newest",
    "status": 200
  },
  {
    "name": "Pierwsza strona, 5 produktów",
    "query": "page=1&limit=5",
    "status": 200
  },
  {
    "name": "Druga strona",
    "query": "page=2&limit=5",
    "status": 200
  },
  {
    "name": "Wyszukiwanie i cena",
    "query": "search=keyboard&minPrice=100&maxPrice=1000",
    "status": 200
  },
  {
    "name": "Wyszukiwanie i sortowanie",
    "query": "search=keyboard&sort=price_asc",
    "status": 200
  },
  {
    "name": "Wszystko razem",
    "query": "search=keyboard&minPrice=100&maxPrice=1000&sort=price_asc&page=1&limit=10",
    "status": 200
  },
  {
    "name": "Błędna strona",
    "query": "page=0&limit=10",
    "status": 400
  },
  {
    "name": "Błędny limit",
    "query": "page=1&limit=0",
    "status": 400
  },
  {
    "name": "Zbyt duży limit",
    "query": "page=1&limit=101",
    "status": 400
  },
  {
    "name": "Błędne minPrice",
    "query": "minPrice=abc",
    "status": 400
  },
  {
    "name": "Błędne maxPrice",
    "query": "maxPrice=abc",
    "status": 400
  },
  {
    "name": "Błędne sortowanie",
    "query": "sort=random",
    "status": 400
  }
];

let failures = 0;
for (const [index, test] of cases.entries()) {
  const url = `${baseUrl}/api/products${test.query ? `?${test.query}` : ""}`;
  console.log(`\n${index + 1}. ${test.name}\nGET ${url}`);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    const body = await response.text();
    console.log(`HTTP ${response.status}\n${body}`);
    if (response.status !== test.status) {
      throw new Error(`Oczekiwano HTTP ${test.status}, otrzymano ${response.status}`);
    }
    const data = JSON.parse(body);
    if (test.status === 200) {
      const params = new URL(url).searchParams;
      assert.ok(Array.isArray(data.products), "Oczekiwano obiektu z tablicą products");
      assert.equal(data.page, Number(params.get("page") ?? 1), "Nieprawidłowa strona");
      assert.equal(data.limit, Number(params.get("limit") ?? 10), "Nieprawidłowy limit");
      assert.equal(data.count, data.products.length, "Nieprawidłowy count");
      assert.ok(data.products.length <= data.limit, "Przekroczono limit produktów");
      const products = data.products as { name: string; description: string | null; price: string | number; created_at: string }[];
      for (const product of products) {
        const search = params.get("search");
        if (search) assert.ok(`${product.name} ${product.description ?? ""}`.toLowerCase().includes(search.toLowerCase()), "Produkt nie pasuje do wyszukiwania");
        const price = Number(product.price);
        assert.ok(Number.isFinite(price), "Nieprawidłowa cena produktu");
        if (params.has("minPrice")) assert.ok(price >= Number(params.get("minPrice")), "Cena poniżej minimum");
        if (params.has("maxPrice")) assert.ok(price <= Number(params.get("maxPrice")), "Cena powyżej maksimum");
      }
      const sort = params.get("sort") ?? "newest";
      for (let i = 1; i < products.length; i++) {
        const previous = products[i - 1]!;
        const current = products[i]!;
        if (sort === "price_asc") assert.ok(Number(previous.price) <= Number(current.price), "Nieprawidłowe sortowanie rosnące");
        if (sort === "price_desc") assert.ok(Number(previous.price) >= Number(current.price), "Nieprawidłowe sortowanie malejące");
        if (sort === "newest") assert.ok(Date.parse(previous.created_at) >= Date.parse(current.created_at), "Nieprawidłowe sortowanie po dacie");
      }
    } else {
      assert.equal(typeof data.message, "string", "Brak komunikatu błędu");
    }
    console.log("OK");
  } catch (error) {
    failures++;
    console.error(`BŁĄD: ${error instanceof Error ? error.message : String(error)}`);
  }
}
console.log(`\nWynik: ${cases.length - failures}/${cases.length} zaliczonych scenariuszy.`);
process.exitCode = failures > 0 ? 1 : 0;
export {};
