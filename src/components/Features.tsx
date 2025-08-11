import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import priceImage from "@/assets/price-comparison.jpg";

const features = [
  {
    title: "Programmes Neuropathiques",
    description: "Importez vos protocoles médicaux (PDF/Excel) et générez automatiquement des menus adaptés à la neuropathie.",
    icon: "🧠",
    details: ["Import de protocoles personnalisés", "Adaptation vitamine B12/magnésium", "Alertes conflit nutritionnel"]
  },
  {
    title: "Comparaison Prix Intelligente",
    description: "Comparez les prix en temps réel sur 10+ supermarchés et économisez jusqu'à 30% sur vos courses.",
    icon: "💰",
    details: ["Prix temps réel Carrefour/Leclerc", "Optimisation budgétaire IA", "Substituts économiques"]
  },
  {
    title: "IA Médicale Avancée",
    description: "Notre IA analyse vos contraintes médicales et génère des conseils nutritionnels personnalisés.",
    icon: "🤖",
    details: ["Chat médical interactif", "Détection incohérences", "Suggestions ajustements"]
  },
  {
    title: "Tableaux de Bord Professionnel",
    description: "Suivez vos apports nutritionnels avec des visualisations médicales de qualité clinique.",
    icon: "📊",
    details: ["Suivi vitamine B12/magnésium", "Historique programmes", "Rapports médicaux"]
  },
  {
    title: "Profils Multiples",
    description: "Gérez plusieurs profils : neuropathique, diabétique, sportif, famille avec des contraintes différentes.",
    icon: "👥",
    details: ["Profils spécialisés", "Contraintes individuelles", "Gestion famille"]
  },
  {
    title: "Listes Courses Optimisées",
    description: "Générez automatiquement vos listes de courses consolidées avec priorisation des aliments critiques.",
    icon: "📝",
    details: ["Consolidation 7/30 jours", "Priorisation médicale", "Export drive supermarchés"]
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Fonctionnalités
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Avancées
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une plateforme complète pour la planification alimentaire médicale avec intelligence artificielle
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} variant="feature" className="group">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature showcases */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Tableau de Bord Médical</h3>
            <p className="text-muted-foreground">
              Visualisez vos apports nutritionnels avec des graphiques de qualité médicale. 
              Suivez vos niveaux de vitamine B12, magnésium et autres nutriments critiques pour la neuropathie.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-secondary mr-3"></div>
                <span>Suivi nutritionnel en temps réel</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-accent mr-3"></div>
                <span>Alertes de seuils critiques</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span>Historique et tendances</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src={dashboardImage}
              alt="Tableau de bord médical nutritionnel"
              className="rounded-2xl shadow-glow w-full"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-20">
          <div className="relative lg:order-1">
            <img 
              src={priceImage}
              alt="Comparaison prix supermarchés"
              className="rounded-2xl shadow-glow w-full"
            />
          </div>
          <div className="space-y-6 lg:order-2">
            <h3 className="text-2xl font-bold">Comparaison Prix Intelligente</h3>
            <p className="text-muted-foreground">
              Économisez jusqu'à 30% sur vos courses grâce à notre comparateur de prix en temps réel 
              sur plus de 10 supermarchés français.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-secondary mr-3"></div>
                <span>Prix en temps réel Carrefour, Leclerc...</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-accent mr-3"></div>
                <span>Suggestions substituts économiques</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span>Optimisation automatique du budget</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};