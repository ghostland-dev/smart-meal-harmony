import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, ChefHat, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MealPlanFormData {
  name: string;
  startDate: string;
  endDate: string;
  servings: number;
  budget: number;
  preferences: string;
  restrictions: string[];
}

export const MealPlanGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<MealPlanFormData>({
    name: '',
    startDate: '',
    endDate: '',
    servings: 2,
    budget: 100,
    preferences: '',
    restrictions: []
  });
  const [loading, setLoading] = useState(false);

  const dietaryRestrictions = [
    'Diabétique', 'Sans gluten', 'Végétarien', 'Végétalien', 
    'Sans lactose', 'Faible en sodium', 'Hypocalorique', 'Cétogène'
  ];

  const handleRestrictionToggle = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      restrictions: prev.restrictions.includes(restriction)
        ? prev.restrictions.filter(r => r !== restriction)
        : [...prev.restrictions, restriction]
    }));
  };

  const generateMealPlan = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Générer un plan de repas basique (simulation)
      const meals = generateBasicMeals(formData);
      
      const { error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          name: formData.name,
          start_date: formData.startDate,
          end_date: formData.endDate,
          meals: meals,
          total_cost: formData.budget
        });

      if (error) throw error;

      toast({
        title: "Plan de repas créé",
        description: "Votre plan de repas personnalisé a été généré avec succès.",
      });

      // Reset form
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        servings: 2,
        budget: 100,
        preferences: '',
        restrictions: []
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le plan de repas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBasicMeals = (data: MealPlanFormData) => {
    const basicMeals = {
      'Jour 1': {
        'Petit-déjeuner': { name: 'Avoine aux fruits', calories: 350, cost: 3.50 },
        'Déjeuner': { name: 'Salade de quinoa', calories: 450, cost: 8.00 },
        'Dîner': { name: 'Saumon grillé et légumes', calories: 520, cost: 12.00 }
      },
      'Jour 2': {
        'Petit-déjeuner': { name: 'Smoothie vert', calories: 280, cost: 4.00 },
        'Déjeuner': { name: 'Wrap aux légumes', calories: 380, cost: 6.50 },
        'Dîner': { name: 'Poulet aux herbes', calories: 480, cost: 10.00 }
      }
    };
    return basicMeals;
  };

  return (
    <Card className="shadow-medical bg-gradient-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Générateur de Plan de Repas
        </CardTitle>
        <CardDescription>
          Créez un plan de repas personnalisé adapté à vos besoins médicaux et préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du plan</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Mon plan de la semaine"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="servings">Nombre de portions</Label>
            <Select value={formData.servings.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, servings: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 personne</SelectItem>
                <SelectItem value="2">2 personnes</SelectItem>
                <SelectItem value="4">4 personnes</SelectItem>
                <SelectItem value="6">6 personnes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date de début
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Budget (€)
          </Label>
          <Input
            id="budget"
            type="number"
            min="20"
            max="500"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
          />
        </div>

        <div className="space-y-3">
          <Label>Restrictions alimentaires</Label>
          <div className="flex flex-wrap gap-2">
            {dietaryRestrictions.map((restriction) => (
              <Badge
                key={restriction}
                variant={formData.restrictions.includes(restriction) ? "default" : "outline"}
                className="cursor-pointer transition-smooth hover:scale-105"
                onClick={() => handleRestrictionToggle(restriction)}
              >
                {restriction}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferences">Préférences alimentaires</Label>
          <Textarea
            id="preferences"
            value={formData.preferences}
            onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
            placeholder="Ex: J'aime les plats méditerranéens, je préfère éviter les fruits de mer..."
            rows={3}
          />
        </div>

        <Button 
          onClick={generateMealPlan}
          disabled={loading || !formData.name || !formData.startDate || !formData.endDate}
          className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              Génération en cours...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Générer le plan de repas
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};