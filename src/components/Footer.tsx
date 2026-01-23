const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} EnergyTi. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
