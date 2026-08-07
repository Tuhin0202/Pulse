const fs = require('fs');

const fileContent = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

const startIdx = fileContent.indexOf('{/* Calendar Area */}');
// find the end of the Calendar area div
const endMarker = '                </div>\n              </div>\n            </div>';
const endIdx = fileContent.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const originalCal = fileContent.substring(startIdx, endIdx);
    
    const newCalendar = `{/* Calendar Area */}
                <div className="flex-1 bg-white rounded-xl border border-outline-variant p-6 shadow-sm min-h-[600px] flex flex-col">
                   <div className="mb-6 flex items-end justify-between">
                      <div>
                        <h2 className="text-[20px] font-bold text-on-surface mb-1">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <p className="text-[14px] text-on-surface-variant">Manage and track medical appointments.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={handlePrevMonth} className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-lowest text-on-surface">
                          <ChevronLeft className="w-5 h-5 text-on-surface" />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-lowest text-on-surface">
                          <ChevronRight className="w-5 h-5 text-on-surface" />
                        </button>
                      </div>
                   </div>
                   <div className="flex-1 border border-outline-variant rounded-lg overflow-hidden flex flex-col">
                     <div className="grid grid-cols-7 bg-surface-container-lowest border-b border-outline-variant text-center">
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                         <div key={day} className="py-3 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{day}</div>
                       ))}
                     </div>
                     <div className="grid grid-cols-7 flex-1">
                       {Array.from({ length: 42 }).map((_, idx) => {
                         const date = idx - firstDay + 1;
                         const isCurrentMonth = date > 0 && date <= daysInMonth;
                         const cellDate = isCurrentMonth ? date : null;
                         const isSelected = selectedDate === cellDate;
                         
                         // Mock data logic based on date
                         let isRescheduled = false;
                         let isConfirmed = false;
                         let isPending = false;
                         
                         if (cellDate) {
                           // Example mock logic matching month
                           if (currentDate.getMonth() === 9 && currentDate.getFullYear() === 2023) {
                             if (cellDate === 3 || cellDate === 11) isRescheduled = true;
                             if (cellDate === 2 || cellDate === 15) isConfirmed = true;
                             if (cellDate === 4 || cellDate === 11) isPending = true;
                             if (cellDate === 20) { isConfirmed = true; isPending = true; }
                           } else {
                             // Randomly populate a few dates for other months
                             if (cellDate === 5) isConfirmed = true;
                             if (cellDate === 12) isPending = true;
                             if (cellDate === 18) isRescheduled = true;
                           }
                         }

                         const hasAppt = isRescheduled || isConfirmed || isPending;
                         const isColEnd = (idx + 1) % 7 === 0;
                         const isRowEnd = idx >= 35;
                         
                         return (
                           <div 
                             key={idx}
                             onClick={() => {
                               if (cellDate) {
                                 setSelectedDate(isSelected ? null : cellDate);
                               }
                             }}
                             className={\`p-2 min-h-[120px] bg-white \${hasAppt && isCurrentMonth ? 'cursor-pointer hover:bg-surface-container-lowest transition-colors' : ''} \${!isColEnd ? 'border-r' : ''} \${!isRowEnd ? 'border-b' : ''} border-outline-variant \${isSelected ? 'ring-2 ring-inset ring-[#005bb5] bg-[#eff6ff]' : ''}\`}
                           >
                             <span className={\`text-[14px] font-medium \${isCurrentMonth ? 'text-on-surface' : 'text-transparent'}\`}>
                               {cellDate || idx}
                             </span>
                             {isCurrentMonth && scheduleFilter === 'all' && (
                               <div className="mt-2 space-y-1.5 w-full px-1">
                                 {isConfirmed && <div className="w-full h-1.5 bg-[#059669] rounded-full"></div>}
                                 {isPending && <div className="w-full h-1.5 bg-[#f97316] rounded-full"></div>}
                                 {isRescheduled && <div className="w-full h-1.5 bg-[#005bb5] rounded-full"></div>}
                               </div>
                             )}
                             {isCurrentMonth && hasAppt && scheduleFilter === 'rescheduled' && (
                               <div className="mt-2 space-y-1.5 w-full px-1">
                                 {isRescheduled && <div className="w-full h-1.5 bg-[#005bb5] rounded-full"></div>}
                               </div>
                             )}
                             {isSelected && cellDate && hasAppt && (
                               <div className="mt-3 text-[11px] font-medium text-on-surface-variant flex flex-col gap-1 leading-tight">
                                 {isConfirmed && <div className="flex items-center"><span className="text-[#059669] mr-1.5 text-[14px]">•</span> 2 Confirmed</div>}
                                 {isPending && <div className="flex items-center"><span className="text-[#f97316] mr-1.5 text-[14px]">•</span> 1 Pending</div>}
                                 {isRescheduled && <div className="flex items-center"><span className="text-[#005bb5] mr-1.5 text-[14px]">•</span> 1 Rescheduled</div>}
                                 {hasAppt && (
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setIsScheduleDrawerOpen(true); }}
                                     className="mt-1 text-[#005bb5] hover:underline text-left text-[11px] font-bold"
                                   >
                                     View Details →
                                   </button>
                                 )}
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                </div>\n`;

    fs.writeFileSync('src/components/DoctorDashboard.tsx', fileContent.replace(originalCal, newCalendar));
    console.log("Calendar successfully replaced!");
} else {
    console.log("Start or end index not found", startIdx, endIdx);
}
