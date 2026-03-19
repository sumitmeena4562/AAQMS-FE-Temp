import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

const PageHeader = ({ 
  breadcrumbItems, 
  onReset, 
  onApplyFilters, 
  onAdd, 
  addButtonText = "Add New Org"
}) => {
  return (
    <div className="bg-[#F9FAFB] border-b border-gray-200 sticky top-0 z-20">
      
      <div className="w-full !px-8 !py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* 1. BREADCRUMB */}
        <div className="flex items-center h-[36px]">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 2. ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onReset}
            className="h-[36px] flex items-center gap-2 px-4 bg-white border border-gray-200 rounded-lg font-semibold text-[13px] text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button 
            onClick={onApplyFilters}
            className="h-[36px] flex items-center gap-2 px-4 bg-[#2563EB] border border-transparent rounded-lg font-semibold text-[13px] text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </button>
          
          <button 
            onClick={onAdd}
            className="h-[36px] flex items-center gap-2 px-4 bg-[#111827] border border-transparent rounded-lg font-semibold text-[13px] text-white hover:bg-gray-800 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {addButtonText}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PageHeader;

// import React from 'react';
// import Breadcrumb from '../Breadcrumb/Breadcrumb';

// const PageHeader = ({ 
//   breadcrumbItems, 
//   onReset, 
//   onApplyFilters, 
//   onAdd, 
//   addButtonText = "Add New Org"
// }) => {
//   return (
//     <div className="bg-[rgba(249,250,251,0.5)] backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
//       {/* EXACT Color & Opacity requested by you: rgba(249, 250, 251, 0.5) */}
      
//       {/* py-5 se header ko Figma jaisi height milegi, px-8 alignment set karega */}
//       <div className="w-full !px-8 !py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
//         {/* 1. BREADCRUMB */}
//         <div className="flex items-center h-[36px]">
//           <Breadcrumb items={breadcrumbItems} />
//         </div>

//         {/* 2. ACTION BUTTONS */}
//         <div className="flex flex-wrap items-center gap-3">
//           <button 
//             onClick={onReset}
//             className="h-[36px] flex items-center gap-2 px-4 bg-white border border-gray-200 rounded-lg font-semibold text-[13px] text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
//           >
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Reset
//           </button>
          
//           <button 
//             onClick={onApplyFilters}
//             className="h-[36px] flex items-center gap-2 px-4 bg-[#2563EB] border border-transparent rounded-lg font-semibold text-[13px] text-white hover:bg-blue-700 transition-colors shadow-sm"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//             </svg>
//             Apply Filters
//           </button>
          
//           <button 
//             onClick={onAdd}
//             className="h-[36px] flex items-center gap-2 px-4 bg-[#111827] border border-transparent rounded-lg font-semibold text-[13px] text-white hover:bg-gray-800 transition-colors shadow-sm"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//             </svg>
//             {addButtonText}
//           </button>
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default PageHeader;


// import React from 'react';
// import Breadcrumb from '../Breadcrumb/Breadcrumb';

// const PageHeader = ({ 
//   breadcrumbItems, 
//   onReset, 
//   onApplyFilters, 
//   onAdd, 
//   addButtonText = "Add New"
// }) => {
//   return (
//     <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//       {/* Solid white background with strict bottom border like Figma */}
//       <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-4">
        
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
//           {/* 1. BREADCRUMB */}
//           <div className="flex items-center h-[36px]">
//             <Breadcrumb items={breadcrumbItems} />
//           </div>

//           {/* 2. ACTION BUTTONS */}
//           <div className="flex flex-wrap items-center gap-3">
//             <button 
//               onClick={onReset}
//               className="h-[36px] flex items-center gap-2 px-4 bg-white border border-gray-200 rounded-lg font-semibold text-[13px] text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
//             >
//               <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Reset
//             </button>
            
//             <button 
//               onClick={onApplyFilters}
//               className="h-[36px] flex items-center gap-2 px-4 bg-[#2563EB] border border-transparent rounded-lg font-semibold text-[13px] text-white hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//               </svg>
//               Apply Filters
//             </button>
            
//             <button 
//               onClick={onAdd}
//               className="h-[36px] flex items-center gap-2 px-4 bg-[#111827] border border-transparent rounded-lg font-semibold text-[13px] text-white hover:bg-gray-800 transition-colors shadow-sm"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//               {addButtonText}
//             </button>
//           </div>
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PageHeader;