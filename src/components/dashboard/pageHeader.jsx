// //

// import React from 'react';

// const PageHeader = ({ title, subtitle, rightContent }) => {
//     return (
//         <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-gray-200">
//             {/* Left Side */}
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                     {title}
//                 </h1>
//                 {subtitle && (
//                     <p className="text-sm text-gray-500 mt-1">
//                         {subtitle}
//                     </p>
//                 )}
//             </div>

//             {/* Right Side */}
//             {rightContent && (
//                 <div className="mt-3 sm:mt-1">
//                     {rightContent}
//                 </div>
//             )}
//         </header>
//     );
// };

// export default PageHeader;

import React from 'react';

const PageHeader = ({ title, subtitle, rightContent }) => {
    return (
        <header className="flex flex-row items-center justify-between w-full !pb-2 mb-6 border-b border-gray-200">

            {/* Left Side */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-gray-500 leading-none">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right Side */}
            {rightContent && (
                <div className="shrink-0">
                    {rightContent}
                </div>
            )}
        </header>
    );
};

export default PageHeader;