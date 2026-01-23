import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';

const Index = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={itemCount}
        onCartClick={() => setIsOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductCatalog onAddToCart={addItem} />
      </main>

      <Cart
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        total={total}
      />

      <Footer />
    </div>
  );
};

export default Index;
