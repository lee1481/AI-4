import React, { useState, useRef } from 'react';
import { getUsers, saveUsers } from '../../services/dataService';
import { User } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(getUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditForm({ name: user.name, email: user.email, password: '' }); // Don't pre-fill password
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
        setEditForm({ name: '', email: '', password: '' });
    };

    const handleUpdateUser = () => {
        if (editingUser) {
            const updatedUsers = users.map(u => {
                if (u.id === editingUser.id) {
                    return {
                        ...u,
                        name: editForm.name,
                        email: editForm.email,
                        password: editForm.password ? editForm.password : u.password,
                    };
                }
                return u;
            });
            setUsers(updatedUsers);
            saveUsers(updatedUsers);
            closeEditModal();
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            saveUsers(updatedUsers);
        }
    };

    const escapeCsvField = (field: any): string => {
        if (field === null || field === undefined) return '';
        const str = String(field);
        if (/[",\n\r]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const handleExportCsv = () => {
        const headers = ['id', 'name', 'email'];
        const rows = users.map(u => 
            [u.id, u.name, u.email].map(escapeCsvField).join(',')
        );
        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users_backup.csv';
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
                        setUsers(importedData);
                        saveUsers(importedData);
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
        <>
            <Card title="회원 명부" headerActions={headerActions}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">이름</th>
                                <th scope="col" className="px-6 py-3">이메일</th>
                                <th scope="col" className="px-6 py-3 text-right">작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openEditModal(user)} className="font-medium text-blue-600 hover:underline">수정</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="font-medium text-red-600 hover:underline">삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500">등록된 회원이 없습니다.</div>
                    )}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeEditModal} title="회원 정보 수정">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            id="userName"
                            name="name"
                            value={editForm.name}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">이메일</label>
                        <input
                            type="email"
                            id="userEmail"
                            name="email"
                            value={editForm.email}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            id="userPassword"
                            name="password"
                            value={editForm.password}
                            onChange={handleFormChange}
                            placeholder="새 비밀번호 (변경 시에만 입력)"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy sm:text-sm"
                        />
                    </div>
                     <div className="flex justify-end space-x-2 pt-4">
                        <button onClick={closeEditModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">취소</button>
                        <button onClick={handleUpdateUser} className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90">저장</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UserManagement;
