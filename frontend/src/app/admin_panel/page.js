"use client";
import { useState } from 'react';
import Layout from '../../components/admin_panel/Layout';
import Dashboard from '../../components/admin_panel/Dashboard';
import Boards from '../../components/admin_panel/Boards';
import Clubs from '../../components/admin_panel/Clubs';
import Users from '../../components/admin_panel/Users';
import POR from '../../components/admin_panel/POR';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'boards':
        return <Boards />;
      case 'clubs':
        return <Clubs />;
      case 'users':
        return <Users />;
      case 'por':
        return <POR />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </Layout>
  );
}