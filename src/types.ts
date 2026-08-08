export type Category = 
  | "Results" 
  | "Admit Card" 
  | "Latest Jobs" 
  | "Answer Key" 
  | "Board Update" 
  | "University Update"
  | "Sarkari Yojana"
  | "Admission"
  | "Scholarship";

export interface JobPost {
  id: string;
  category: Category;
  title: string;
  statusText?: string; // e.g., "New", "Out", "Start"
  shortDescription: string;
  importantDates: string; // HTML or Markdown
  applicationFee: string; // HTML or Markdown
  ageLimit: string; // HTML or Markdown
  vacancyDetails: string; // HTML or Markdown
  officialLink: string;
  createdAt: number;
}

export interface TopAlert {
  id: string;
  title: string;
  color: string;
  link: string;
}

export interface AppSettings {
  adScript: string;
  adDelay: number;
  whatsappLink?: string;
  instagramLink?: string;
  telegramLink?: string;
  topAlerts?: TopAlert[];
  categoryAds?: {category: string, adScript: string}[];
  siteName?: string;
  siteDomain?: string;
  promoEmail?: string;
  marqueeText?: string;
  welcomeText?: string;
  metaDescription?: string;
  metaKeywords?: string;
  adsenseId?: string;
}

export interface TrafficStats {
  date: string;
  views: number;
}

export interface DatabaseSchema {
  posts: JobPost[];
  settings: AppSettings;
  traffic?: TrafficStats[];
}
