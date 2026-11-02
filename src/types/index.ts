export type PlantCategory = 'Vegetables' | 'Herbs' | 'Fruits' | 'Flowers';

export type PlantStatus = 'Sown' | 'Seedling' | 'Growing' | 'Ready to Harvest';

export type WaterSchedule = 'Daily' | 'Every 2-3 Days' | 'Weekly';

export interface PlantRecord {
  id: string;
  name: string;
  category: PlantCategory;
  bed: string;
  sowDate: string;
  harvestDays: number;
  waterSchedule: WaterSchedule;
  status: PlantStatus;
  frostSensitive: boolean;
  notes: string;
  createdAt: number;
}

export interface WeeklyTask {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  bed?: string;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;
  frostRisk: boolean;
}

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  current: {
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
    time: string;
  };
  daily: DailyForecast[];
  wateringAdvice: string;
  frostAlert: boolean;
  fetchedAt: string;
}

export interface SeasonalTip {
  id: string;
  category: 'Sow & Plant' | 'Care & Water' | 'Frost Protection' | 'Harvest';
  title: string;
  description: string;
  highlight?: boolean;
}

export interface MonthlyGardenGuide {
  monthIndex: number; // 0 = Jan, 11 = Dec
  monthName: string;
  season: 'Winter' | 'Spring' | 'Summer' | 'Autumn';
  summary: string;
  idealSow: string[];
  tips: SeasonalTip[];
}

export type PageView = 'home' | 'planner' | 'weather' | 'tips' | 'about' | 'contact' | 'signin' | 'signup';
