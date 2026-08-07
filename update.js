const fs = require('fs');
let code = fs.readFileSync('src/components/DoctorDashboard.tsx', 'utf8');

// 1. Add ChevronLeft, ChevronRight to imports
code = code.replace(
  "LogOut, Settings } from 'lucide-react';",
  "LogOut, Settings, ChevronLeft, ChevronRight } from 'lucide-react';"
);

// 2. Add calendar state
const stateToAdd = `
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023 for demo
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
`;
code = code.replace(
  "  const [isEditingAbout, setIsEditingAbout] = useState(false);",
  stateToAdd + "\n  const [isEditingAbout, setIsEditingAbout] = useState(false);"
);

// 3. Update Status Legend colors
code = code.replace(
  /<div className="w-2.5 h-2.5 rounded-full bg-\[#005bb5\] mr-3" \/>\s*Confirmed/,
  '<div className="w-2.5 h-2.5 rounded-full bg-[#059669] mr-3" />\n                            Confirmed'
);
code = code.replace(
  /<div className="w-2.5 h-2.5 rounded-full bg-\[#059669\] mr-3" \/>\s*Pending/,
  '<div className="w-2.5 h-2.5 rounded-full bg-[#f97316] mr-3" />\n                            Pending'
);
code = code.replace(
  /<div className="w-2.5 h-2.5 rounded-full bg-\[#f97316\] mr-3" \/>\s*Rescheduled/,
  '<div className="w-2.5 h-2.5 rounded-full bg-[#005bb5] mr-3" />\n                            Rescheduled'
);

fs.writeFileSync('src/components/DoctorDashboard.tsx', code);
console.log('Update part 1 done');
