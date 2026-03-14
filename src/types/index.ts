export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  order: number;
  created_at: string;
}

export interface InterventionType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  order: number;
  created_at: string;
}

export interface Fiche {
  id: string;
  title: string;
  content: string;
  summary: string;
  category_ids: string[];
  intervention_type_ids: string[];
  is_default: boolean;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  device_id: string;
  fiche_id: string;
  created_at: string;
}
