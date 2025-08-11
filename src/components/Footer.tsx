export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="text-xl font-bold">SmartMealPlanner</span>
            </div>
            <p className="text-sm text-background/70">
              La planification alimentaire intelligente pour vos contraintes médicales
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#features" className="hover:text-background transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-background transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Démo</a></li>
              <li><a href="#" className="hover:text-background transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Statut</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Conditions</a></li>
              <li><a href="#" className="hover:text-background transition-colors">RGPD</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Sécurité</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/70">
            © 2024 SmartMealPlanner. Tous droits réservés.
          </p>
          <p className="text-sm text-background/70 mt-4 md:mt-0">
            Ne remplace pas un avis médical professionnel
          </p>
        </div>
      </div>
    </footer>
  );
};