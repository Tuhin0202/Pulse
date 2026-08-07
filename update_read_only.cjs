const fs = require('fs');

let fileContent = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

const target1 = `                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            {isEditingVitals ? (
                              <input 
                                type="text" 
                                className="text-[20px] font-bold text-on-surface bg-white border border-outline-variant rounded px-2 py-1" 
                                value={patientVitals.name} 
                                onChange={(e) => setPatientVitals({...patientVitals, name: e.target.value})} 
                              />
                            ) : (
                              <h2 className="text-[20px] font-bold text-on-surface">{patientVitals.name}</h2>
                            )}
                            <span className="px-2 py-0.5 bg-[#f1f5f9] text-on-surface-variant text-[12px] font-medium rounded-md">#PT-88219</span>
                          </div>
                          <div className="text-[14px] text-on-surface-variant font-medium flex items-center gap-2 mt-2">
                            {isEditingVitals ? (
                              <>
                                <input type="text" className="bg-white border border-outline-variant rounded px-2 py-1 w-[80px]" value={patientVitals.age} onChange={(e) => setPatientVitals({...patientVitals, age: e.target.value})} /> • 
                                <input type="text" className="bg-white border border-outline-variant rounded px-2 py-1 w-[80px]" value={patientVitals.gender} onChange={(e) => setPatientVitals({...patientVitals, gender: e.target.value})} /> • 
                                <input type="text" className="bg-white border border-outline-variant rounded px-2 py-1 w-[100px]" value={patientVitals.bloodType} onChange={(e) => setPatientVitals({...patientVitals, bloodType: e.target.value})} />
                              </>
                            ) : (
                              <>{patientVitals.age} • {patientVitals.gender} • {patientVitals.bloodType}</>
                            )}
                          </div>
                        </div>`;

const replacement1 = `                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h2 className="text-[20px] font-bold text-on-surface">{patientVitals.name}</h2>
                            <span className="px-2 py-0.5 bg-[#f1f5f9] text-on-surface-variant text-[12px] font-medium rounded-md">#PT-88219</span>
                          </div>
                          <div className="text-[14px] text-on-surface-variant font-medium flex items-center gap-2 mt-2">
                            <>{patientVitals.age} • {patientVitals.gender} • {patientVitals.bloodType}</>
                          </div>
                        </div>`;

const target2 = `                        <div className="text-right">
                          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">CONTACT</div>
                          {isEditingVitals ? (
                            <input 
                              type="text" 
                              className="text-[14px] text-on-surface font-medium bg-white border border-outline-variant rounded px-2 py-1 w-[140px]" 
                              value={patientVitals.contact} 
                              onChange={(e) => setPatientVitals({...patientVitals, contact: e.target.value})} 
                            />
                          ) : (
                            <div className="text-[14px] text-on-surface font-medium">{patientVitals.contact}</div>
                          )}
                        </div>`;

const replacement2 = `                        <div className="text-right">
                          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">CONTACT</div>
                          <div className="text-[14px] text-on-surface font-medium">{patientVitals.contact}</div>
                        </div>`;

if (fileContent.includes(target1) && fileContent.includes(target2)) {
  fileContent = fileContent.replace(target1, replacement1);
  fileContent = fileContent.replace(target2, replacement2);
  fs.writeFileSync('src/components/DoctorDashboard.tsx', fileContent);
  console.log("Success");
} else {
  console.log("Failed to find targets");
}
