import React from 'react';
import Icon from './Icon';

const PageHeader: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button onClick={onBack} aria-label={`Back to previous page`} className="p-2 -ml-2 rounded-full hover:bg-gray-200/80 transition-colors">
      <Icon name="back" className="h-6 w-6 text-gray-700" />
    </button>
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
  </div>
);

export default PageHeader;
