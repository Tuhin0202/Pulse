const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

const drawerOriginal = `               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  {rescheduledAppts.map((apt, index) => (
                    <div key={index} className={\`border rounded-xl p-5 relative overflow-hidden bg-white shadow-sm \${apt.status === 'approved' ? 'border-[#bfdbfe]' : 'border-[#fed7aa]'}\`}>
                       <div className={\`absolute top-0 right-0 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center \${apt.status === 'approved' ? 'bg-[#005bb5]' : 'bg-[#f97316]'}\`}>
                          {apt.status === 'approved' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                       </div>
                       
                       <div className="flex items-start space-x-4 mb-5 mt-2">
                          <div className={\`w-12 h-12 rounded-full flex items-center justify-center shrink-0 \${apt.status === 'approved' ? 'bg-[#eff6ff]' : 'bg-[#ffedd5]'}\`}>
                             <User className={\`w-6 h-6 \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#f97316]'}\`} />
                          </div>
                          <div>
                             <div className={\`text-[12px] font-medium mb-0.5 \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#f97316]'}\`}>{apt.id}</div>
                             <h3 className="text-[16px] font-bold text-on-surface leading-tight">{apt.name}</h3>
                             <p className="text-[13px] text-on-surface-variant">{apt.type}</p>
                          </div>
                       </div>
                       
                       <div className={\`rounded-lg p-3 flex justify-between items-center border \${apt.status === 'approved' ? 'bg-[#f8fafc] border-outline-variant' : 'bg-[#fff7ed] border-[#ffedd5]'}\`}>
                          <div>
                             <div className="text-[11px] font-medium text-on-surface-variant mb-0.5">Original Schedule</div>
                             <div className="text-[13px] text-on-surface-variant line-through">{apt.oldDate}</div>
                          </div>
                          <div className={\`w-[1px] h-8 \${apt.status === 'approved' ? 'bg-outline-variant' : 'bg-[#fed7aa]'}\`} />
                          <div>
                             <div className={\`text-[11px] font-bold mb-0.5 \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#ea580c]'}\`}>New Schedule</div>
                             <div className={\`text-[13px] font-bold \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#c2410c]'}\`}>{apt.newDate}, {apt.time}</div>
                          </div>
                       </div>
                       
                       {apt.status === 'pending' && (
                         <div className="flex gap-3 mt-5">
                            <button 
                              onClick={() => {
                                const newAppts = [...rescheduledAppts];
                                newAppts[index].status = 'approved';
                                setRescheduledAppts(newAppts);
                              }}
                              className="flex-1 py-2 bg-[#005bb5] text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                               Accept Change
                            </button>
                            <button 
                              onClick={() => {
                                const newAppts = [...rescheduledAppts];
                                newAppts[index].status = 'declined';
                                setRescheduledAppts(newAppts);
                              }}
                              className="flex-1 py-2 bg-white border border-outline-variant text-on-surface text-[14px] font-bold rounded-lg hover:bg-surface-container-lowest transition-colors"
                            >
                               Decline
                            </button>
                         </div>
                       )}
                    </div>
                  )).filter(apt => apt.status !== 'declined')}
                  
                  {scheduleFilter === 'all' && (
                    <>
                      {/* Card 2: Confirmed */}
                      <div className="border border-outline-variant rounded-xl p-5 relative shadow-sm">
                         <div className="absolute top-4 right-4 bg-[#eff6ff] text-[#005bb5] text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Confirmed
                         </div>
                         
                         <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#005bb5] flex items-center justify-center shrink-0">
                               <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="pr-16">
                               <div className="text-[12px] font-medium text-[#005bb5] mb-0.5">#PT-09882</div>
                               <h3 className="text-[16px] font-bold text-on-surface leading-tight">Sarah Mitchell</h3>
                               <p className="text-[13px] text-on-surface-variant mt-0.5 line-clamp-2">Follow-up: Routine Lab Review</p>
                            </div>
                         </div>
                         
                         <div className="w-full h-[1px] bg-outline-variant mb-4" />
                         
                         <div className="flex items-center space-x-6 text-[13px] text-on-surface-variant">
                            <div className="flex items-center">
                               <Clock className="w-4 h-4 mr-2 text-on-surface-variant" />
                               02:45 PM
                            </div>
                            <div className="flex items-center">
                               <MapPin className="w-4 h-4 mr-2 text-on-surface-variant" />
                               Room 402, North Wing
                            </div>
                         </div>
                      </div>

                      {/* Card 3: Pending */}
                      <div className="border border-outline-variant rounded-xl p-5 relative shadow-sm">
                         <div className="absolute top-4 right-4 bg-[#f1f5f9] text-[#475569] text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Pending
                         </div>
                         
                         <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-[#64748b] flex items-center justify-center shrink-0">
                               <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                               <div className="text-[12px] font-medium text-on-surface-variant mb-0.5">#PT-44211</div>
                               <h3 className="text-[16px] font-bold text-on-surface leading-tight">Marcus Thorne</h3>
                               <p className="text-[13px] text-on-surface-variant mt-0.5">Dermatology Intake</p>
                            </div>
                         </div>
                      </div>
                    </>
                  )}
               </div>`;

