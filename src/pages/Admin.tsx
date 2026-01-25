import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  Boxes,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  useAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';
import { toast } from 'sonner';
import { Product } from '@/lib/mockData';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
}

const defaultFormData: ProductFormData = {
  name: '',
  description: '',
  price: 9.5,
  stock_quantity: 0,
  image_url: '',
};

type StockFilter = 'all' | 'in_stock' | 'out_stock';

const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const safeNumber = (value: string, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const Admin = () => {
  const { data: products, isLoading } = useAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const isSaving = createProduct.isPending || updateProduct.isPending;
  const isDeleting = deleteProduct.isPending;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  const [query, setQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const stats = useMemo(() => {
    const list = products ?? [];
    const total = list.length;
    const out = list.filter((p) => (p.stock_quantity ?? 0) <= 0).length;
    const inStock = total - out;
    return { total, inStock, out };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const list = products ?? [];
    const q = query.trim().toLowerCase();

    return list
      .filter((p) => {
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q);

        const stock = p.stock_quantity ?? 0;
        const matchesStock =
          stockFilter === 'all'
            ? true
            : stockFilter === 'in_stock'
              ? stock > 0
              : stock <= 0;

        return matchesQuery && matchesStock;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query, stockFilter]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validação simples (sem libs)
    if (!formData.name.trim()) return toast.error('Informe o nome do produto.');
    if (!formData.description.trim())
      return toast.error('Informe a descrição do produto.');
    if (formData.price <= 0) return toast.error('Preço deve ser maior que 0.');
    if (formData.stock_quantity < 0)
      return toast.error('Estoque não pode ser negativo.');
    if (!formData.image_url.trim())
      return toast.error('Informe a URL da imagem.');

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...formData,
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct.mutateAsync({
          ...formData,
          is_active: true,
        });
        toast.success('Produto criado com sucesso!');
      }
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar produto');
    }
  };

  const updateStock = async (product: Product, delta: number) => {
    const current = product.stock_quantity ?? 0;
    const next = Math.max(0, current + delta);

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        stock_quantity: next,
      });
      toast.success('Estoque atualizado!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar estoque');
    }
  };

  const confirmDelete = (product: Product) => {
    setDeleteTarget(product);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;

    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success('Produto excluído com sucesso!');
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir produto');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" aria-label="Voltar para home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <div className="leading-tight">
              <h1 className="text-lg font-bold text-foreground">
                Administração
              </h1>
              <p className="text-xs text-muted-foreground">
                Gerencie produtos e estoque
              </p>
            </div>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) closeDialog();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Novo produto
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar produto' : 'Novo produto'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Preview */}
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md border bg-muted">
                      {formData.image_url ? (
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display =
                              'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Preview da imagem
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cole a URL e confira se está carregando corretamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Nome
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Monster Energy Ultra"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Descrição
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Lata 473ml (sem açúcar)"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Preço (R$)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: safeNumber(e.target.value, 0),
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Estoque
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock_quantity: Math.max(
                              0,
                              Math.trunc(safeNumber(e.target.value, 0))
                            ),
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      URL da imagem
                    </label>
                    <Input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto space-y-6 px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Boxes className="h-4 w-4" />
                Total de produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Package className="h-4 w-4" />
                Em estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inStock}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Esgotados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.out}</div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-base">Produtos e estoque</CardTitle>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nome ou descrição..."
                    className="pl-9"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={stockFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStockFilter('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    type="button"
                    variant={stockFilter === 'in_stock' ? 'default' : 'outline'}
                    onClick={() => setStockFilter('in_stock')}
                  >
                    Em estoque
                  </Button>
                  <Button
                    type="button"
                    variant={stockFilter === 'out_stock' ? 'default' : 'outline'}
                    onClick={() => setStockFilter('out_stock')}
                  >
                    Esgotados
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="w-[140px]">Preço</TableHead>
                      <TableHead className="w-[160px]">Status</TableHead>
                      <TableHead className="w-[140px]">Estoque</TableHead>
                      <TableHead className="w-[120px] text-right">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stock = product.stock_quantity ?? 0;
                      const isOut = stock <= 0;

                      return (
                        <TableRow key={product.id} className="hover:bg-muted/40">
                          {/* Produto */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 rounded-md object-cover border border-border"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Preço */}
                          <TableCell className="font-medium">
                            {formatPrice(product.price)}
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <span
                              className={[
                                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                                isOut
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-primary/10 text-primary',
                              ].join(' ')}
                            >
                              {isOut ? 'Esgotado' : 'Disponível'}
                            </span>
                          </TableCell>

                          {/* Estoque actions */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={isSaving || stock <= 0}
                                onClick={() => updateStock(product, -1)}
                                aria-label="Diminuir estoque"
                              >
                                −
                              </Button>

                              <span className="w-10 text-center text-sm font-medium tabular-nums">
                                {stock}
                              </span>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={isSaving}
                                onClick={() => updateStock(product, +1)}
                                aria-label="Aumentar estoque"
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(product)}
                                aria-label="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => confirmDelete(product)}
                                aria-label="Excluir"
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-10 text-center">
                <p className="font-medium text-foreground">
                  Nenhum produto encontrado
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente ajustar a busca ou cadastre um novo produto.
                </p>
                <Button className="mt-4 gap-2" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Cadastrar produto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete confirm */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O produto{' '}
                <span className="font-medium text-foreground">
                  {deleteTarget?.name}
                </span>{' '}
                será removido do catálogo.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Admin;
