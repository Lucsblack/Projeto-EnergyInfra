import { useState } from "react";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProducts, useUpdateStock, useDeleteProduct } from "@/hooks/useProducts";
import { Product } from "@/types/product";

function StockControl({ product }: { product: Product }) {
  const [stock, setStock] = useState(product.stock);
  const updateStock = useUpdateStock();

  const handleUpdate = (newStock: number) => {
    if (newStock < 0) return;
    setStock(newStock);
    updateStock.mutate({ id: product.id, stock: newStock });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleUpdate(stock - 1)}
        disabled={stock <= 0 || updateStock.isPending}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => handleUpdate(parseInt(e.target.value) || 0)}
        className="w-20 h-8 text-center bg-secondary"
        disabled={updateStock.isPending}
      />

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleUpdate(stock + 1)}
        disabled={updateStock.isPending}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function ProductTable() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="text-muted-foreground">Nenhum produto cadastrado</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Produto</TableHead>
            <TableHead className="text-muted-foreground">Preço</TableHead>
            <TableHead className="text-muted-foreground">Estoque</TableHead>
            <TableHead className="text-muted-foreground">Zero Açúcar</TableHead>
            <TableHead className="text-right text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-border">
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-display font-semibold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </TableCell>
              <TableCell>
                <StockControl product={product} />
              </TableCell>
              <TableCell>
                {product.is_sugar_free ? (
                  <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                    Sim
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                    Não
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover Produto</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover "{product.name}"? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-secondary">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProduct.mutate(product.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
