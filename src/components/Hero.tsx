import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical-food.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Planification Alimentaire
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Intelligente & Médicale
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Générez des programmes alimentaires personnalisés adaptés à vos contraintes médicales 
                (neuropathie, diabète, allergies) avec comparaison des prix en temps réel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="animate-pulse-glow">
                Démarrer Gratuitement
              </Button>
              <Button variant="outline" size="xl">
                Voir la démo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-secondary"></div>
                <span>Protocoles neuropathiques</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span>Comparaison prix 10+ supermarchés</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>IA médicale avancée</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow animate-float">
              <img 
                src={heroImage} 
                alt="Aliments sains sur surface médicale"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-medical animate-pulse-glow">
              Certifié Médical
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-medical animate-pulse-glow delay-1000">
              Économies -30%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};