import React, { useState, useRef } from 'react';
import { getBrands, saveBrands } from '../../services/dataService';
import { Brand, BrandContact, BrandContactCategory } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { extractBrandInfoFromImage } from '../../services/geminiService';

// Define Props interface for the modal
interface BrandEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    brandToEdit: Brand;
    onSave: () => void;
    onBrandFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    contactForm: Omit<BrandContact, 'id'>;
    onContactFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onContactSubmit: () => void;
    editingContactId: string | null;
    onStartEditContact: (contact: BrandContact) => void;
    onRemoveContact: (contactId: string) => void;
    onCancelEditContact: () => void;
    onTriggerCertificateUpload: () => void;
    isOcrLoading: boolean;
}

// Sub-component for editing a brand in a modal (Now a standalone component)
const BrandEditModal: React.FC<BrandEditModalProps> = ({
    isOpen, onClose, brandToEdit, onSave, onBrandFieldChange, contactForm, onContactFormChange, 
    onContactSubmit, editingContactId, onStartEditContact, onRemoveContact, onCancelEditContact,
    onTriggerCertificateUpload, isOcrLoading
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${brandToEdit.name} 정보 관리`}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">브랜드 이름</label>
                    <input type="text" name="name" value={brandToEdit.name}
                        onChange={onBrandFieldChange}
                        className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2">사업자등록번호</label>
                    <input type="text" name="businessRegistrationNumber" value={brandToEdit.businessRegistrationNumber || ''}
                        onChange={onBrandFieldChange}
                        className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2">사업장 주소</label>
                    <input type="text" name="address" value={brandToEdit.address || ''}
                        onChange={onBrandFieldChange}
                        className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2">대표번호</label>
                    <input type="text" name="mainPhoneNumber" value={brandToEdit.mainPhoneNumber || ''}
                        onChange={onBrandFieldChange}
                        className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2">홈페이지 주소</label>
                    <input type="url" name="websiteUrl" value={brandToEdit.websiteUrl || ''}
                        placeholder="https://example.com"
                        onChange={onBrandFieldChange}
                        className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2">사업자등록증</label>
                    {brandToEdit.certificateImage ? (
                        <img src={brandToEdit.certificateImage} alt="Certificate" className="mt-1 w-full rounded-md border" />
                    ) : (
                        <div className="mt-1 p-4 text-center bg-gray-50 rounded-md text-gray-500 text-sm">등록된 이미지가 없습니다.</div>
                    )}
                    <button 
                        type="button" 
                        onClick={onTriggerCertificateUpload} 
                        className="mt-2 w-full text-sm font-semibold text-navy p-2 border border-navy rounded-md hover:bg-gray-50 disabled:opacity-50"
                        disabled={isOcrLoading}
                    >
                        {isOcrLoading ? '분석 중...' : (brandToEdit.certificateImage ? '이미지 변경' : '이미지 업로드')}
                    </button>
                </div>
                
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-navy mb-2">담당자 목록</h4>
                    <div className="space-y-2">
                    {brandToEdit.contacts.map(contact => (
                        <div key={contact.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold">{contact.name} <span className="text-xs font-normal text-gray-500 ml-1">{contact.category}</span></p>
                                <p className="text-gray-600">{contact.phone} | {contact.email}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => onStartEditContact(contact)} className="font-medium text-blue-600 hover:underline text-xs">수정</button>
                                <button onClick={() => onRemoveContact(contact.id)} className="font-medium text-red-600 hover:underline text-xs">삭제</button>
                            </div>
                        </div>
                    ))}
                     {brandToEdit.contacts.length === 0 && <p className="text-sm text-gray-400">등록된 담당자가 없습니다.</p>}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-semibold text-navy mb-2">{editingContactId ? '담당자 정보 수정' : '신규 담당자 추가'}</h4>
                    <div className="space-y-2">
                         <input name="name" value={contactForm.name}
                            onChange={onContactFormChange}
                            placeholder="이름" className="w-full p-2 border rounded-md text-sm" />
                         <input name="phone" value={contactForm.phone}
                            onChange={onContactFormChange}
                            placeholder="연락처" className="w-full p-2 border rounded-md text-sm" />
                         <input name="email" value={contactForm.email}
                            onChange={onContactFormChange}
                            placeholder="이메일" className="w-full p-2 border rounded-md text-sm" />
                         <select name="category" value={contactForm.category} onChange={onContactFormChange} className="w-full p-2 border rounded-md text-sm">
                            {Object.values(BrandContactCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                         </select>
                         <div className="flex items-center space-x-2">
                            <button onClick={onContactSubmit} className="w-full text-sm font-semibold text-white p-2 bg-navy rounded-md hover:bg-opacity-90">
                                {editingContactId ? '정보 수정' : '+ 담당자 추가'}
                            </button>
                            {editingContactId && (
                                <button onClick={onCancelEditContact} className="w-auto px-4 text-sm font-semibold text-gray-700 p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                    취소
                                </button>
                            )}
                         </div>
                    </div>
                </div>
            </div>
             <div className="flex justify-end space-x-2 pt-6 border-t mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">취소</button>
                <button onClick={onSave} className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90">저장</button>
            </div>
        </Modal>
    )
};


const BrandManagement: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>(getBrands);
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandAddress, setNewBrandAddress] = useState('');
    const [newBrandBusinessNumber, setNewBrandBusinessNumber] = useState('');
    const [newBrandMainPhoneNumber, setNewBrandMainPhoneNumber] = useState('');
    const [newBrandWebsiteUrl, setNewBrandWebsiteUrl] = useState('');
    const [newBrandCertificate, setNewBrandCertificate] = useState<string | null>(null);
    const [isOcrLoading, setIsOcrLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const certificateInputRef = useRef<HTMLInputElement>(null);
    const modalCertificateInputRef = useRef<HTMLInputElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for the modal is now managed in the parent component
    const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
    const [contactForm, setContactForm] = useState<Omit<BrandContact, 'id'>>({name: '', phone: '', email: '', category: BrandContactCategory.Executive});
    const [editingContactId, setEditingContactId] = useState<string | null>(null);

    // Certificate Search & Viewer State
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
    const [viewingBrand, setViewingBrand] = useState<Brand | null>(null);

    const handleCertificateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsOcrLoading(true);
        setNewBrandName('');
        setNewBrandAddress('');
        setNewBrandBusinessNumber('');
        setNewBrandCertificate(null);

        try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
            setNewBrandCertificate(dataUrl); // For preview and saving

            const base64String = dataUrl.split(',')[1];
            const result = await extractBrandInfoFromImage(base64String, file.type);
            
            setNewBrandName(result.brandName || '');
            setNewBrandAddress(result.address || '');
            setNewBrandBusinessNumber(result.businessNumber || '');

        } catch (error) {
            console.error(error);
            alert('사업자등록증 분석에 실패했습니다. 이미지를 확인하고 다시 시도해주세요.');
        } finally {
            setIsOcrLoading(false);
            if(event.target) event.target.value = '';
        }
    };
    
    const handleModalCertificateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !brandToEdit) return;

        setIsOcrLoading(true);

        try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const base64String = dataUrl.split(',')[1];
            const result = await extractBrandInfoFromImage(base64String, file.type);
            
            const confirmUpdate = window.confirm('AI가 분석한 정보로 양식을 자동 완성하시겠습니까? 기존에 입력한 내용이 변경될 수 있습니다.');
            
            if(confirmUpdate) {
                 setBrandToEdit({
                    ...brandToEdit,
                    name: result.brandName || brandToEdit.name,
                    address: result.address || brandToEdit.address,
                    businessRegistrationNumber: result.businessNumber || brandToEdit.businessRegistrationNumber,
                    certificateImage: dataUrl,
                });
            } else {
                setBrandToEdit({
                    ...brandToEdit,
                    certificateImage: dataUrl,
                });
            }

        } catch (error) {
            console.error(error);
            alert('사업자등록증 분석에 실패했습니다.');
        } finally {
            setIsOcrLoading(false);
            if(event.target) event.target.value = '';
        }
    };


    const handleAddBrand = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBrandName.trim() === '') {
            alert('브랜드 이름을 입력해주세요.');
            return;
        }
        
        const newBrand: Brand = {
            id: `brand-${new Date().getTime()}`,
            name: newBrandName.trim(),
            address: newBrandAddress.trim(),
            businessRegistrationNumber: newBrandBusinessNumber.trim(),
            mainPhoneNumber: newBrandMainPhoneNumber.trim(),
            websiteUrl: newBrandWebsiteUrl.trim(),
            certificateImage: newBrandCertificate || undefined,
            contacts: [],
        };
        const updatedBrands = [newBrand, ...brands];
        setBrands(updatedBrands);
        saveBrands(updatedBrands);
        
        // Reset form
        setNewBrandName('');
        setNewBrandAddress('');
        setNewBrandBusinessNumber('');
        setNewBrandMainPhoneNumber('');
        setNewBrandWebsiteUrl('');
        setNewBrandCertificate(null);
    };

    const handleDeleteBrand = (brandId: string) => {
        if (window.confirm('브랜드를 삭제하면 관련된 모든 정보가 사라집니다. 정말 삭제하시겠습니까?')) {
           const updatedBrands = brands.filter(b => b.id !== brandId);
           setBrands(updatedBrands);
           saveBrands(updatedBrands);
        }
    };
    
    // --- Modal Logic ---
    const openEditModal = (brand: Brand) => {
        setBrandToEdit(JSON.parse(JSON.stringify(brand))); // Deep copy to prevent direct mutation
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setBrandToEdit(null);
        setEditingContactId(null);
        setContactForm({name: '', phone: '', email: '', category: BrandContactCategory.Executive});
    };

    const handleSaveBrand = () => {
        if (!brandToEdit) return;

        let finalBrandToSave = brandToEdit;

        // Auto-add contact if form is filled but not submitted
        if (contactForm.name.trim() && !editingContactId) {
            const newContact: BrandContact = {
                ...contactForm,
                id: `contact-${new Date().getTime()}`,
            };
            finalBrandToSave = {
                ...brandToEdit,
                contacts: [...brandToEdit.contacts, newContact],
            };
        }

        const updatedBrands = brands.map(b => b.id === finalBrandToSave.id ? finalBrandToSave : b);
        setBrands(updatedBrands);
        saveBrands(updatedBrands);
        closeEditModal();
    }

    // --- Modal State Handlers (to be passed as props) ---
     const handleBrandFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (brandToEdit) {
            setBrandToEdit({ ...brandToEdit, [e.target.name]: e.target.value });
        }
    };

    const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setContactForm({...contactForm, [e.target.name]: e.target.value});
    };
    
    const cancelEditContact = () => {
        setEditingContactId(null);
        setContactForm({name: '', phone: '', email: '', category: BrandContactCategory.Executive});
    };
    
    const handleContactSubmit = () => {
        if (!contactForm.name || !contactForm.phone || !brandToEdit) return;

        let updatedBrand: Brand;

        if (editingContactId) { // Update existing contact
            const updatedContacts = brandToEdit.contacts.map(c =>
                c.id === editingContactId ? { ...c, ...contactForm } : c
            );
            updatedBrand = { ...brandToEdit, contacts: updatedContacts };
        } else { // Add new contact
            const contactToAdd: BrandContact = { ...contactForm, id: `contact-${new Date().getTime()}` };
            updatedBrand = { ...brandToEdit, contacts: [...brandToEdit.contacts, contactToAdd] };
        }

        // Update the state for the modal UI to reflect the change immediately
        setBrandToEdit(updatedBrand);

        // Update the main brands list and persist to localStorage automatically
        const updatedBrands = brands.map(b => b.id === updatedBrand.id ? updatedBrand : b);
        setBrands(updatedBrands);
        saveBrands(updatedBrands);

        // Reset the contact form
        cancelEditContact();
    };

    const startEditContact = (contact: BrandContact) => {
        setEditingContactId(contact.id);
        setContactForm({
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            category: contact.category,
        });
    };

    const removeContact = (contactId: string) => {
        if(brandToEdit) {
            const updatedBrand = {...brandToEdit, contacts: brandToEdit.contacts.filter(c => c.id !== contactId)};
            setBrandToEdit(updatedBrand);

            const updatedBrands = brands.map(b => b.id === updatedBrand.id ? updatedBrand : b);
            setBrands(updatedBrands);
            saveBrands(updatedBrands);
        }
    };

    // --- Search & Viewer Logic ---
    const filteredBrandsForSearch = brands.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
    );

    const openViewerModal = (brand: Brand) => {
        setViewingBrand(brand);
        setIsViewerModalOpen(true);
        setSearchQuery('');
    };

    const closeViewerModal = () => {
        setViewingBrand(null);
        setIsViewerModalOpen(false);
    };
    
    const handleDownloadCertificate = () => {
        if (!viewingBrand || !viewingBrand.certificateImage) return;

        const link = document.createElement('a');
        link.href = viewingBrand.certificateImage;
        
        const mimeType = viewingBrand.certificateImage.match(/data:(image\/\w+);/)?.[1];
        const extension = mimeType ? mimeType.split('/')[1] : 'png';

        link.download = `${viewingBrand.name}_사업자등록증.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Data Import/Export ---
    const escapeCsvField = (field: any): string => {
        if (field === null || field === undefined) return '';
        const str = String(field);
        if (/[",\n\r]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const handleExportCsv = () => {
        const headers = ['brand_id', 'brand_name', 'contact_id', 'contact_name', 'contact_phone', 'contact_email', 'contact_category'];
        const rows = brands.flatMap(b => {
            const brandData = [b.id, b.name];
            if (b.contacts.length === 0) {
                return [ [...brandData, '', '', '', '', ''].map(escapeCsvField).join(',') ];
            }
            return b.contacts.map(c => {
                const contactData = [c.id, c.name, c.phone, c.email, c.category];
                return [...brandData, ...contactData].map(escapeCsvField).join(',');
            });
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brands_backup.csv';
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
                        setBrands(importedData);
                        saveBrands(importedData);
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

    return (
        <div className="space-y-6">
            <input 
                type="file" 
                ref={modalCertificateInputRef} 
                onChange={handleModalCertificateUpload} 
                style={{ display: 'none' }} 
                accept="image/*"
            />

            <Card title="신규 브랜드 등록">
                 <form onSubmit={handleAddBrand} className="space-y-4">
                    <div>
                        <input type="file" ref={certificateInputRef} onChange={handleCertificateUpload} style={{ display: 'none' }} accept="image/*" />
                        <button type="button" onClick={() => certificateInputRef.current?.click()} className="w-full p-3 border-2 border-dashed rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            사업자등록증 첨부하여 자동 완성
                        </button>
                    </div>

                    {isOcrLoading && (
                        <div className="flex items-center justify-center h-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                            <p className="ml-3 text-gray-text">AI가 사업자등록증을 분석 중입니다...</p>
                        </div>
                    )}
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">또는 수기로 직접 입력</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">브랜드 이름</label>
                                <input type="text" value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                    placeholder="브랜드 이름 (상호)" className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
                                <input type="text" value={newBrandBusinessNumber}
                                    onChange={(e) => setNewBrandBusinessNumber(e.target.value)}
                                    placeholder="사업자등록번호" className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">사업장 주소</label>
                                <input type="text" value={newBrandAddress}
                                    onChange={(e) => setNewBrandAddress(e.target.value)}
                                    placeholder="사업장 주소" className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">대표번호</label>
                                <input type="text" value={newBrandMainPhoneNumber}
                                    onChange={(e) => setNewBrandMainPhoneNumber(e.target.value)}
                                    placeholder="대표번호" className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">홈페이지 주소</label>
                                <input type="url" value={newBrandWebsiteUrl}
                                    onChange={(e) => setNewBrandWebsiteUrl(e.target.value)}
                                    placeholder="https://example.com" className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">첨부된 이미지 (선택)</label>
                            {newBrandCertificate ? (
                                <img src={newBrandCertificate} alt="Business Certificate Preview" className="w-full rounded-md border" />
                            ) : (
                                <div className="flex-grow flex items-center justify-center h-full border-2 border-dashed rounded-lg text-gray-400 bg-gray-50 min-h-[150px]">
                                    <p>이미지 미리보기</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full px-4 py-2 bg-navy text-white font-semibold rounded-md hover:bg-opacity-90" disabled={isOcrLoading}>
                        {isOcrLoading ? '분석 중...' : '브랜드 등록'}
                    </button>
                </form>
            </Card>

            <Card title="사업자등록증 찾기">
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder="브랜드명을 입력하여 등록증을 검색하세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-md" 
                    />
                    {searchQuery && (
                        <ul className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredBrandsForSearch.length > 0 ? (
                                filteredBrandsForSearch.map(brand => (
                                    <li 
                                        key={brand.id}
                                        onClick={() => openViewerModal(brand)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {brand.name}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-500">검색 결과가 없습니다.</li>
                            )}
                        </ul>
                    )}
                </div>
            </Card>

            <Card title="데이터 관리">
                <div className="flex items-center space-x-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".json" />
                    <button onClick={handleImportClick} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">전체 가져오기</button>
                    <button onClick={handleExportCsv} className="px-4 py-2 text-sm font-medium text-white bg-navy rounded-md hover:bg-opacity-90">CSV로 내보내기</button>
                    <p className="text-sm text-gray-500">모든 브랜드와 담당자 정보를 백업하거나 복원합니다.</p>
                </div>
            </Card>

            <div className="space-y-4">
                {brands.map(brand => (
                    <Card key={brand.id}>
                        <div className="flex justify-between items-start">
                           <div>
                             <h3 className="text-xl font-bold text-navy">{brand.name}</h3>
                             <div className="text-sm text-gray-500 mt-1 space-y-1">
                                <p>담당자: {brand.contacts.length}명</p>
                                {brand.businessRegistrationNumber && <p>사업자번호: {brand.businessRegistrationNumber}</p>}
                                {brand.mainPhoneNumber && <p>대표번호: {brand.mainPhoneNumber}</p>}
                                {brand.websiteUrl && <p>홈페이지: <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{brand.websiteUrl}</a></p>}
                             </div>
                           </div>
                            <div className="space-x-2 flex-shrink-0">
                                <button onClick={() => openEditModal(brand)} className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200">관리</button>
                                <button onClick={() => handleDeleteBrand(brand.id)} className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200">삭제</button>
                            </div>
                        </div>
                    </Card>
                ))}
                 {brands.length === 0 && (
                    <Card><p className="text-center text-gray-500">등록된 브랜드가 없습니다.</p></Card>
                )}
            </div>
            
            {viewingBrand && (
                <Modal isOpen={isViewerModalOpen} onClose={closeViewerModal} title={`${viewingBrand.name} 사업자등록증`}>
                    <div>
                        {viewingBrand.certificateImage ? (
                            <img src={viewingBrand.certificateImage} alt={`${viewingBrand.name} certificate`} className="w-full rounded-md border" />
                        ) : (
                            <p className="text-center py-10 text-gray-500">이 브랜드에 등록된 사업자등록증이 없습니다.</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
                        {viewingBrand.certificateImage && (
                           <button onClick={handleDownloadCertificate} className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90">다운로드</button>
                        )}
                        <button onClick={closeViewerModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">닫기</button>
                    </div>
                </Modal>
            )}

            {brandToEdit && (
                <BrandEditModal 
                    isOpen={isModalOpen}
                    onClose={closeEditModal}
                    brandToEdit={brandToEdit}
                    onSave={handleSaveBrand}
                    onBrandFieldChange={handleBrandFieldChange}
                    contactForm={contactForm}
                    onContactFormChange={handleContactFormChange}
                    onContactSubmit={handleContactSubmit}
                    editingContactId={editingContactId}
                    onStartEditContact={startEditContact}
                    onRemoveContact={removeContact}
                    onCancelEditContact={cancelEditContact}
                    onTriggerCertificateUpload={() => modalCertificateInputRef.current?.click()}
                    isOcrLoading={isOcrLoading}
                />
            )}
        </div>
    );
};

export default BrandManagement;
