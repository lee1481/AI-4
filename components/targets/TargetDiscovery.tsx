
import React, { useState, useCallback } from 'react';
import { TargetBrand, TargetCategory } from '../../types';
import { mockTargetBrands } from '../../data/mockData';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { generateSalesStrategies } from '../../services/geminiService';

const TargetCard: React.FC<{ brand: TargetBrand; onClick: () => void }> = ({ brand, onClick }) => {
    const categoryColor = {
        [TargetCategory.NewRapidGrowth]: "bg-red-100 text-red-800",
        [TargetCategory.TrendLeading]: "bg-blue-100 text-blue-800",
        [TargetCategory.HighPotential]: "bg-green-100 text-green-800",
    };

    return (
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" >
            <div onClick={onClick}>
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-navy">{brand.name}</h4>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor[brand.category]}`}>
                        {brand.category}
                    </span>
                </div>
                <p className="text-gray-text mt-2">{brand.description}</p>
            </div>
        </Card>
    );
};

const StrategyModalContent: React.FC<{brandName: string}> = ({brandName}) => {
    const [strategies, setStrategies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStrategies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateSalesStrategies(brandName);
            setStrategies(result);
        } catch (err) {
            setError('전략을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [brandName]);

    React.useEffect(() => {
        fetchStrategies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brandName]);

    return (
        <div>
            <p className="text-gray-text mb-4">AI가 제안하는 초기 영업 접근 전략입니다.</p>
            {isLoading ? (
                <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                    <p className="ml-3 text-gray-text">AI 전략 생성 중...</p>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <ul className="space-y-3 list-disc list-inside">
                    {strategies.map((strategy, index) => (
                        <li key={index} className="text-gray-800 bg-gray-light p-3 rounded-lg">
                           <span className="font-semibold text-orange-accent mr-2">전략 {index+1}.</span> {strategy}
                        </li>
                    ))}
                </ul>
            )}
             <p className="text-xs text-gray-400 mt-6">* 본 정보는 AI에 의해 생성되었으며, 실제와 다를 수 있습니다. 참고용으로만 활용해 주세요.</p>
        </div>
    );
};

const TargetDiscovery: React.FC = () => {
    const [targets] = useState<TargetBrand[]>(mockTargetBrands);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<TargetBrand | null>(null);
    
    const handleCardClick = (brand: TargetBrand) => {
        setSelectedBrand(brand);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBrand(null);
    };

    const renderTargetsByCategory = (category: TargetCategory) => (
        <div key={category}>
            <h3 className="text-2xl font-bold text-navy mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {targets
                    .filter(t => t.category === category)
                    .map(brand => (
                        <TargetCard key={brand.name} brand={brand} onClick={() => handleCardClick(brand)} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {Object.values(TargetCategory).map(category => renderTargetsByCategory(category))}
            
            {selectedBrand && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={closeModal}
                    title={`${selectedBrand.name} - AI 영업 전략`}
                >
                    <StrategyModalContent brandName={selectedBrand.name}/>
                </Modal>
            )}
        </div>
    );
};

export default TargetDiscovery;
