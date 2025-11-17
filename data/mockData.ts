import { TargetBrand, TargetCategory } from '../types';

// --- Mock Data (Not persisted) ---
// This data is for demonstration and is not saved between sessions.
export const mockTargetBrands: TargetBrand[] = [
    { name: '탕후루 프랜차이즈 A', description: '최근 3개월간 가맹점 50개 이상 급증', category: TargetCategory.NewRapidGrowth },
    { name: '소금빵 전문점 B', description: 'SNS 및 미디어에서 지속적으로 언급되는 트렌드 아이템', category: TargetCategory.TrendLeading },
    { name: '1인 화덕피자 C', description: '새로운 컨셉과 높은 재방문율로 성장 잠재력 보유', category: TargetCategory.HighPotential },
    { name: '샐러드 전문점 D', description: '건강 트렌드에 힘입어 꾸준히 가맹점 확대 중', category: TargetCategory.NewRapidGrowth },
];
