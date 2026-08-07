const fs = require('fs');

let fileContent = fs.readFileSync('src/components/PatientDashboard.tsx', 'utf8');

// Insert states and mock data
const hookTarget = `  const navItems = ['Appointments', 'Prescription', 'Health Assistant', 'Dashboard'];`;
const hookReplacement = `  const navItems = ['Appointments', 'Prescription', 'Health Assistant', 'Dashboard'];

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const mockDoctors = [
    { id: 1, name: 'Dr. Sarah Jenkins', category: 'Cardiology', city: 'San Francisco', rating: 4.9, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=faces', experience: '15 years' },
    { id: 2, name: 'Dr. Michael Chen', category: 'Orthopedics', city: 'New York', rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces', experience: '12 years' },
    { id: 3, name: 'Dr. Emily Rodriguez', category: 'Pediatrics', city: 'San Francisco', rating: 4.7, image: 'https://images.unsplash.com/photo-1594824436951-7f12689c1682?w=150&h=150&fit=crop&crop=faces', experience: '8 years' },
    { id: 4, name: 'Dr. James Wilson', category: 'Dermatology', city: 'Chicago', rating: 4.9, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=faces', experience: '20 years' },
    { id: 5, name: 'Dr. Olivia Martinez', category: 'General Practice', city: 'Los Angeles', rating: 4.6, image: 'https://images.unsplash.com/photo-1594824436951-7f12689c1682?w=150&h=150&fit=crop&crop=faces', experience: '10 years' },
    { id: 6, name: 'Dr. William Brown', category: 'Cardiology', city: 'New York', rating: 4.8, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=faces', experience: '18 years' }
  ];

  const filteredDoctors = mockDoctors.filter(doc => {
    return (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (cityFilter === '' || doc.city === cityFilter) &&
      (categoryFilter === '' || doc.category === categoryFilter)
    );
  });
`;

if (fileContent.includes(hookTarget)) {
  fileContent = fileContent.replace(hookTarget, hookReplacement);
} else {
  console.log('Hook target not found');
}

const renderTarget = `        {activeTab === 'Appointments' ? (
          <div className="space-y-6">
            <h1 className="text-[24px] font-bold text-on-surface">Appointments</h1>
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <p className="text-on-surface-variant">Your upcoming appointments will appear here.</p>
            </div>
          </div>
        ) : activeTab === 'Prescription' ? (`;
        
const renderReplacement = `        {activeTab === 'Appointments' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-[24px] font-bold text-on-surface">Book an Appointment</h1>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant p-4 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-md leading-5 bg-white placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] sm:text-sm"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 text-base border border-outline-variant focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] sm:text-sm rounded-md appearance-none"
                  >
                    <option value="">All Cities</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Los Angeles">Los Angeles</option>
                  </select>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 text-base border border-outline-variant focus:outline-none focus:ring-1 focus:ring-[#005bb5] focus:border-[#005bb5] sm:text-sm rounded-md appearance-none"
                  >
                    <option value="">All Categories</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Practice">General Practice</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start space-x-4 mb-4">
                      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border border-outline-variant" />
                      <div>
                        <h3 className="text-[16px] font-bold text-on-surface">{doctor.name}</h3>
                        <p className="text-[13px] text-[#005bb5] font-medium">{doctor.category}</p>
                        <div className="flex items-center mt-1 text-[12px] text-on-surface-variant">
                          <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400 mr-1" />
                          <span>{doctor.rating} Rating</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-5 text-[12px] text-on-surface-variant border-y border-outline-variant py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">Experience</span>
                        <span>{doctor.experience}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">Location</span>
                        <span>{doctor.city}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button className="px-3 py-2 border border-[#005bb5] text-[#005bb5] rounded-md text-[13px] font-bold hover:bg-[#eff6ff] transition-colors">
                        View Profile
                      </button>
                      <button className="px-3 py-2 bg-[#005bb5] text-white rounded-md text-[13px] font-bold hover:bg-primary/90 transition-colors">
                        Book Appt
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl border border-outline-variant p-8 text-center">
                  <p className="text-on-surface-variant">No doctors found matching your criteria.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setCityFilter(''); setCategoryFilter(''); }}
                    className="mt-4 px-4 py-2 bg-[#f1f5f9] text-on-surface rounded-md text-[14px] font-medium hover:bg-[#e2e8f0] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'Prescription' ? (`;

if (fileContent.includes(renderTarget)) {
  fileContent = fileContent.replace(renderTarget, renderReplacement);
  fs.writeFileSync('src/components/PatientDashboard.tsx', fileContent);
  console.log("Success");
} else {
  console.log("Render target not found");
}
