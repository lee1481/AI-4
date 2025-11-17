import React, { useState, useCallback } from 'react';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ContractManagement from './components/contracts/ContractManagement';
import BrandAnalysis from './components/analysis/BrandAnalysis';
import TargetDiscovery from './components/targets/TargetDiscovery';
import UserManagement from './components/management/UserManagement';
import BrandManagement from './components/management/BrandManagement';
import MyCompanySettings from './components/management/MyCompanySettings';
import ReceivablesManagement from './components/receivables/ReceivablesManagement';
import { User } from './types';
import { getUsers, saveUsers } from './services/dataService';


export enum Page {
  Login,
  SignUp,
  Dashboard,
  Contracts,
  Receivables,
  Analysis,
  Targets,
  UserManagement,
  BrandManagement,
  MyCompanySettings,
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setCurrentPage(Page.Dashboard);
  }, []);
  
  const handleSignUp = useCallback((newUser: Omit<User, 'id'>) => {
    const userWithId = { ...newUser, id: `user-${new Date().getTime()}`};
    const currentUsers = getUsers();
    const updatedUsers = [...currentUsers, userWithId];
    saveUsers(updatedUsers); // Persist the new user list
    
    // After signing up, automatically log in
    setIsAuthenticated(true);
    setCurrentPage(Page.Dashboard);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage(Page.Login);
    setAuthPage('login');
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case Page.Contracts:
        return <ContractManagement />;
      case Page.Receivables:
        return <ReceivablesManagement />;
      case Page.Analysis:
        return <BrandAnalysis />;
      case Page.Targets:
        return <TargetDiscovery />;
      case Page.UserManagement:
        return <UserManagement />;
      case Page.BrandManagement:
        return <BrandManagement />;
      case Page.MyCompanySettings:
        return <MyCompanySettings />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    if (authPage === 'login') {
      return <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAuthPage('signup')} />;
    }
    return <SignUpScreen onSignUp={handleSignUp} onNavigateToLogin={() => setAuthPage('login')} />;
  }

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout}>
      {renderContent()}
    </MainLayout>
  );
};

export default App;