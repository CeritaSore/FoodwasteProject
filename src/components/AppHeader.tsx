import React from 'react';
import Icon from './Icon';

const AppHeader: React.FC<{ onOpenProfile: () => void; onOpenNotifications: () => void; }> = ({ onOpenProfile, onOpenNotifications }) => (
  <header className="flex justify-between items-center mb-6">
    <button onClick={onOpenNotifications} aria-label="Notifications" className="p-2 rounded-full hover:bg-gray-200/80 transition-colors">
      <Icon name="bell" className="h-7 w-7 text-gray-600" />
    </button>
    <button onClick={onOpenProfile} aria-label="User Profile" className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center ring-2 ring-transparent hover:ring-purple-400 transition-all">
       <Icon name="user" className="h-8 w-8 text-purple-500" />
    </button>
  </header>
);

export default AppHeader;
