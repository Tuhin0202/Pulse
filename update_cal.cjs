const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

const oldLogic = `                         // Mock data logic based on date
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
                         }`;

const newLogic = `                         // Mock data logic based on date
                         let isRescheduled = false;
                         let isConfirmed = false;
                         let isPending = false;
                         
                         if (cellDate) {
                           // Example mock logic matching month
                           if (currentDate.getMonth() === 9 && currentDate.getFullYear() === 2023) {
                             if (cellDate === 11) isRescheduled = true;
                             if (cellDate === 2 || cellDate === 15) isConfirmed = true;
                             if (cellDate === 4 || cellDate === 11) isPending = true;
                             if (cellDate === 20) { isConfirmed = true; isPending = true; }
                           } else {
                             // Randomly populate a few dates for other months
                             if (cellDate === 5) isConfirmed = true;
                             if (cellDate === 12) isPending = true;
                           }
                           
                           // Dynamically check rescheduled appointments
                           const monthStr = monthNames[currentDate.getMonth()].substring(0, 3);
                           const cellDateStr = \`\${monthStr} \${cellDate}, \${currentDate.getFullYear()}\`;
                           if (rescheduledAppts.some(apt => apt.newDate === cellDateStr)) {
                             isRescheduled = true;
                           }
                         }`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/components/DoctorDashboard.tsx', code);
  console.log("Replaced logic.");
} else {
  console.log("Could not find logic!");
}
