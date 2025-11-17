import React, { useState, useRef, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { getContracts, getBrands, saveContracts } from '../../services/dataService';
import { Contract, Expense, Payment } from '../../types';
import ContractEditModal from './ContractEditModal';

const ContractForm: React.FC<{onAddContract: (contract: Contract) => void}> = ({onAddContract}) => {
    const [brandName, setBrandName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [contractDate, setContractDate] = useState('');
    const [constructionDate, setConstructionDate] = useState('');
    const [collectionDate, setCollectionDate] = useState('');
    const [salesAmount, setSalesAmount] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [expenses, setExpenses] = useState<Partial<Expense>[]>([{ item: '', amount: undefined }]);
    const [isCollectionDateEdited, setIsCollectionDateEdited] = useState(false);

    useEffect(() => {
        if (isCollectionDateEdited) {
            return;
        }
        const numericSales = Number(salesAmount) || 0;
        const numericDown = Number(downPayment) || 0;

        if (numericSales > 0 && numericSales === numericDown) {
            const today = new Date().toISOString().split('T')[0];
            setCollectionDate(today);
        } else {
            setCollectionDate('');
        }
    }, [salesAmount, downPayment, isCollectionDateEdited]);

    const handleCollectionDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCollectionDate(e.target.value);
        setIsCollectionDateEdited(true);
    };

    const handleAddExpense = () => {
        setExpenses([...expenses, { item: '', amount: undefined }]);
    };

    const handleExpenseChange = (index: number, field: keyof Expense, value: string | number) => {
        const newExpenses = [...expenses];
        (newExpenses[index] as any)[field] = value;
        setExpenses(newExpenses);
    };
    
    const handleRemoveExpense = (index: number) => {
        const newExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(newExpenses);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validExpenses = expenses.filter(
            exp => exp.item && exp.item.trim() !== '' && exp.amount && exp.amount > 0
        );

        const payments: Payment[] = [];
        if (Number(downPayment) > 0) {
            payments.push({
                id: `payment-${new Date().getTime()}`,
                date: contractDate,
                amount: Number(downPayment),
            });
        }

        const newContract: Contract = {
            id: `contract-${new Date().getTime()}`,
            brandName,
            branchName,
            contractDate,
            constructionDate,
            collectionDate: collectionDate || null,
            salesAmount: Number(salesAmount),
            payments,
            expenses: validExpenses.map((exp, i) => ({...exp, id: `exp-${new Date().getTime()}-${i}`})) as Expense[],
            totalPurchaseAmount: validExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
            salesperson,
        };
        onAddContract(newContract);
        // Reset form
        setBrandName('');
        setBranchName('');
        setContractDate('');
        setConstructionDate('');
        setCollectionDate('');
        setSalesAmount('');
        setDownPayment('');
        setSalesperson('');
        setExpenses([{ item: '', amount: undefined }]);
        setIsCollectionDateEdited(false);
    };

    const balance = (Number(salesAmount) || 0) - (Number(downPayment) || 0);

    return (
        <Card title="신규 계약 등록">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={brandName} onChange={e => setBrandName(e.target.value)} required className="p-2 border rounded">
                        <option value="" disabled>브랜드 선택</option>
                        {getBrands().map(brand => (
                            <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))}
                    </select>
                    <input type="text" placeholder="지점명" value={branchName} 
                        onChange={e => setBranchName(e.target.value)}
                        required disabled={!brandName} className="p-2 border rounded disabled:bg-gray-100"/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">총 매출액</span>
                        <input type="number" placeholder="0" value={salesAmount} onChange={e => setSalesAmount(e.target.value)} required className="p-2 border rounded"/>
                    </label>
                     <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">계약금</span>
                        <input type="number" placeholder="0" value={downPayment} onChange={e => setDownPayment(e.target.value)} required className="p-2 border rounded"/>
                    </label>
                    <div>
                        <span className="text-sm font-medium text-gray-700 mb-1">잔금</span>
                        <p className="p-2 border rounded bg-gray-100 text-gray-700 h-[42px] flex items-center">
                            {balance.toLocaleString()} 원
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input type="text" placeholder="담당 영업사원" value={salesperson}
                        onChange={e => setSalesperson(e.target.value)}
                        required className="p-2 border rounded"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">계약일</span>
                        <input type="date" value={contractDate} onChange={e => setContractDate(e.target.value)} required className="p-2 border rounded"/>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">시공 예정일</span>
                        <input type="date" value={constructionDate} onChange={e => setConstructionDate(e.target.value)} required className="p-2 border rounded"/>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">수금 완료일 (선택)</span>
                        <input type="date" value={collectionDate} onChange={handleCollectionDateChange} className="p-2 border rounded"/>
                    </label>
                </div>

                <div>
                    <h4 className="font-semibold text-navy pt-2 mb-2">매입 항목</h4>
                    <div className="space-y-2">
                        {expenses.map((exp, index) => (
                             <div key={index} className="grid grid-cols-10 gap-2 items-center">
                                <input type="text" placeholder="항목명" value={exp.item || ''}
                                    onChange={e => handleExpenseChange(index, 'item', e.target.value)}
                                    className="p-2 border rounded col-span-5"/>
                                <input type="number" placeholder="금액" value={exp.amount || ''} onChange={e => handleExpenseChange(index, 'amount', Number(e.target.value))} className="p-2 border rounded col-span-4"/>
                                <button type="button" onClick={() => handleRemoveExpense(index)} className="text-red-500 hover:text-red-700 col-span-1 text-center font-bold">X</button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddExpense} className="mt-2 text-sm font-semibold text-navy hover:text-orange-accent">+ 항목 추가</button>
                </div>
                <button type="submit" className="w-full bg-navy text-white p-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors">계약 등록</button>
            </form>
        </Card>
    );
};

const ContractList: React.FC<{
    contracts: Contract[]; 
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
    onEdit: (contract: Contract) => void;
    onDelete: (contractId: string) => void;
}> = ({contracts, setContracts, onEdit, onDelete}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const escapeCsvField = (field: any): string => {
        if (field === null || field === undefined) return '';
        const str = String(field);
        if (/[",\n\r]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const handleExportCsv = () => {
        const headers = [
            'contract_id', 'brand_name', 'branch_name', 'contract_date', 'construction_date', 'collection_date',
            'sales_amount', 'total_paid_amount', 'balance', 'total_purchase_amount', 'profit', 'salesperson'
        ];
        const rows = contracts.map(c => {
            const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
            const profit = c.salesAmount - c.totalPurchaseAmount;
            const balance = c.salesAmount - totalPaid;
            const rowData = [
                c.id, c.brandName, c.branchName, c.contractDate, c.constructionDate, c.collectionDate || '',
                c.salesAmount, totalPaid, balance, c.totalPurchaseAmount, profit, c.salesperson
            ];
            return rowData.map(escapeCsvField).join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contracts_backup.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (window.confirm('기존 데이터를 덮어쓰고 가져온 데이터로 복원하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    const importedData = JSON.parse(text);
                    if (Array.isArray(importedData)) { // Basic validation
                        setContracts(importedData);
                        saveContracts(importedData);
                        alert('데이터를 성공적으로 가져왔습니다.');
                    } else { throw new Error('Invalid file format'); }
                } catch (error) {
                    alert('파일을 가져오는 중 오류가 발생했습니다. 유효한 JSON 파일인지 확인해주세요.');
                }
            };
            reader.readAsText(file);
        }
        if (event.target) event.target.value = '';
    };

    const headerActions = (
        <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".json" />
            <button onClick={handleImportClick} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">가져오기</button>
            <button onClick={handleExportCsv} className="px-3 py-1 text-sm font-medium text-white bg-navy rounded-md hover:bg-opacity-90">CSV로 내보내기</button>
        </>
    );

    return (
        <Card title="계약 목록" headerActions={headerActions}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">브랜드명</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">지점명</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">총 매출액</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">총 입금액</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">잔금</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">매입액</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">순손익</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">계약일</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">수금완료일</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">담당자</th>
                             <th scope="col" className="px-6 py-3 whitespace-nowrap text-right">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(c => {
                            const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
                            const profit = c.salesAmount - c.totalPurchaseAmount;
                            const balance = c.salesAmount - totalPaid;
                            const isCollected = !!c.collectionDate;
                            return (
                                <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {c.brandName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.branchName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.salesAmount.toLocaleString()}원</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{totalPaid.toLocaleString()}원</td>
                                    <td className={`px-6 py-4 font-bold whitespace-nowrap ${!isCollected && balance > 0 ? 'text-orange-accent' : 'text-gray-500'}`}>
                                        {balance.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.totalPurchaseAmount.toLocaleString()}원</td>
                                    <td className={`px-6 py-4 font-semibold whitespace-nowrap ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{profit.toLocaleString()}원</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.contractDate}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        {c.collectionDate || <span className="text-gray-400 italic">미완료</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.salesperson}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                        <button onClick={() => onEdit(c)} className="font-medium text-blue-600 hover:underline">수정</button>
                                        <button onClick={() => onDelete(c.id)} className="font-medium text-red-600 hover:underline">삭제</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {contracts.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-gray-text">등록된 계약이 없습니다.</h3>
                        <p className="text-sm text-gray-500 mt-2">상단 양식을 통해 신규 계약을 추가해주세요.</p>
                    </div>
                )}
            </div>
        </Card>
    );
}

const ContractManagement: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>(() => {
        const allContracts = getContracts();
        const migrated = allContracts.map((c: any) => {
            if (c.downPayment === undefined) {
                return { ...c, payments: c.payments || [] };
            }
            const { downPayment, ...rest } = c;
            const newContract: Omit<Contract, 'downPayment'> & { payments: Payment[] } = {
                ...rest,
                payments: [],
            };
            if (downPayment > 0) {
                newContract.payments.push({
                    id: `payment-${c.id}-migrated`,
                    amount: downPayment,
                    date: c.contractDate,
                });
            }
            return newContract as Contract;
        });

        const needsMigration = allContracts.some((c: any) => c.downPayment !== undefined);
        if (needsMigration) {
            saveContracts(migrated);
        }
        return migrated;
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);

    const addContract = (contract: Contract) => {
        const updatedContracts = [contract, ...contracts];
        setContracts(updatedContracts);
        saveContracts(updatedContracts);
    };
    
    const openEditModal = (contract: Contract) => {
        setEditingContract(contract);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingContract(null);
        setIsEditModalOpen(false);
    };

    const handleUpdateContract = (updatedContract: Contract) => {
        const updatedContracts = contracts.map(c => c.id === updatedContract.id ? updatedContract : c);
        setContracts(updatedContracts);
        saveContracts(updatedContracts);
        closeEditModal();
    };

    const handleDeleteContract = (contractId: string) => {
        if (window.confirm('정말로 이 계약을 삭제하시겠습니까?')) {
            const updatedContracts = contracts.filter(c => c.id !== contractId);
            setContracts(updatedContracts);
            saveContracts(updatedContracts);
        }
    };

    return (
        <div className="space-y-6">
            <ContractForm onAddContract={addContract} />
            <ContractList 
                contracts={contracts} 
                setContracts={setContracts}
                onEdit={openEditModal}
                onDelete={handleDeleteContract}
             />
             {editingContract && (
                <ContractEditModal
                    key={editingContract.id}
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    contract={editingContract}
                    onSave={handleUpdateContract}
                />
            )}
        </div>
    );
};

export default ContractManagement;