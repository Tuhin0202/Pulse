const fs = require('fs');

let fileContent = fs.readFileSync('src/components/PatientDashboard.tsx', 'utf8');

const target = `        {activeTab === 'Dashboard' ? (
          <div className="space-y-6">`;

const replacement = `        {activeTab === 'Appointments' ? (
          <div className="space-y-6">
            <h1 className="text-[24px] font-bold text-on-surface">Appointments</h1>
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <p className="text-on-surface-variant">Your upcoming appointments will appear here.</p>
            </div>
          </div>
        ) : activeTab === 'Prescription' ? (
          <div className="space-y-6">
            <h1 className="text-[24px] font-bold text-on-surface">Prescription</h1>
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <p className="text-on-surface-variant">Your prescriptions and medical history will appear here.</p>
            </div>
          </div>
        ) : activeTab === 'Health Assistant' ? (
          <div className="space-y-6">
            <h1 className="text-[24px] font-bold text-on-surface">Health Assistant</h1>
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <p className="text-on-surface-variant">AI-powered health assistant features will appear here.</p>
            </div>
          </div>
        ) : activeTab === 'Dashboard' ? (
          <div className="space-y-6">`;

if (fileContent.includes(target)) {
  fileContent = fileContent.replace(target, replacement);
  fs.writeFileSync('src/components/PatientDashboard.tsx', fileContent);
  console.log("Success");
} else {
  console.log("Failed to find target");
}
