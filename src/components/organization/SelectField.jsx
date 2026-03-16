import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = forwardRef(({ label, options, error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-[#374151] text-[13px] font-bold mb-[8px] flex items-center">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          {...props}
          className={`w-full h-[44px] rounded-[10px] border ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-100'} !pl-[16px] pr-[16px] appearance-none outline-none transition-all text-[14px] text-gray-900 bg-white`}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown size={18} strokeWidth={2} />
        </div>
      </div>
      {error && <span className="text-[12px] text-red-500 mt-[6px] font-medium">{error}</span>}
    </div>
  );
});
SelectField.displayName = 'SelectField';

export default SelectField;
