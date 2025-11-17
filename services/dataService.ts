import { User, Brand, Contract, CompanyProfile, BrandContactCategory } from '../types';

// --- LocalStorage Keys ---
const USERS_KEY = 'ai-sales-assistant-users';
const BRANDS_KEY = 'ai-sales-assistant-brands';
const CONTRACTS_KEY = 'ai-sales-assistant-contracts';
const COMPANY_INFO_KEY = 'ai-sales-assistant-company-info';

// --- Default Initial Data (for first-time users) ---
const defaultUsers: User[] = [
    { id: 'user-1', name: '김대표', email: 'ceo@example.com', password: 'password123' },
    { id: 'user-2', name: '박영업', email: 'sales@example.com', password: 'password123' },
];

const defaultBrands: Brand[] = [
    {
        id: 'brand-1',
        name: '스타벅스',
        address: '서울특별시 중구 소공동 70',
        businessRegistrationNumber: '201-81-21515',
        mainPhoneNumber: '1522-3232',
        websiteUrl: 'https://www.starbucks.co.kr/',
        contacts: [
            { id: 'contact-1', name: '이담당', phone: '010-1111-2222', email: 'manager@starbucks.com', category: BrandContactCategory.Executive },
            { id: 'contact-2', name: '최인테리어', phone: '010-3333-4444', email: 'interior@starbucks.com', category: BrandContactCategory.Interior },
        ]
    },
    {
        id: 'brand-2',
        name: '빽다방',
        address: '서울특별시 강남구 봉은사로 437',
        businessRegistrationNumber: '190-87-00902',
        mainPhoneNumber: '1544-2360',
        websiteUrl: 'http://www.paikdabang.com/',
        contacts: []
    }
];

const defaultCompanyInfo: CompanyProfile = {
    companyName: '',
    ceoName: '',
    businessNumber: '',
    address: '',
    businessType: '',
    businessItem: '',
    phoneNumber: '',
    taxEmail: '',
    logoImage: undefined,
};

// --- Generic Helper Functions ---
const loadData = <T>(key: string, defaultValue: T): T => {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData) as T;
        }
        // If no data, save the default value for next time
        saveData(key, defaultValue);
        return defaultValue;
    } catch (error) {
        console.error(`Error loading data for ${key}:`, error);
        return defaultValue;
    }
};

const saveData = <T>(key: string, data: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving data for ${key}:`, error);
    }
};

// --- Data Access Service ---

// Users
export const getUsers = (): User[] => loadData<User[]>(USERS_KEY, defaultUsers);
export const saveUsers = (users: User[]): void => saveData<User[]>(USERS_KEY, users);

// Brands
export const getBrands = (): Brand[] => loadData<Brand[]>(BRANDS_KEY, defaultBrands);
export const saveBrands = (brands: Brand[]): void => saveData<Brand[]>(BRANDS_KEY, brands);

// Contracts
export const getContracts = (): Contract[] => loadData<Contract[]>(CONTRACTS_KEY, []);
export const saveContracts = (contracts: Contract[]): void => saveData<Contract[]>(CONTRACTS_KEY, contracts);

// Company Info
export const getCompanyInfo = (): CompanyProfile => loadData<CompanyProfile>(COMPANY_INFO_KEY, defaultCompanyInfo);
export const saveCompanyInfo = (info: CompanyProfile): void => saveData<CompanyProfile>(COMPANY_INFO_KEY, info);
