import { Header } from "@/components/Header";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { Package } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="font-display text-3xl font-bold">
                <span className="neon-text">PAINEL</span> ADMIN
              </h1>
            </div>
            <p className="text-muted-foreground">
              Gerencie seus produtos e estoque
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProductForm />
            </div>
            <div className="lg:col-span-2">
              <ProductTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
