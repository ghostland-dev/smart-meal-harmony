import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Calendar, 
  ShoppingCart, 
  User, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Profile {
  first_name: string;
  last_name: string;
  age: number;
  weight: number;
  height: number;
  activity_level: string;
}

interface MedicalConstraint {
  constraint_type: string;
  constraint_value: string;
  severity: string;
}

interface MealPlan {
  name: string;
  start_date: string;
  end_date: string;
  total_cost: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [constraints, setConstraints] = useState<MedicalConstraint[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch medical constraints
      const { data: constraintsData } = await supabase
        .from('medical_constraints')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch meal plans
      const { data: mealPlansData } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setProfile(profileData);
      setConstraints(constraintsData || []);
      setMealPlans(mealPlansData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'destructive';
      case 'moderate': return 'default';
      case 'mild': return 'secondary';
      default: return 'outline';
    }
  };

  const getConstraintIcon = (type: string) => {
    switch (type) {
      case 'neuropathy': return '🧠';
      case 'diabetes': return '🩸';
      case 'allergy': return '⚠️';
      case 'diet': return '🥗';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">SmartMealPlanner</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Bonjour, {profile?.first_name || user?.email?.split('@')[0]}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <Settings className="w-4 h-4 mr-2" />
              Profil
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Tableau de bord nutritionnel
          </h2>
          <p className="text-muted-foreground">
            Gérez votre alimentation personnalisée et vos contraintes médicales
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="medical" 
            className="h-20 flex flex-col"
            onClick={() => navigate('/meal-planner')}
          >
            <Calendar className="w-6 h-6 mb-2" />
            Nouveau programme
          </Button>
          <Button 
            variant="hero" 
            className="h-20 flex flex-col"
            onClick={() => navigate('/grocery-list')}
          >
            <ShoppingCart className="w-6 h-6 mb-2" />
            Liste de courses
          </Button>
          <Button 
            variant="accent" 
            className="h-20 flex flex-col"
            onClick={() => navigate('/profile')}
          >
            <User className="w-6 h-6 mb-2" />
            Mon profil
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col"
            onClick={() => navigate('/analytics')}
          >
            <TrendingUp className="w-6 h-6 mb-2" />
            Analytiques
          </Button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profil médical
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Âge:</span>
                    <span>{profile.age} ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Activité:</span>
                    <Badge variant="outline">{profile.activity_level}</Badge>
                  </div>
                  {profile.weight && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">IMC:</span>
                      <span>{profile.height && profile.weight ? 
                        (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1) : 'N/A'}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Profil incomplet</p>
                  <Button size="sm" onClick={() => navigate('/profile')}>
                    Compléter mon profil
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Constraints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Contraintes médicales
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate('/constraints')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {constraints.length > 0 ? (
                <div className="space-y-3">
                  {constraints.slice(0, 3).map((constraint, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">{getConstraintIcon(constraint.constraint_type)}</span>
                        <span className="text-sm">{constraint.constraint_value}</span>
                      </div>
                      <Badge variant={getSeverityColor(constraint.severity)}>
                        {constraint.severity}
                      </Badge>
                    </div>
                  ))}
                  {constraints.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{constraints.length - 3} autres contraintes
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Aucune contrainte définie</p>
                  <Button size="sm" onClick={() => navigate('/constraints')}>
                    Ajouter des contraintes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Meal Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Programmes récents
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate('/meal-plans')}>
                  Voir tout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealPlans.length > 0 ? (
                <div className="space-y-3">
                  {mealPlans.slice(0, 3).map((plan, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{plan.name}</h4>
                        <Badge variant="outline">
                          {plan.total_cost ? `${plan.total_cost}€` : 'Gratuit'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Du {new Date(plan.start_date).toLocaleDateString()} 
                        au {new Date(plan.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Aucun programme créé</p>
                  <Button size="sm" onClick={() => navigate('/meal-planner')}>
                    Créer un programme
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Progression de la semaine</CardTitle>
            <CardDescription>
              Suivi de vos objectifs nutritionnels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Protéines</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Vitamines B</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Magnésium</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;