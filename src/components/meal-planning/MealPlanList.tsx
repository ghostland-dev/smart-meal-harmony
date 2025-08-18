import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Users, Eye, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  total_cost: number | null;
  meals: any;
  created_at: string;
}

interface MealPlanListProps {
  onViewPlan: (plan: MealPlan) => void;
  refreshTrigger?: number;
}

export const MealPlanList: React.FC<MealPlanListProps> = ({ onViewPlan, refreshTrigger = 0 }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMealPlans();
    }
  }, [user, refreshTrigger]);

  const fetchMealPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les plans de repas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMealPlans(prev => prev.filter(plan => plan.id !== id));
      toast({
        title: "Plan supprimé",
        description: "Le plan de repas a été supprimé avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le plan de repas.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysCount = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Aucun plan de repas</h3>
              <p className="text-muted-foreground">
                Créez votre premier plan de repas personnalisé
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vos plans de repas</h3>
        <Badge variant="secondary" className="px-3 py-1">
          {mealPlans.length} plan{mealPlans.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {mealPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-medical transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {getDaysCount(plan.start_date, plan.end_date)} jours
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewPlan(plan)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMealPlan(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Budget: {plan.total_cost ? `${plan.total_cost}€` : 'Non défini'}
                </div>
                <Badge variant="outline" className="text-xs">
                  Créé le {formatDate(plan.created_at)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};