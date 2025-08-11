import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  Heart, 
  ArrowLeft, 
  Save, 
  Plus, 
  X,
  AlertTriangle,
  User
} from 'lucide-react';

interface Profile {
  first_name: string;
  last_name: string;
  age: number;
  weight: number;
  height: number;
  activity_level: string;
}

interface MedicalConstraint {
  id?: string;
  constraint_type: string;
  constraint_value: string;
  severity: string;
  notes?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    age: 0,
    weight: 0,
    height: 0,
    activity_level: 'moderate'
  });
  const [constraints, setConstraints] = useState<MedicalConstraint[]>([]);
  const [newConstraint, setNewConstraint] = useState<MedicalConstraint>({
    constraint_type: 'allergy',
    constraint_value: '',
    severity: 'mild',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      if (profileData) {
        setProfile(profileData);
      }
      
      setConstraints(constraintsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Profil sauvegardé",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddConstraint = async () => {
    if (!newConstraint.constraint_value.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir la contrainte.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('medical_constraints')
        .insert({
          user_id: user?.id,
          ...newConstraint
        });

      if (error) throw error;

      await fetchUserData();
      setNewConstraint({
        constraint_type: 'allergy',
        constraint_value: '',
        severity: 'mild',
        notes: ''
      });

      toast({
        title: "Contrainte ajoutée",
        description: "La contrainte médicale a été ajoutée avec succès.",
      });
    } catch (error) {
      console.error('Error adding constraint:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la contrainte.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveConstraint = async (constraintId: string) => {
    try {
      const { error } = await supabase
        .from('medical_constraints')
        .delete()
        .eq('id', constraintId);

      if (error) throw error;

      await fetchUserData();
      toast({
        title: "Contrainte supprimée",
        description: "La contrainte médicale a été supprimée.",
      });
    } catch (error) {
      console.error('Error removing constraint:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la contrainte.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Chargement de votre profil...</p>
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

  const getConstraintTypeLabel = (type: string) => {
    switch (type) {
      case 'neuropathy': return 'Neuropathie';
      case 'diabetes': return 'Diabète';
      case 'allergy': return 'Allergie';
      case 'diet': return 'Régime alimentaire';
      case 'medication': return 'Médicament';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Heart className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Mon Profil</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Renseignez vos informations de base pour un calcul nutritionnel précis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile.weight || ''}
                    onChange={(e) => setProfile({...profile, weight: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height || ''}
                    onChange={(e) => setProfile({...profile, height: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Niveau d'activité</Label>
                <Select 
                  value={profile.activity_level} 
                  onValueChange={(value) => setProfile({...profile, activity_level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sédentaire</SelectItem>
                    <SelectItem value="light">Activité légère</SelectItem>
                    <SelectItem value="moderate">Activité modérée</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="very_active">Très actif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} variant="medical">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </CardContent>
          </Card>

          {/* Medical Constraints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Contraintes médicales
              </CardTitle>
              <CardDescription>
                Gérez vos allergies, régimes spéciaux et contraintes médicales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Constraints */}
              <div className="space-y-3">
                {constraints.map((constraint) => (
                  <div key={constraint.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">
                          {getConstraintTypeLabel(constraint.constraint_type)}
                        </Badge>
                        <Badge variant={getSeverityColor(constraint.severity)}>
                          {constraint.severity}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{constraint.constraint_value}</p>
                      {constraint.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{constraint.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveConstraint(constraint.id!)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Constraint */}
              <div className="border-t pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newConstraint.constraint_type}
                      onValueChange={(value) => setNewConstraint({...newConstraint, constraint_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neuropathy">Neuropathie</SelectItem>
                        <SelectItem value="diabetes">Diabète</SelectItem>
                        <SelectItem value="allergy">Allergie</SelectItem>
                        <SelectItem value="diet">Régime alimentaire</SelectItem>
                        <SelectItem value="medication">Médicament</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sévérité</Label>
                    <Select
                      value={newConstraint.severity}
                      onValueChange={(value) => setNewConstraint({...newConstraint, severity: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Légère</SelectItem>
                        <SelectItem value="moderate">Modérée</SelectItem>
                        <SelectItem value="severe">Sévère</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Ex: Allergie aux noix, Régime sans gluten..."
                    value={newConstraint.constraint_value}
                    onChange={(e) => setNewConstraint({...newConstraint, constraint_value: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes (optionnel)</Label>
                  <Textarea
                    placeholder="Informations complémentaires..."
                    value={newConstraint.notes}
                    onChange={(e) => setNewConstraint({...newConstraint, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddConstraint} variant="hero" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une contrainte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IMC Calculator */}
        {profile.weight && profile.height && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Calcul de l'IMC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
                </div>
                <p className="text-muted-foreground">
                  Indice de Masse Corporelle
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
