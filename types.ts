export interface Expense {
  id: string;
  item: string;
  amount: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
}

export interface Contract {
  id: string;
  brandName: string;
  branchName: string;
  contractDate: string;
  constructionDate: string;
  collectionDate?: string | null;
  salesAmount: number;
  payments: Payment[];
  totalPurchaseAmount: number;
  expenses: Expense[];
  salesperson: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Stored for mock purposes, not for production
}

export enum BrandContactCategory {
  Executive = "임직원",
  Sales = "영업팀",
  Interior = "인테리어",
  Supervisor = "슈퍼바이저",
  Other = "기타",
}

export interface BrandContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: BrandContactCategory;
}

export interface Brand {
  id: string;
  name: string;
  address?: string;
  businessRegistrationNumber?: string;
  mainPhoneNumber?: string;
  websiteUrl?: string;
  certificateImage?: string;
  contacts: BrandContact[];
}


export interface Company {
  id: string;
  name: string;
  industry: string;
  hqLocation: string;
}

export interface MonthlyData {
  name: string; // e.g., 'Jan', 'Feb'
  sales: number;
  purchases: number;
  profit: number;
}

export interface BrandData {
  name: string;
  value: number;
}

export interface BrandAnalysisData {
  contractCount: number;
  cumulativeProfit: number;
  averageContractValue: number;
  contracts: Contract[];
}

export enum TargetCategory {
    NewRapidGrowth = "신규 급성장",
    TrendLeading = "유행 선도",
    HighPotential = "발전 가능성"
}

export interface TargetBrand {
    name: string;
    description: string;
    category: TargetCategory;
}

export interface CompanyProfile {
  companyName: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  businessType: string; // 업태
  businessItem: string; // 종목
  phoneNumber: string;
  taxEmail: string;
  logoImage?: string;
}
