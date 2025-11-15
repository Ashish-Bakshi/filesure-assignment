import { API } from "@/lib/api";

export async function createPurchase(productId = "demo-product", amount = 10) {
  return API.post("/purchase", { productId, amount });
}
