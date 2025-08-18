import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, DollarSign, Clock, Store } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GroceryItem {
  name: string;
  quantity: string;
  category: string;
  estimatedCost: number;
  checked: boolean;
}

interface GroceryListGeneratorProps {
  mealPlanId?: string;
  onListCreated?: () => void;
}

export const GroceryListGenerator: React.FC<GroceryListGeneratorProps> = ({ 
  mealPlanId, 
  onListCreated 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listName, setListName] = useState('');
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingFromPlan, setGeneratingFromPlan] = useState(false);

  useEffect(() => {
    if (mealPlanId) {
      generateFromMealPlan();
    } else {
      // Initialize with basic items for manual creation
      setGroceryItems([
        { name: 'Pommes', quantity: '1 kg', category: 'Fruits', estimatedCost: 3.50, checked: false },
        { name: 'Lait', quantity: '1 L', category: 'Produits laitiers', estimatedCost: 1.20, checked: false },
        { name: 'Pain', quantity: '1 pièce', category: 'Boulangerie', estimatedCost: 1.50, checked: false }
      ]);
    }
  }, [mealPlanId]);

  const generateFromMealPlan = async () => {
    if (!mealPlanId || !user) return;

    setGeneratingFromPlan(true);
    try {
      const { data: mealPlan, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('id', mealPlanId)
        .single();

      if (error) throw error;

      // Générer la liste de courses basée sur le plan de repas
      const items = generateItemsFromMeals(mealPlan.meals);
      setGroceryItems(items);
      setListName(`Liste pour ${mealPlan.name}`);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la liste de courses depuis le plan de repas.",
        variant: "destructive",
      });
    } finally {
      setGeneratingFromPlan(false);
    }
  };

  const generateItemsFromMeals = (meals: any): GroceryItem[] => {
    // Simulation de génération d'ingrédients basée sur les repas
    const baseItems: GroceryItem[] = [
      { name: 'Saumon frais', quantity: '400g', category: 'Poissonnerie', estimatedCost: 12.00, checked: false },
      { name: 'Quinoa', quantity: '500g', category: 'Épicerie', estimatedCost: 4.50, checked: false },
      { name: 'Légumes variés', quantity: '1 kg', category: 'Légumes', estimatedCost: 6.00, checked: false },
      { name: 'Avoine', quantity: '500g', category: 'Céréales', estimatedCost: 2.50, checked: false },
      { name: 'Fruits de saison', quantity: '1 kg', category: 'Fruits', estimatedCost: 5.00, checked: false },
      { name: 'Poulet bio', quantity: '800g', category: 'Boucherie', estimatedCost: 8.50, checked: false },
      { name: 'Épinards frais', quantity: '200g', category: 'Légumes', estimatedCost: 2.00, checked: false }
    ];
    
    return baseItems;
  };

  const handleItemToggle = (index: number) => {
    setGroceryItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addCustomItem = () => {
    const newItem: GroceryItem = {
      name: 'Nouvel article',
      quantity: '1',
      category: 'Autre',
      estimatedCost: 0,
      checked: false
    };
    setGroceryItems(prev => [...prev, newItem]);
  };

  const removeItem = (index: number) => {
    setGroceryItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof GroceryItem, value: any) => {
    setGroceryItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const saveGroceryList = async () => {
    if (!user || !listName.trim() || groceryItems.length === 0) return;

    setLoading(true);
    try {
      const totalCost = groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);

      const { error } = await supabase
        .from('grocery_lists')
        .insert({
          user_id: user.id,
          meal_plan_id: mealPlanId || null,
          name: listName,
          items: groceryItems as any,
          total_estimated_cost: totalCost
        });

      if (error) throw error;

      toast({
        title: "Liste de courses créée",
        description: "Votre liste de courses a été sauvegardée avec succès.",
      });

      if (onListCreated) onListCreated();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la liste de courses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalCost = groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const categories = [...new Set(groceryItems.map(item => item.category))];

  if (generatingFromPlan) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Génération de la liste de courses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-medical bg-gradient-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>
                {mealPlanId ? 'Liste générée depuis le plan' : 'Nouvelle liste de courses'}
              </CardTitle>
              <CardDescription>
                Organisez vos achats et optimisez votre budget
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="listName">Nom de la liste</Label>
              <Input
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Ma liste de courses de la semaine"
              />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Articles ({groceryItems.length})</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Total estimé: {totalCost.toFixed(2)}€
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items by category */}
      {categories.map(category => {
        const categoryItems = groceryItems.filter(item => item.category === category);
        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{category}</CardTitle>
                <Badge variant="secondary">{categoryItems.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map((item, globalIndex) => {
                  const actualIndex = groceryItems.indexOf(item);
                  return (
                    <div key={actualIndex} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => handleItemToggle(actualIndex)}
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(actualIndex, 'name', e.target.value)}
                          className="h-8"
                        />
                        <Input
                          value={item.quantity}
                          onChange={(e) => updateItem(actualIndex, 'quantity', e.target.value)}
                          placeholder="Quantité"
                          className="h-8"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={item.estimatedCost}
                          onChange={(e) => updateItem(actualIndex, 'estimatedCost', parseFloat(e.target.value) || 0)}
                          placeholder="Prix"
                          className="h-8"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(actualIndex)}
                      >
                        ×
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex gap-4">
        <Button variant="outline" onClick={addCustomItem}>
          <Package className="h-4 w-4 mr-2" />
          Ajouter un article
        </Button>
        <Button 
          onClick={saveGroceryList}
          disabled={loading || !listName.trim() || groceryItems.length === 0}
          className="bg-gradient-primary hover:shadow-glow transition-smooth"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {loading ? 'Sauvegarde...' : 'Sauvegarder la liste'}
        </Button>
      </div>
    </div>
  );
};