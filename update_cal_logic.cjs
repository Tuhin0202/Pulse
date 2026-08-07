const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

// Update initial state
code = code.replace(
  "status: 'pending'",
  "status: 'approved'"
);

// Update initial state for the other one? Let's check how many times 'pending' appears
