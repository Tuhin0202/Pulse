const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

code = code.replaceAll("status: 'pending'", "status: 'approved'");
fs.writeFileSync('src/components/DoctorDashboard.tsx', code);
