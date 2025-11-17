import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../ui/Modal';
import { Contract, Expense, Payment } from '../../types';
import { getBrands } from '../../services/dataService';

const ContractEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    contract: Contract;
    onSave: (contract: Contract) => void;
}> = ({ isOpen, onClose, contract, onSave }) => {
    const [localContract, setLocalContract] = useState<Contract>(() => JSON.parse(JSON.stringify(contract)));
    const [isCollectionDateEdited, setIsCollectionDateEdited] = useState(() => !!contract.collectionDate);

    const totalPaid = useMemo(() => localContract.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [localContract.payments]);

    useEffect(() => {
        if (isCollectionDateEdited) return;

        const numericSales = localContract.salesAmount || 0;

        if (numericSales > 0 && numericSales === totalPaid) {
            const today = new Date().toISOString().split('T')[0];
            if (localContract.collectionDate !== today) {
                setLocalContract(prev => ({...prev, collectionDate: today}));
            }
        } else {
            if (localContract.collectionDate) {
                setLocalContract(prev => ({...prev, collectionDate: null}));
            }
        }
    }, [localContract.salesAmount, totalPaid, isCollectionDateEdited, localContract.collectionDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'collectionDate') {
            setIsCollectionDateEdited(true);
        }
        setLocalContract(prev => ({ ...prev!, [name]: value }));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalContract(prev => ({ ...prev!, [name]: Number(value) || 0 }));
    }

    const handleExpenseChange = (index: number, field: keyof Expense, value: string | number) => {
        const newExpenses = [...localContract.expenses];
        (newExpenses[index] as any)[field] = value;
        setLocalContract(prev => ({ ...prev, expenses: newExpenses }));
    };

    const handleAddExpense = () => {
        const newExpense: Expense = { id: `exp-${new Date().getTime()}`, item: '', amount: 0 };
        setLocalContract(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    };
    
    const handleRemoveExpense = (expenseId: string) => {
        setLocalContract(prev => ({...prev, expenses: prev.expenses.filter(e => e.id !== expenseId)}));
    }

    const handlePaymentChange = (index: number, field: keyof Omit<Payment, 'id'>, value: string | number) => {
        const newPayments = [...localContract.payments];
        const updatedValue = field === 'amount' ? Number(value) : value;
        (newPayments[index] as any)[field] = updatedValue;
        setLocalContract(prev => ({ ...prev, payments: newPayments }));
    };

    const handleAddPayment = () => {
        const newPayment: Payment = { id: `payment-${new Date().getTime()}`, date: new Date().toISOString().split('T')[0], amount: 0 };
        setLocalContract(prev => ({ ...prev, payments: [...prev.payments, newPayment] }));
    };

    const handleRemovePayment = (paymentId: string) => {
        setLocalContract(prev => ({ ...prev, payments: prev.payments.filter(p => p.id !== paymentId) }));
    };

    const handleSubmit = () => {
        const totalPurchaseAmount = localContract.expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
        const cleanedPayments = localContract.payments.filter(p => p.amount > 0 && p.date);
        onSave({ ...localContract, totalPurchaseAmount, payments: cleanedPayments });
    };

    if (!isOpen) return null;
    
    const balance = (localContract.salesAmount || 0) - totalPaid;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="계약 정보 수정">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="brandName" value={localContract.brandName} onChange={handleChange} required className="p-2 border rounded">
                        {getBrands().map(brand => (
                            <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))}
                    </select>
                     <input type="text" name="branchName" placeholder="지점명" value={localContract.branchName}
                        onChange={handleChange}
                        required className="p-2 border rounded"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">총 매출액</span>
                        <input type="number" name="salesAmount" value={localContract.salesAmount} onChange={handleAmountChange} required className="p-2 border rounded"/>
                    </label>
                    <div>
                        <span className="text-sm font-medium text-gray-700 mb-1">총 입금액</span>
                        <p className="p-2 border rounded bg-gray-100 text-gray-700 h-[42px] flex items-center">{totalPaid.toLocaleString()} 원</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-700 mb-1">잔금</span>
                         <p className="p-2 border rounded bg-gray-100 text-gray-700 h-[42px] flex items-center">{balance.toLocaleString()} 원</p>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-semibold text-navy pt-2 mb-2">입금 내역</h4>
                    <div className="space-y-2">
                        {localContract.payments.map((payment, index) => (
                            <div key={payment.id} className="grid grid-cols-10 gap-2 items-center">
                                <input type="date" value={payment.date} onChange={e => handlePaymentChange(index, 'date', e.target.value)} required className="p-2 border rounded col-span-4"/>
                                <input type="number" placeholder="금액" value={payment.amount || ''} onChange={e => handlePaymentChange(index, 'amount', e.target.value)} required className="p-2 border rounded col-span-5"/>
                                <button type="button" onClick={() => handleRemovePayment(payment.id)} className="text-red-500 hover:text-red-700 col-span-1 text-center font-bold">X</button>
                            </div>
                        ))}
                         {localContract.payments.length === 0 && <p className="text-sm text-gray-400 pl-1">입금 내역이 없습니다.</p>}
                    </div>
                     <button type="button" onClick={handleAddPayment} className="mt-2 text-sm font-semibold text-navy hover:text-orange-accent">+ 입금 내역 추가</button>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="salesperson" placeholder="담당 영업사원" value={localContract.salesperson}
                        onChange={handleChange}
                        required className="p-2 border rounded"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">계약일</span>
                        <input type="date" name="contractDate" value={localContract.contractDate} onChange={handleChange} required className="p-2 border rounded"/>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">시공 예정일</span>
                        <input type="date" name="constructionDate" value={localContract.constructionDate} onChange={handleChange} required className="p-2 border rounded"/>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">수금 완료일 (선택)</span>
                        <input type="date" name="collectionDate" value={localContract.collectionDate || ''} onChange={handleChange} className="p-2 border rounded"/>
                    </label>
                </div>

                <div>
                    <h4 className="font-semibold text-navy pt-2 mb-2">매입 항목</h4>
                    <div className="space-y-2">
                        {localContract.expenses.map((exp, index) => (
                            <div key={exp.id} className="grid grid-cols-10 gap-2 items-center">
                                <input type="text" placeholder="항목명" value={exp.item}
                                    onChange={e => handleExpenseChange(index, 'item', e.target.value)}
                                    required className="p-2 border rounded col-span-5"/>
                                <input type="number" placeholder="금액" value={exp.amount || ''} onChange={e => handleExpenseChange(index, 'amount', Number(e.target.value))} required className="p-2 border rounded col-span-4"/>
                                <button type="button" onClick={() => handleRemoveExpense(exp.id)} className="text-red-500 hover:text-red-700 col-span-1 text-center font-bold">X</button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddExpense} className="mt-2 text-sm font-semibold text-navy hover:text-orange-accent">+ 항목 추가</button>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-6 border-t mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">취소</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90">저장</button>
            </div>
        </Modal>
    );
};

export default ContractEditModal;
