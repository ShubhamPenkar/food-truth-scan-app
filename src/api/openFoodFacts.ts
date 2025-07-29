// src/api/openFoodFacts.ts

export async function fetchProductByBarcode(barcode: string) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 0) {
      throw new Error("Product not found");
    }

    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}
