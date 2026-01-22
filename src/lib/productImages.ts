import monsterUltra from "@/assets/monster-ultra.jpg";
import monsterTradicional from "@/assets/monster-tradicional.jpg";
import monsterZero from "@/assets/monster-zero.jpg";

// Map product names to local images
export const productImages: Record<string, string> = {
  "Monster Energy Ultra 473ml": monsterUltra,
  "Monster Tradicional 473ml": monsterTradicional,
  "Monster Tradicional 473ml Sem Açúcar": monsterZero,
};

export function getProductImage(productName: string, fallbackUrl?: string | null): string {
  return productImages[productName] || fallbackUrl || "/placeholder.svg";
}
