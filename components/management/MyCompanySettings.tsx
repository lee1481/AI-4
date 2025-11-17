import React, { useState, useRef } from 'react';
import Card from '../ui/Card';
import { CompanyProfile } from '../../types';
import { getCompanyInfo, saveCompanyInfo } from '../../services/dataService';

const MyCompanySettings: React.FC = () => {
    const [companyInfo, setCompanyInfo] = useState<CompanyProfile>(getCompanyInfo);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCompanyInfo(prev => ({ ...prev, logoImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        setCompanyInfo(prev => ({ ...prev, logoImage: undefined }));
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveCompanyInfo(companyInfo);
        alert('회사 정보가 저장되었습니다.');
    };

    return (
        <Card title="회사 정보 관리">
            <p className="text-sm text-gray-text mb-6">세금계산서 발행 등 향후 기능에 사용될 회사의 기본 정보를 입력해주세요.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Text Inputs */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">회사명 (상호)</label>
                                <input type="text" name="companyName" value={companyInfo.companyName} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">대표자명</label>
                                <input type="text" name="ceoName" value={companyInfo.ceoName} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
                            <input type="text" name="businessNumber" value={companyInfo.businessNumber} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">사업장 주소</label>
                            <input type="text" name="address" value={companyInfo.address} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">업태</label>
                                <input type="text" name="businessType" value={companyInfo.businessType} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">종목</label>
                                <input type="text" name="businessItem" value={companyInfo.businessItem} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">대표 연락처</label>
                                <input type="text" name="phoneNumber" value={companyInfo.phoneNumber} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">세금계산서 발행 이메일</label>
                                <input type="email" name="taxEmail" value={companyInfo.taxEmail} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Logo Upload */}
                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700">회사 로고</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {companyInfo.logoImage ? (
                                    <img src={companyInfo.logoImage} alt="로고 미리보기" className="mx-auto h-24 w-auto object-contain" />
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-navy hover:text-orange-accent focus-within:outline-none">
                                        <span>이미지 업로드</span>
                                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {companyInfo.logoImage && (
                            <button type="button" onClick={removeLogo} className="w-full text-sm text-red-600 hover:text-red-800">
                                로고 삭제
                            </button>
                        )}
                    </div>
                </div>

                <div className="pt-5 border-t">
                    <div className="flex justify-end">
                        <button type="submit" className="px-6 py-2 bg-navy text-white font-bold rounded-md hover:bg-opacity-90">
                            변경사항 저장
                        </button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default MyCompanySettings;
