import React from 'react';
import { LayoutDashboard, ShoppingBag, BarChart3, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, active = false }) => (
  <div className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ease-sophisticated flex items-center justify-center group
    ${active ? 'bg-primary-container text-white' : 'text-slate-brand hover:bg-white/10 hover:text-white'}`}>
    <Icon size={24} strokeWidth={1.5} />
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-24 bg-sidebar-navy h-screen fixed left-0 top-0 flex flex-col items-center py-8 space-y-8 z-50 shadow-2xl">
      <div className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center p-2 shadow-lg mb-4 hover:scale-105 transition-transform duration-300">
        <img src="/logo.png" alt="Otro Rollo Logo" className="w-full h-full object-contain" />
      </div>
      
      <div className="flex-1 space-y-4">
        <SidebarItem icon={LayoutDashboard} active />
        <SidebarItem icon={ShoppingBag} />
        <SidebarItem icon={BarChart3} />
        <SidebarItem icon={Settings} />
      </div>
      
      <div className="pb-4">
        <SidebarItem icon={LogOut} />
      </div>
    </div>
  );
};

export default Sidebar;
