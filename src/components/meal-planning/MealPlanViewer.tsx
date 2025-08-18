import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Clock, ArrowLeft, ShoppingCart } from 'lucide-react';

interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  total_cost: number | null;
  meals: any;
  created_at: string;
}

interface MealPlanViewerProps {
  plan: MealPlan;
  onBack: () => void;
  onGenerateGroceryList: (planId: string) => void;
}

export const MealPlanViewer: React.FC<MealPlanViewerProps> = ({ 
  plan, 
  onBack, 
  onGenerateGroceryList 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'petit-déjeuner':
        return '🌅';
      case 'déjeuner':
        return '☀️';
      case 'dîner':
        return '🌙';
      case 'collation':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const getTotalCalories = (dayMeals: any): number => {
    if (!dayMeals) return 0;
    return Object.values(dayMeals as Record<string, any>).reduce((total: number, meal: any) => {
      return total + (Number(meal?.calories) || 0);
    }, 0);
  };

  const getTotalCost = (dayMeals: any): number => {
    if (!dayMeals) return 0;
    return Object.values(dayMeals as Record<string, any>).reduce((total: number, meal: any) => {
      return total + (Number(meal?.cost) || 0);
    }, 0);
  };

  const getTotalMealsCount = (): number => {
    if (!plan.meals) return 0;
    return Object.values(plan.meals as Record<string, any>).reduce((total: number, dayMeals: any) => {
      return total + Object.keys(dayMeals || {}).length;
    }, 0);
  };

  const getTotalCaloriesForPlan = (): number => {
    if (!plan.meals) return 0;
    return Object.values(plan.meals as Record<string, any>).reduce((total: number, dayMeals: any) => {
      return total + getTotalCalories(dayMeals);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-card shadow-medical">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex-1">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                </span>
                {plan.total_cost && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Budget: {plan.total_cost}€
                  </span>
                )}
              </CardDescription>
            </div>
            <Button 
              onClick={() => onGenerateGroceryList(plan.id)}
              className="bg-gradient-primary hover:shadow-glow transition-smooth"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Liste de courses
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Meal Plan Details */}
      <div className="grid gap-6">
        {plan.meals && Object.entries(plan.meals).map(([day, dayMeals]: [string, any]) => (
          <Card key={day} className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{day}</CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {getTotalCalories(dayMeals)} cal
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {getTotalCost(dayMeals).toFixed(2)}€
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dayMeals && Object.entries(dayMeals).map(([mealType, meal]: [string, any]) => (
                  <div key={mealType} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getMealIcon(mealType)}</span>
                      <h4 className="font-semibold">{mealType}</h4>
                    </div>
                    
                    <h5 className="font-medium text-foreground mb-2">{meal?.name}</h5>
                    
                    <div className="flex gap-2 text-xs">
                      {meal?.calories && (
                        <Badge variant="secondary" className="text-xs">
                          {meal.calories} cal
                        </Badge>
                      )}
                      {meal?.cost && (
                        <Badge variant="outline" className="text-xs">
                          {Number(meal.cost).toFixed(2)}€
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Summary */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Résumé du plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">
                {Object.keys(plan.meals || {}).length}
              </div>
              <div className="text-sm text-muted-foreground">Jours</div>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/10">
              <div className="text-2xl font-bold text-secondary">
                {getTotalMealsCount()}
              </div>
              <div className="text-sm text-muted-foreground">Repas</div>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">
                {getTotalCaloriesForPlan()}
              </div>
              <div className="text-sm text-muted-foreground">Calories totales</div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">
                {plan.total_cost ? `${plan.total_cost}€` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Budget total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};