import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MealPlanGenerator } from '@/components/meal-planning/MealPlanGenerator';
import { MealPlanList } from '@/components/meal-planning/MealPlanList';
import { MealPlanViewer } from '@/components/meal-planning/MealPlanViewer';
import { GroceryListGenerator } from '@/components/grocery/GroceryListGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Calendar, ShoppingCart, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  total_cost: number | null;
  meals: any;
  created_at: string;
}

const MealPlanning = () => {
  const { user, loading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('generator');
  const [groceryPlanId, setGroceryPlanId] = useState<string | undefined>();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePlanGenerated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('plans');
  };

  const handleViewPlan = (plan: MealPlan) => {
    setSelectedPlan(plan);
    setActiveTab('viewer');
  };

  const handleBackToPlanList = () => {
    setSelectedPlan(null);
    setActiveTab('plans');
  };

  const handleGenerateGroceryList = (planId: string) => {
    setGroceryPlanId(planId);
    setActiveTab('grocery');
  };

  const handleGroceryListCreated = () => {
    setGroceryPlanId(undefined);
    setActiveTab('plans');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Planification des Repas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Créez des plans de repas personnalisés adaptés à vos besoins médicaux et générez automatiquement vos listes de courses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Créer
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mes Plans
            </TabsTrigger>
            <TabsTrigger value="viewer" disabled={!selectedPlan} className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Détails
            </TabsTrigger>
            <TabsTrigger value="grocery" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <MealPlanGenerator />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <MealPlanList 
              onViewPlan={handleViewPlan}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>

          <TabsContent value="viewer" className="space-y-6">
            {selectedPlan ? (
              <MealPlanViewer 
                plan={selectedPlan}
                onBack={handleBackToPlanList}
                onGenerateGroceryList={handleGenerateGroceryList}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Sélectionnez un plan de repas pour voir les détails
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="grocery" className="space-y-6">
            <GroceryListGenerator 
              mealPlanId={groceryPlanId}
              onListCreated={handleGroceryListCreated}
            />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-medical transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Génération IA</CardTitle>
              </div>
              <CardDescription>
                Créez des plans de repas personnalisés en tenant compte de vos contraintes médicales et préférences alimentaires
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-medical transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-secondary" />
                <CardTitle className="text-lg">Organisation</CardTitle>
              </div>
              <CardDescription>
                Planifiez vos repas sur plusieurs jours avec un aperçu détaillé des calories et coûts estimés
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-medical transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-6 w-6 text-accent" />
                <CardTitle className="text-lg">Listes de courses</CardTitle>
              </div>
              <CardDescription>
                Générez automatiquement vos listes de courses organisées par catégorie avec estimation des coûts
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanning;