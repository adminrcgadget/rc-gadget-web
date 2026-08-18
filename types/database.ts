export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  whatsapp_number: string | null;
  copyright_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  eyebrow: string | null;
  heading_line_1: string;
  heading_line_2: string | null;
  heading_line_3: string | null;
  description: string | null;
  highlighted_text: string | null;
  primary_button_text: string | null;
  primary_button_url: string | null;
  secondary_button_text: string | null;
  secondary_button_url: string | null;
  background_image_url: string | null;
  foreground_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  short_description: string | null;
  icon_url: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  desktop_image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  position: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  eyebrow: string | null;
  heading: string;
  description: string;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: SiteSettings;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      navigation_items: {
        Row: NavigationItem;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      hero_section: {
        Row: HeroSection;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      categories: {
        Row: Category;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      banners: {
        Row: Banner;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      about_section: {
        Row: AboutSection;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      features: {
        Row: Feature;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      experiences: {
        Row: Experience;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
      social_links: {
        Row: SocialLink;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
