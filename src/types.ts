export interface TopicRecipe {
  prepTime?: string;
  yields?: string;
  doughIngredients?: string[];
  fillingIngredients?: string[];
  steps?: string[];
  tips?: string;
}

export interface Topic {
  id: string;
  title: string;
  shortSummary: string;
  content: string;
  category: 'apresentacao' | 'socioeconomia' | 'cultura' | 'religiao' | 'monumentos' | 'figuras' | 'culinaria';
  iconName: string;
  image: string;
  keyFacts: string[];
  highlightTag?: string;
  recipeDetails?: TopicRecipe;
}

export interface ProjectVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  topicId: string;
  description: string;
  duration?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  turma: string;
  photoUrl: string;
  bio?: string;
  photoFit?: 'contain' | 'cover';
}

export interface ProjectProfile {
  name: string;
  subtitle: string;
  turma: string;
  logoUrl: string;
  country: string;
  event: string;
  characteristics: string[];
  standDescription: string;
  sources: string[];
  contactEmail?: string;
}
