import React from 'react';
import { Page } from '../../App';

// Icon components
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ContractsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ReceivablesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const AnalysisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const BrandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const CompanyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      isActive ? 'bg-orange-accent text-white' : 'text-white hover:bg-white hover:bg-opacity-20'
    }`}
  >
    {icon}
    <span className="ml-3 font-semibold">{label}</span>
  </li>
);

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, setCurrentPage, onLogout }) => {
  const pageTitles: Record<Page, string> = {
    [Page.Dashboard]: '대시보드',
    [Page.Contracts]: '계약 관리',
    [Page.Receivables]: '미수금 관리',
    [Page.Analysis]: '브랜드별 손익 분석',
    [Page.Targets]: 'AI 타겟 발굴',
    [Page.UserManagement]: '회원 관리',
    [Page.BrandManagement]: '브랜드 관리',
    [Page.MyCompanySettings]: '회사 정보 관리',
    [Page.Login]: '',
    [Page.SignUp]: '',
  };

  return (
    <div className="flex h-screen bg-gray-light font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-navy flex flex-col">
        <div className="flex items-center justify-center h-20 border-b border-white border-opacity-20">
          <h1 className="text-xl font-extrabold text-white tracking-wider">AI 영업 비서</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <NavItem icon={<DashboardIcon />} label="대시보드" isActive={currentPage === Page.Dashboard} onClick={() => setCurrentPage(Page.Dashboard)} />
            <NavItem icon={<ContractsIcon />} label="계약 관리" isActive={currentPage === Page.Contracts} onClick={() => setCurrentPage(Page.Contracts)} />
            <NavItem icon={<ReceivablesIcon />} label="미수금 관리" isActive={currentPage === Page.Receivables} onClick={() => setCurrentPage(Page.Receivables)} />
            <NavItem icon={<AnalysisIcon />} label="손익 분석" isActive={currentPage === Page.Analysis} onClick={() => setCurrentPage(Page.Analysis)} />
            <NavItem icon={<TargetIcon />} label="AI 타겟 발굴" isActive={currentPage === Page.Targets} onClick={() => setCurrentPage(Page.Targets)} />
            <div className="my-4 border-t border-white border-opacity-10"></div>
            <NavItem icon={<UserIcon />} label="회원 관리" isActive={currentPage === Page.UserManagement} onClick={() => setCurrentPage(Page.UserManagement)} />
            <NavItem icon={<BrandIcon />} label="브랜드 관리" isActive={currentPage === Page.BrandManagement} onClick={() => setCurrentPage(Page.BrandManagement)} />
            <NavItem icon={<SettingsIcon />} label="회사 정보 관리" isActive={currentPage === Page.MyCompanySettings} onClick={() => setCurrentPage(Page.MyCompanySettings)} />
          </ul>
        </nav>
        <div className="p-4 border-t border-white border-opacity-20">
          <div onClick={onLogout} className="flex items-center p-3 rounded-lg cursor-pointer text-white hover:bg-white hover:bg-opacity-20 transition-colors">
            <LogoutIcon/>
            <span className="ml-3 font-semibold">로그아웃</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-navy">{pageTitles[currentPage]}</h1>
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-light">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;