import React from 'react';
import AppHeader from './AppHeader';
import PageHeader from './PageHeader';
import Icon from './Icon';

const isBase64Image = (str: string | null | undefined): str is string => !!str && str.startsWith('data:image/');

const AddItemForm: React.FC<{ 
  title: string; 
  onBack: () => void; 
  onOpenProfile: () => void; 
  onOpenNotifications: () => void; 
  children: React.ReactNode;
  onImageButtonClick: () => void;
  imagePreview?: string | null;
}> = ({ title, onBack, onOpenProfile, onOpenNotifications, children, onImageButtonClick, imagePreview }) => (
  <div className="p-5 w-full max-w-md mx-auto">
      <AppHeader onOpenProfile={onOpenProfile} onOpenNotifications={onOpenNotifications} />
      <PageHeader title={title} onBack={onBack} />
      <div className="flex flex-col items-center gap-8">
        <button 
          type="button" 
          onClick={onImageButtonClick}
          className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center relative shadow-inner border-2 border-dashed border-gray-300 overflow-hidden"
        >
          {isBase64Image(imagePreview) ? (
            <img src={imagePreview} alt="Item preview" className="w-full h-full object-cover" />
          ) : (
            <Icon name="camera" className="h-16 w-16 text-gray-400" />
          )}
          <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-[#FEFBF6]"><Icon name="plus" className="h-5 w-5" /></div>
        </button>
        {children}
      </div>
    </div>
);

export default AddItemForm;