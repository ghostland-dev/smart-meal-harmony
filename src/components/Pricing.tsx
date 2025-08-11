import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "toujours",
    description: "Parfait pour découvrir la planification médicale",
    features: [
      "1 programme par semaine",
      "2 supermarchés pour prix",
      "Profil neuropathique basique",
      "Support communautaire"
    ],
    cta: "Commencer",
    variant: "outline" as const,
    popular: false
  },
  {
    name: "Essentiel",
    price: "4,90€",
    period: "/mois",
    description: "Pour une planification alimentaire régulière",
    features: [
      "3 programmes personnalisés",
      "5 supermarchés comparés",
      "Export PDF listes courses",
      "Import protocoles CSV",
      "Support email"
    ],
    cta: "Choisir Essentiel",
    variant: "default" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "9,90€",
    period: "/mois",
    description: "La solution complète pour toute la famille",
    features: [
      "Programmes illimités",
      "IA conseils personnalisés",
      "Profils multiples",
      "10+ supermarchés",
      "Tableaux de bord avancés",
      "Support prioritaire"
    ],
    cta: "Choisir Premium",
    variant: "medical" as const,
    popular: true
  },
  {
    name: "Neuro+",
    price: "14,90€",
    period: "/mois",
    description: "Spécialisé pour les protocoles neuropathiques",
    features: [
      "Tout Premium inclus",
      "Analyse protocoles médicaux",
      "Import PDF/Excel avancé",
      "Alertes conflit nutritionnel",
      "Chat IA médical spécialisé",
      "Rapports pour médecins"
    ],
    cta: "Choisir Neuro+",
    variant: "accent" as const,
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Tarifs
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transparents
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins médicaux et nutritionnels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} variant="pricing" className={`relative ${plan.popular ? 'border-primary shadow-glow scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-medical">
                    Populaire
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3 mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card variant="medical" className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Version Professionnelle</CardTitle>
              <CardDescription>
                Pour les nutritionnistes, neurologues et naturopathes
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Pro Clinic - 49,90€/mois</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                    Gestion de 50 clients
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                    Rapports médicaux détaillés
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                    API intégration dossiers patients
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                    Formation équipe incluse
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <Button variant="medical" size="lg">
                  Contactez-nous
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Démo personnalisée disponible
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};