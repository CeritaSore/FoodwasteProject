import React from 'react';
import Icon from './Icon';

const FloatingActionButton: React.FC<{ onClick: () => void; icon: 'plus' | 'edit'; }> = ({ onClick, icon }) => (
  <button onClick={onClick} className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 z-10">
    <Icon name={icon} className={icon === 'edit' ? "h-7 w-7" : "h-8 w-8"} />
  </button>
);

export default FloatingActionButton;
