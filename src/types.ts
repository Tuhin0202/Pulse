export interface PatientData {
  fullName: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender?: string;
  address: string;
  phone: string;
  email: string;
  bloodPressure?: string;
  heartRate?: string;
  height?: string;
  weight?: string;
}

export interface DoctorData {
  fullName: string;
  qualification: string;
  specialization: string;
  experience: string;
  clinicName: string;
  city: string;
  contactInfo: string;
  address: string;
  licenseNumber?: string;
  licenseFileUrl?: string;
  licenseFileName?: string;
  licenseStatus?: 'Verified' | 'Pending Verification' | 'Not Uploaded';
}
