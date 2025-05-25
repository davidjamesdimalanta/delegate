// Sample patient data with random US addresses for testing
export const SAMPLE_PATIENTS = [
  {
    id: 'MRN-12345',
    name: 'Sarah Johnson',
    priority: 'high',
    address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
    coordinates: {
      latitude: 38.8977,
      longitude: -77.0365
    },
    vitals: 'Last vitals: 98.6°F, 120/80 mmHg, 72 bpm',
    age: 45,
    condition: 'Hypertension monitoring',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22 2:30 PM'
  },
  {
    id: 'MRN-67890',
    name: 'Michael Chen',
    priority: 'medium',
    address: '1 Apple Park Way, Cupertino, CA 95014',
    coordinates: {
      latitude: 37.3349,
      longitude: -122.0090
    },
    vitals: 'Scheduled for medication review at 2:00 PM',
    age: 62,
    condition: 'Diabetes Type 2',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-18 2:00 PM'
  },
  {
    id: 'MRN-24680',
    name: 'Emily Rodriguez',
    priority: 'critical',
    address: '350 5th Ave, New York, NY 10118',
    coordinates: {
      latitude: 40.7484,
      longitude: -73.9857
    },
    vitals: 'Blood pressure check needed - hypertension monitoring',
    age: 38,
    condition: 'Acute hypertension',
    lastVisit: '2024-01-16',
    nextAppointment: '2024-01-17 10:00 AM'
  },
  {
    id: 'MRN-13579',
    name: 'David Thompson',
    priority: 'low',
    address: '233 S Wacker Dr, Chicago, IL 60606',
    coordinates: {
      latitude: 41.8781,
      longitude: -87.6298
    },
    vitals: 'Post-surgical follow-up scheduled',
    age: 54,
    condition: 'Post-operative care',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-25 11:00 AM'
  },
  {
    id: 'MRN-97531',
    name: 'Lisa Wang',
    priority: 'medium',
    address: '1901 N Moore St, Arlington, VA 22209',
    coordinates: {
      latitude: 38.8951,
      longitude: -77.0727
    },
    vitals: 'Diabetes management consultation',
    age: 51,
    condition: 'Diabetes management',
    lastVisit: '2024-01-14',
    nextAppointment: '2024-01-21 3:00 PM'
  },
  {
    id: 'MRN-86420',
    name: 'Robert Martinez',
    priority: 'high',
    address: '1 Hacker Way, Menlo Park, CA 94025',
    coordinates: {
      latitude: 37.4845,
      longitude: -122.1477
    },
    vitals: 'Cardiac rehabilitation program enrollment',
    age: 58,
    condition: 'Cardiac rehabilitation',
    lastVisit: '2024-01-13',
    nextAppointment: '2024-01-20 9:00 AM'
  }
]; 