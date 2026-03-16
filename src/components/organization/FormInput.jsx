import React, { forwardRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

const FormInput = forwardRef(({ label, required, placeholder, type = "text", isValid, helperText, error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-[#374151] text-[13px] font-bold mb-[8px] flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        <input
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...props}
          className={`w-full h-[44px] rounded-[10px] border ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : isValid ? 'border-[#10B981] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]' : 'border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-100'} !pl-[16px] pr-[16px] outline-none transition-all text-[14px] text-gray-900 placeholder:text-gray-400 bg-white`}
        />
        {isValid && !error && (
          <div className="absolute right-[14px] text-[#10B981] flex items-center pointer-events-none">
            <CheckCircle2 size={18} strokeWidth={2} />
          </div>
        )}
      </div>
      {error && <span className="text-[12px] text-red-500 mt-[6px] font-medium">{error}</span>}
      {helperText && isValid && !error && (
        <span className="text-[12px] text-[#10B981] mt-[6px] font-medium">{helperText}</span>
      )}
    </div>
  );
});
FormInput.displayName = 'FormInput';

export default FormInput;