const newDrawer = `               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  {rescheduledAppts.map((apt, index) => (
                    <div key={index} className={\`border rounded-xl p-5 relative overflow-hidden bg-white shadow-sm \${apt.status === 'approved' ? 'border-[#bfdbfe]' : 'border-[#fed7aa]'}\`}>
                       <div className={\`absolute top-0 right-0 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center \${apt.status === 'approved' ? 'bg-[#005bb5]' : 'bg-[#f97316]'}\`}>
                          {apt.status === 'approved' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Rescheduled
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                       </div>
                       
                       <div className="flex items-start space-x-4 mb-5 mt-2">
                          <div className={\`w-12 h-12 rounded-full flex items-center justify-center shrink-0 \${apt.status === 'approved' ? 'bg-[#eff6ff]' : 'bg-[#ffedd5]'}\`}>
                             <User className={\`w-6 h-6 \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#f97316]'}\`} />
                          </div>
                          <div>
                             <div className={\`text-[12px] font-medium mb-0.5 \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#f97316]'}\`}>{apt.id}</div>
                             <h3 className="text-[16px] font-bold text-on-surface leading-tight">{apt.name}</h3>
                             <p className="text-[13px] text-on-surface-variant">{apt.type}</p>
                          </div>
                       </div>
                       
                       <div className={\`rounded-lg p-3 flex justify-between items-center border \${apt.status === 'approved' ? 'bg-[#f8fafc] border-outline-variant' : 'bg-[#fff7ed] border-[#ffedd5]'}\`}>
                          <div>
                             <div className="text-[11px] font-medium text-on-surface-variant mb-0.5">Original Schedule</div>
                             <div className="text-[13px] text-on-surface-variant line-through">{apt.oldDate}</div>
                          </div>
                          <div className={\`w-[1px] h-8 \${apt.status === 'approved' ? 'bg-outline-variant' : 'bg-[#fed7aa]'}\`} />
                          <div>
                             <div className={\`text-[11px] font-bold mb-0.5 \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#ea580c]'}\`}>New Schedule</div>
                             <div className={\`text-[13px] font-bold \${apt.status === 'approved' ? 'text-[#005bb5]' : 'text-[#c2410c]'}\`}>{apt.newDate}, {apt.time}</div>
                          </div>
                       </div>
                       
                       {apt.status === 'pending' && (
                         <div className="flex gap-3 mt-5">
                            <button 
                              onClick={() => {
                                const newAppts = [...rescheduledAppts];
                                newAppts[index].status = 'approved';
                                setRescheduledAppts(newAppts);
                              }}
                              className="flex-1 py-2 bg-[#005bb5] text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                               Accept Change
                            </button>
                            <button 
                              onClick={() => {
                                const newAppts = [...rescheduledAppts];
                                newAppts[index].status = 'declined';
                                setRescheduledAppts(newAppts);
                              }}
                              className="flex-1 py-2 bg-white border border-outline-variant text-on-surface text-[14px] font-bold rounded-lg hover:bg-surface-container-lowest transition-colors"
                            >
                               Decline
                            </button>
                         </div>
                       )}
                    </div>
                  )).filter(apt => apt.status !== 'declined')}
                  
                  {scheduleFilter === 'all' && (
                    <>
                      {/* Card 2: Confirmed */}
                      <div className="border border-outline-variant rounded-xl p-5 relative shadow-sm">
                         <div className="absolute top-4 right-4 bg-[#ecfdf5] text-[#059669] text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Confirmed
                         </div>
                         
                         <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center shrink-0">
                               <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="pr-16">
                               <div className="text-[12px] font-medium text-[#059669] mb-0.5">#PT-09882</div>
                               <h3 className="text-[16px] font-bold text-on-surface leading-tight">Sarah Mitchell</h3>
                               <p className="text-[13px] text-on-surface-variant mt-0.5 line-clamp-2">Follow-up: Routine Lab Review</p>
                            </div>
                         </div>
                         
                         <div className="w-full h-[1px] bg-outline-variant mb-4" />
                         
                         <div className="flex items-center space-x-6 text-[13px] text-on-surface-variant">
                            <div className="flex items-center">
                               <Clock className="w-4 h-4 mr-2 text-on-surface-variant" />
                               02:45 PM
                            </div>
                            <div className="flex items-center">
                               <MapPin className="w-4 h-4 mr-2 text-on-surface-variant" />
                               Room 402, North Wing
                            </div>
                         </div>
                      </div>

                      {/* Card 3: Pending */}
                      <div className="border border-outline-variant rounded-xl p-5 relative shadow-sm">
                         <div className="absolute top-4 right-4 bg-[#fff7ed] text-[#ea580c] text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Pending
                         </div>
                         
                         <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-[#ea580c] flex items-center justify-center shrink-0">
                               <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                               <div className="text-[12px] font-medium text-[#ea580c] mb-0.5">#PT-44211</div>
                               <h3 className="text-[16px] font-bold text-on-surface leading-tight">Marcus Thorne</h3>
                               <p className="text-[13px] text-on-surface-variant mt-0.5">Dermatology Intake</p>
                            </div>
                         </div>
                      </div>
                    </>
                  )}
               </div>`;

if (!code.includes(drawerOriginal)) {
  console.log("Could not find drawer code!");
} else {
  code = code.replace(drawerOriginal, newDrawer);
  fs.writeFileSync('src/components/DoctorDashboard.tsx', code);
  console.log('Drawer updated.');
}
