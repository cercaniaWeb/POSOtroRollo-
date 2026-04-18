import React, { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import POSView from './components/pages/POSView';
import DashboardView from './components/pages/DashboardView';
import KDSView from './components/pages/KDSView';
import GuestsView from './components/pages/GuestsView';
import InventoryView from './components/pages/InventoryView';
import SalesHistoryView from './components/pages/SalesHistoryView';
import UsersView from './components/pages/UsersView';
import QRView from './components/pages/QRView';
import SettingsView from './components/pages/SettingsView';
import CabinsView from './components/pages/CabinsView';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const initTheme = useThemeStore(state => state.initTheme);

  useEffect(() => {
    // Inicializar el tema persistente
    initTheme();
  }, [initTheme]);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "pos":
        return <POSView />;
      case "kds":
        return <KDSView />;
      case "guests":
        return <GuestsView />;
      case "users":
        return <UsersView />;
      case "inventory":
        return <InventoryView />;
      case "cabins":
        return <CabinsView />;
      case "sales":
        return <SalesHistoryView />;
      case "qr":
        return <QRView />;
      case "config":
        return <SettingsView />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center gap-4 bg-surface">
            <div className="rounded-2xl p-8 flex flex-col items-center gap-3 bg-surface shadow-neu">
              <span className="text-5xl">🚧</span>
              <h3 className="text-lg font-bold text-foreground">Pantalla en Construcción</h3>
              <p className="text-sm text-foreground-muted">Módulo <strong>{currentView}</strong> próximamente.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AppLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AppLayout>
  );
}

export default App;
