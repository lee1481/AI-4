import React, { useState, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import { getContracts, getBrands } from '../../services/dataService';
import { BrandAnalysisData } from '../../types';

const BrandAnalysis: React.FC = () => {
    const allBrands = getBrands();
    const allContracts = getContracts();

    const brandAnalysisData = useMemo(() => {
        const analysis: Record<string, BrandAnalysisData> = {};

        allBrands.forEach(brand => {
            analysis[brand.name] = {
                contractCount: 0,
                cumulativeProfit: 0,
                averageContractValue: 0,
                contracts: [],
            };
        });

        allContracts.forEach(contract => {
            const { brandName, salesAmount, totalPurchaseAmount } = contract;
            if (!analysis[brandName]) {
                 analysis[brandName] = {
                    contractCount: 0,
                    cumulativeProfit: 0,
                    averageContractValue: 0,
                    contracts: [],
                };
            }
            
            analysis[brandName].contracts.push(contract);
            analysis[brandName].contractCount += 1;
            const profit = salesAmount - totalPurchaseAmount;
            analysis[brandName].cumulativeProfit += profit;
        });

        for (const brandName in analysis) {
            const brandData = analysis[brandName];
            if (brandData.contractCount > 0) {
                const totalSales = brandData.contracts.reduce((sum, c) => sum + c.salesAmount, 0);
                brandData.averageContractValue = totalSales / brandData.contractCount;
            }
        }
        return analysis;
    }, [allBrands, allContracts]);

    const brandOptions = useMemo(() => Object.keys(brandAnalysisData), [brandAnalysisData]);
    const [selectedBrand, setSelectedBrand] = useState<string>(brandOptions[0] || '');

    useEffect(() => {
        if (!selectedBrand && brandOptions.length > 0) {
            setSelectedBrand(brandOptions[0]);
        }
    }, [brandOptions, selectedBrand]);
    
    const currentAnalysis = selectedBrand ? brandAnalysisData[selectedBrand] : null;

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center space-x-4">
                    <label htmlFor="brand-select" className="font-semibold text-navy">브랜드 선택:</label>
                    <select
                        id="brand-select"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="p-2 border rounded-md shadow-sm focus:ring-navy focus:border-navy"
                        disabled={brandOptions.length === 0}
                    >
                        {brandOptions.length > 0 ? (
                            brandOptions.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))
                        ) : (
                            <option>등록된 브랜드가 없습니다</option>
                        )}
                    </select>
                </div>
            </Card>

            {currentAnalysis && selectedBrand ? (
                 currentAnalysis.contractCount > 0 ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <h4 className="text-gray-text font-semibold">누적 계약 건수</h4>
                                <p className="text-3xl font-bold text-navy mt-2">{currentAnalysis.contractCount} 건</p>
                            </Card>
                            <Card>
                                <h4 className="text-gray-text font-semibold">누적 순손익</h4>
                                <p className="text-3xl font-bold text-navy mt-2">{currentAnalysis.cumulativeProfit.toLocaleString()} 원</p>
                            </Card>
                            <Card>
                                <h4 className="text-gray-text font-semibold">평균 계약 단가</h4>
                                <p className="text-3xl font-bold text-orange-accent mt-2">{Math.round(currentAnalysis.averageContractValue).toLocaleString()} 원</p>
                            </Card>
                        </div>

                        <Card title={`${selectedBrand} 계약 내역`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">계약일</th>
                                            <th scope="col" className="px-6 py-3">시공 예정일</th>
                                            <th scope="col" className="px-6 py-3">매출액</th>
                                            <th scope="col" className="px-6 py-3">매입액</th>
                                            <th scope="col" className="px-6 py-3">순손익</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAnalysis.contracts.map(c => {
                                            const profit = c.salesAmount - c.totalPurchaseAmount;
                                            return (
                                                <tr key={c.id} className="bg-white border-b">
                                                    <td className="px-6 py-4">{c.contractDate}</td>
                                                    <td className="px-6 py-4">{c.constructionDate}</td>
                                                    <td className="px-6 py-4">{c.salesAmount.toLocaleString()}원</td>
                                                    <td className="px-6 py-4">{c.totalPurchaseAmount.toLocaleString()}원</td>
                                                    <td className={`px-6 py-4 font-semibold ${profit > 0 ? 'text-blue-600' : 'text-red-600'}`}>{profit.toLocaleString()}원</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                ) : (
                     <Card>
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-text">{`'${selectedBrand}' 브랜드에 대한 계약 내역이 없습니다.`}</h3>
                            <p className="text-sm text-gray-500 mt-2">'계약 관리'에서 해당 브랜드의 계약을 추가해주세요.</p>
                        </div>
                    </Card>
                )
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-gray-text">분석할 데이터가 없습니다.</h3>
                        <p className="text-sm text-gray-500 mt-2">'브랜드 관리'에서 브랜드를 등록하고 '계약 관리'에서 계약을 추가해주세요.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BrandAnalysis;
