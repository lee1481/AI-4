import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { getContracts, saveContracts } from '../../services/dataService';
import { Contract } from '../../types';
import ContractEditModal from '../contracts/ContractEditModal';

const ReceivablesManagement: React.FC = () => {
    const [allContracts, setAllContracts] = useState<Contract[]>(getContracts);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);

    const openEditModal = (contract: Contract) => {
        setEditingContract(contract);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingContract(null);
        setIsEditModalOpen(false);
    };

    const handleUpdateContract = (updatedContract: Contract) => {
        const updatedContracts = allContracts.map(c => c.id === updatedContract.id ? updatedContract : c);
        setAllContracts(updatedContracts);
        saveContracts(updatedContracts);
        closeEditModal();
    };

    const outstandingContracts = useMemo(() => {
        return allContracts
            .map(c => {
                const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
                const balance = c.salesAmount - totalPaid;
                return { ...c, balance };
            })
            .filter(c => c.balance > 0 && !c.collectionDate)
            .sort((a, b) => new Date(a.constructionDate).getTime() - new Date(b.constructionDate).getTime());
    }, [allContracts]);

    const calculateDaysOverdue = (constructionDate: string): number => {
        const today = new Date();
        const constDate = new Date(constructionDate);
        // Set hours to 0 to compare dates only
        today.setHours(0, 0, 0, 0);
        constDate.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - constDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const getOverdueColor = (days: number): string => {
        if (days > 60) return 'text-red-600 font-bold';
        if (days > 30) return 'text-orange-500 font-semibold';
        return 'text-yellow-600';
    };

    return (
        <>
            <Card title="미수금 관리 목록">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">브랜드/지점명</th>
                                <th scope="col" className="px-6 py-3">담당자</th>
                                <th scope="col" className="px-6 py-3">시공일</th>
                                <th scope="col" className="px-6 py-3">경과일수</th>
                                <th scope="col" className="px-6 py-3">미수금액</th>
                                <th scope="col" className="px-6 py-3 text-right">작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outstandingContracts.map(c => {
                                const daysOverdue = calculateDaysOverdue(c.constructionDate);
                                return (
                                    <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {c.brandName} ({c.branchName})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{c.salesperson}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{c.constructionDate}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${getOverdueColor(daysOverdue)}`}>
                                            {daysOverdue}일
                                        </td>
                                        <td className="px-6 py-4 font-bold text-orange-accent whitespace-nowrap">
                                            {c.balance.toLocaleString()}원
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <button onClick={() => openEditModal(c)} className="font-medium text-blue-600 hover:underline">수금 관리</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {outstandingContracts.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-text">미수금이 없습니다.</h3>
                            <p className="text-sm text-gray-500 mt-2">모든 계약의 잔금이 정산되었습니다.</p>
                        </div>
                    )}
                </div>
            </Card>
            {editingContract && (
                <ContractEditModal
                    key={editingContract.id}
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    contract={editingContract}
                    onSave={handleUpdateContract}
                />
            )}
        </>
    );
};

export default ReceivablesManagement;
