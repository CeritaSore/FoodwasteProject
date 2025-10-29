import React, { ChangeEvent } from 'react';

// FIX: Added 'required' to the component's props to allow the 'required' attribute on the input element.
const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: 'text' | 'number'|'date'; placeholder?: string; required?: boolean; }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      id={id} name={id}
      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
      {...props}
    />
  </div>
);

export default InputField;