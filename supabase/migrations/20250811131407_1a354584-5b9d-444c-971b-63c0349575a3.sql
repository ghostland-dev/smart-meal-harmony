-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  weight DECIMAL,
  height DECIMAL,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical constraints table
CREATE TABLE public.medical_constraints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  constraint_type TEXT NOT NULL CHECK (constraint_type IN ('neuropathy', 'diabetes', 'allergy', 'diet', 'medication')),
  constraint_value TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom programs table
CREATE TABLE public.custom_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL CHECK (program_type IN ('neuropathy', 'anti_inflammatory', 'keto', 'fodmap', 'custom')),
  allowed_foods TEXT[], -- Array of allowed foods
  forbidden_foods TEXT[], -- Array of forbidden foods
  nutrient_targets JSONB, -- JSON object with nutrient targets
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal plans table
CREATE TABLE public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  meals JSONB NOT NULL, -- JSON object with daily meals
  total_cost DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grocery lists table
CREATE TABLE public.grocery_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  items JSONB NOT NULL, -- JSON array of grocery items with prices
  total_estimated_cost DECIMAL,
  store_comparison JSONB, -- JSON object with price comparison across stores
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for medical constraints
CREATE POLICY "Users can view their own constraints" ON public.medical_constraints
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own constraints" ON public.medical_constraints
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for custom programs
CREATE POLICY "Users can view their own programs" ON public.custom_programs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own programs" ON public.custom_programs
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for meal plans
CREATE POLICY "Users can view their own meal plans" ON public.meal_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own meal plans" ON public.meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for grocery lists
CREATE POLICY "Users can view their own grocery lists" ON public.grocery_lists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own grocery lists" ON public.grocery_lists
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_programs_updated_at
  BEFORE UPDATE ON public.custom_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grocery_lists_updated_at
  BEFORE UPDATE ON public.grocery_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();