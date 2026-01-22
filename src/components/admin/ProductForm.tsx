import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAddProduct } from "@/hooks/useProducts";

export function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("9.50");
  const [stock, setStock] = useState("50");
  const [imageUrl, setImageUrl] = useState("");
  const [isSugarFree, setIsSugarFree] = useState(false);

  const addProduct = useAddProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProduct.mutate(
      {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url: imageUrl || null,
        is_sugar_free: isSugarFree,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setPrice("9.50");
          setStock("50");
          setImageUrl("");
          setIsSugarFree(false);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <h3 className="font-display text-lg font-semibold neon-text">
        Adicionar Novo Produto
      </h3>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monster Energy Ultra 473ml"
            required
            className="bg-secondary border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Lata 473ml - Sem Açúcar"
            className="bg-secondary border-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="bg-secondary border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="bg-secondary border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sugarFree">Sem Açúcar</Label>
          <Switch
            id="sugarFree"
            checked={isSugarFree}
            onCheckedChange={setIsSugarFree}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="neon"
        className="w-full"
        disabled={addProduct.isPending}
      >
        {addProduct.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Plus className="h-4 w-4 mr-2" />
        )}
        Adicionar Produto
      </Button>
    </form>
  );
}
