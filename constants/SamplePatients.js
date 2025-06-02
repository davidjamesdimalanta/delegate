// Sample patient data with palliative care enhancements for testing
export const SAMPLE_PATIENTS = [
  {
    id: 'MRN-12345',
    name: 'Sarah Johnson',
    priority: 'urgent-comfort',
    address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
    coordinates: {
      latitude: 38.8977,
      longitude: -77.0365
    },
    vitals: 'Last vitals: 98.6°F, 120/80 mmHg, 72 bpm',
    age: 45,
    condition: 'Advanced breast cancer with bone metastases',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22 2:30 PM',
    lastSeenBy: {
      provider: 'Sarah Mitchell',
      discipline: 'MD',
      date: '2024-01-15',
      time: '14:30'
    },
    palliativeCare: {
      prognosis: '6-12 months',
      goalsOfCare: 'comfort-focused',
      advanceDirectives: {
        dnr: true,
        dni: true,
        molst: true,
        polst: false,
        lastUpdated: '2024-01-10'
      },
      preferredPlaceOfCare: 'home',
      preferredPlaceOfDeath: 'home',
      spiritualNeeds: {
        religion: 'Christian',
        chaplainVisits: true,
        spiritualConcerns: 'Fear about family coping'
      },
      culturalConsiderations: {
        language: 'English',
        interpreter: false,
        culturalPractices: 'Traditional Christian funeral preferences'
      },
      painManagement: {
        currentPainLevel: 6,
        targetPainLevel: 3,
        medications: ['Morphine 15mg q4h', 'Lorazepam 0.5mg PRN'],
        lastPainAssessment: '2024-01-15 14:30'
      }
    },
    family: {
      primaryCaregiver: {
        name: 'Michael Johnson',
        relationship: 'Husband',
        phone: '(555) 123-4567',
        email: 'mjohnson@email.com',
        address: 'Same as patient'
      },
      emergencyContacts: [
        {
          name: 'Emily Johnson',
          relationship: 'Daughter',
          phone: '(555) 987-6543',
          isPrimary: true
        },
        {
          name: 'Robert Johnson',
          relationship: 'Son',
          phone: '(555) 456-7890',
          isPrimary: false
        }
      ],
      familyDynamics: 'Close-knit family, very supportive. Husband is primary caregiver but struggling with stress.',
      grief: 'anticipatory',
      caregiverBurden: 'moderate',
      familyMeetingDate: '2024-01-20'
    },
    symptoms: {
      current: ['pain', 'fatigue', 'nausea', 'anxiety'],
      painScale: 6,
      fatigueLevel: 8,
      appetiteLevel: 3,
      lastAssessment: '2024-01-15',
      esasScore: {
        pain: 6,
        tiredness: 8,
        nausea: 4,
        depression: 5,
        anxiety: 7,
        drowsiness: 3,
        appetite: 3,
        wellbeing: 4,
        shortnessOfBreath: 2,
        lastUpdated: '2024-01-15'
      }
    }
  },
  {
    id: 'MRN-67890',
    name: 'Michael Chen',
    priority: 'symptom-care',
    address: '1 Apple Park Way, Cupertino, CA 95014',
    coordinates: {
      latitude: 37.3349,
      longitude: -122.0090
    },
    vitals: 'Scheduled for medication review at 2:00 PM',
    age: 62,
    condition: 'End-stage COPD with pulmonary hypertension',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-18 2:00 PM',
    lastSeenBy: {
      provider: 'Maria Rodriguez',
      discipline: 'RN',
      date: '2024-01-10',
      time: '09:15'
    },
    palliativeCare: {
      prognosis: '3-6 months',
      goalsOfCare: 'comfort with limited interventions',
      advanceDirectives: {
        dnr: true,
        dni: false,
        molst: true,
        polst: true,
        lastUpdated: '2024-01-05'
      },
      preferredPlaceOfCare: 'home with hospice support',
      preferredPlaceOfDeath: 'home',
      spiritualNeeds: {
        religion: 'Buddhist',
        chaplainVisits: false,
        spiritualConcerns: 'Meditation and peace practices'
      },
      culturalConsiderations: {
        language: 'English/Mandarin',
        interpreter: true,
        culturalPractices: 'Traditional Chinese medicine preferences'
      },
      painManagement: {
        currentPainLevel: 3,
        targetPainLevel: 2,
        medications: ['Oxycodone 5mg q6h PRN', 'Albuterol inhaler'],
        lastPainAssessment: '2024-01-10 09:15'
      }
    },
    family: {
      primaryCaregiver: {
        name: 'Lisa Chen',
        relationship: 'Wife',
        phone: '(408) 555-0123',
        email: 'lchen@email.com',
        address: 'Same as patient'
      },
      emergencyContacts: [
        {
          name: 'David Chen',
          relationship: 'Son',
          phone: '(415) 555-0987',
          isPrimary: true
        }
      ],
      familyDynamics: 'Wife is devoted caregiver. Son lives nearby and helps with medical appointments.',
      grief: 'anticipatory',
      caregiverBurden: 'high',
      familyMeetingDate: '2024-01-16'
    },
    symptoms: {
      current: ['dyspnea', 'fatigue', 'anxiety'],
      painScale: 3,
      fatigueLevel: 7,
      appetiteLevel: 6,
      lastAssessment: '2024-01-10',
      esasScore: {
        pain: 3,
        tiredness: 7,
        nausea: 1,
        depression: 4,
        anxiety: 6,
        drowsiness: 2,
        appetite: 6,
        wellbeing: 5,
        shortnessOfBreath: 8,
        lastUpdated: '2024-01-10'
      }
    }
  },
  {
    id: 'MRN-24680',
    name: 'Emily Rodriguez',
    priority: 'imminent',
    address: '350 5th Ave, New York, NY 10118',
    coordinates: {
      latitude: 40.7484,
      longitude: -73.9857
    },
    vitals: 'Comfort care measures - family present',
    age: 38,
    condition: 'End-stage pancreatic cancer',
    lastVisit: '2024-01-16',
    nextAppointment: 'Continuous care',
    lastSeenBy: {
      provider: 'Jennifer Kim',
      discipline: 'MD',
      date: '2024-01-16',
      time: '18:00'
    },
    palliativeCare: {
      prognosis: 'hours to days',
      goalsOfCare: 'comfort only',
      advanceDirectives: {
        dnr: true,
        dni: true,
        molst: true,
        polst: true,
        lastUpdated: '2024-01-14'
      },
      preferredPlaceOfCare: 'home',
      preferredPlaceOfDeath: 'home',
      spiritualNeeds: {
        religion: 'Catholic',
        chaplainVisits: true,
        spiritualConcerns: 'Last rites, family blessing'
      },
      culturalConsiderations: {
        language: 'Spanish/English',
        interpreter: true,
        culturalPractices: 'Traditional Hispanic/Catholic end-of-life customs'
      },
      painManagement: {
        currentPainLevel: 8,
        targetPainLevel: 4,
        medications: ['Morphine drip 2mg/hr', 'Ativan 1mg q2h PRN', 'Scopolamine patch'],
        lastPainAssessment: '2024-01-16 18:00'
      }
    },
    family: {
      primaryCaregiver: {
        name: 'Carlos Rodriguez',
        relationship: 'Husband',
        phone: '(212) 555-0456',
        email: 'crodriguez@email.com',
        address: 'Same as patient'
      },
      emergencyContacts: [
        {
          name: 'Maria Rodriguez',
          relationship: 'Mother',
          phone: '(212) 555-0789',
          isPrimary: true
        },
        {
          name: 'Sofia Rodriguez',
          relationship: 'Sister',
          phone: '(718) 555-0321',
          isPrimary: true
        }
      ],
      familyDynamics: 'Large extended family very involved. Cultural importance of family presence at end of life.',
      grief: 'acute',
      caregiverBurden: 'severe',
      familyMeetingDate: '2024-01-16'
    },
    symptoms: {
      current: ['severe-pain', 'dyspnea', 'agitation', 'nausea'],
      painScale: 8,
      fatigueLevel: 9,
      appetiteLevel: 0,
      lastAssessment: '2024-01-16',
      esasScore: {
        pain: 8,
        tiredness: 9,
        nausea: 7,
        depression: 6,
        anxiety: 8,
        drowsiness: 7,
        appetite: 0,
        wellbeing: 2,
        shortnessOfBreath: 8,
        lastUpdated: '2024-01-16'
      }
    }
  },
  {
    id: 'MRN-13579',
    name: 'David Thompson',
    priority: 'family-support',
    address: '233 S Wacker Dr, Chicago, IL 60606',
    coordinates: {
      latitude: 41.8781,
      longitude: -87.6298
    },
    vitals: 'Stable on current regimen',
    age: 54,
    condition: 'ALS (Amyotrophic Lateral Sclerosis)',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-25 11:00 AM',
    lastSeenBy: {
      provider: 'Amanda Foster',
      discipline: 'MSW',
      date: '2024-01-12',
      time: '11:30'
    },
    palliativeCare: {
      prognosis: '12-18 months',
      goalsOfCare: 'maintain quality of life and function',
      advanceDirectives: {
        dnr: false,
        dni: false,
        molst: true,
        polst: false,
        lastUpdated: '2024-01-01'
      },
      preferredPlaceOfCare: 'home with family',
      preferredPlaceOfDeath: 'to be determined',
      spiritualNeeds: {
        religion: 'Agnostic',
        chaplainVisits: false,
        spiritualConcerns: 'Legacy planning for children'
      },
      culturalConsiderations: {
        language: 'English',
        interpreter: false,
        culturalPractices: 'Modern American, values independence'
      },
      painManagement: {
        currentPainLevel: 2,
        targetPainLevel: 2,
        medications: ['Baclofen 10mg TID', 'Gabapentin 300mg BID'],
        lastPainAssessment: '2024-01-12 11:30'
      }
    },
    family: {
      primaryCaregiver: {
        name: 'Jennifer Thompson',
        relationship: 'Wife',
        phone: '(312) 555-0147',
        email: 'jthompson@email.com',
        address: 'Same as patient'
      },
      emergencyContacts: [
        {
          name: 'Sarah Thompson',
          relationship: 'Daughter',
          phone: '(312) 555-0258',
          isPrimary: true
        },
        {
          name: 'Mike Thompson',
          relationship: 'Son',
          phone: '(312) 555-0369',
          isPrimary: true
        }
      ],
      familyDynamics: 'Strong family unit. Wife struggling with caregiver role. Children (16 and 14) need support.',
      grief: 'anticipatory',
      caregiverBurden: 'moderate-high',
      familyMeetingDate: '2024-01-22'
    },
    symptoms: {
      current: ['weakness', 'speech-difficulty', 'swallowing-difficulty'],
      painScale: 2,
      fatigueLevel: 6,
      appetiteLevel: 7,
      lastAssessment: '2024-01-12',
      esasScore: {
        pain: 2,
        tiredness: 6,
        nausea: 1,
        depression: 5,
        anxiety: 6,
        drowsiness: 3,
        appetite: 7,
        wellbeing: 6,
        shortnessOfBreath: 3,
        lastUpdated: '2024-01-12'
      }
    }
  },
  {
    id: 'MRN-97531',
    name: 'Lisa Wang',
    priority: 'psychosocial',
    address: '1901 N Moore St, Arlington, VA 22209',
    coordinates: {
      latitude: 38.8951,
      longitude: -77.0727
    },
    vitals: 'Stable - focus on emotional support',
    age: 51,
    condition: 'Metastatic ovarian cancer',
    lastVisit: '2024-01-14',
    nextAppointment: '2024-01-21 3:00 PM',
    lastSeenBy: {
      provider: 'Catherine Lee',
      discipline: 'SC',
      date: '2024-01-14',
      time: '15:45'
    },
    palliativeCare: {
      prognosis: '18-24 months',
      goalsOfCare: 'balance treatment and quality of life',
      advanceDirectives: {
        dnr: false,
        dni: false,
        molst: false,
        polst: false,
        lastUpdated: null
      },
      preferredPlaceOfCare: 'home when possible',
      preferredPlaceOfDeath: 'undecided',
      spiritualNeeds: {
        religion: 'None specified',
        chaplainVisits: false,
        spiritualConcerns: 'Finding meaning and peace'
      },
      culturalConsiderations: {
        language: 'English/Mandarin',
        interpreter: false,
        culturalPractices: 'Values family harmony and respect for elders'
      },
      painManagement: {
        currentPainLevel: 4,
        targetPainLevel: 3,
        medications: ['Hydrocodone 5mg q6h PRN', 'Ibuprofen 400mg TID'],
        lastPainAssessment: '2024-01-14 15:45'
      }
    },
    family: {
      primaryCaregiver: {
        name: 'James Wang',
        relationship: 'Husband',
        phone: '(703) 555-0852',
        email: 'jwang@email.com',
        address: 'Same as patient'
      },
      emergencyContacts: [
        {
          name: 'Helen Wang',
          relationship: 'Mother-in-law',
          phone: '(703) 555-0963',
          isPrimary: true
        }
      ],
      familyDynamics: 'Patient feels burden on family. Needs emotional support and counseling.',
      grief: 'anticipatory',
      caregiverBurden: 'low-moderate',
      familyMeetingDate: '2024-01-19'
    },
    symptoms: {
      current: ['anxiety', 'depression', 'mild-pain', 'insomnia'],
      painScale: 4,
      fatigueLevel: 5,
      appetiteLevel: 6,
      lastAssessment: '2024-01-14',
      esasScore: {
        pain: 4,
        tiredness: 5,
        nausea: 2,
        depression: 7,
        anxiety: 8,
        drowsiness: 2,
        appetite: 6,
        wellbeing: 4,
        shortnessOfBreath: 1,
        lastUpdated: '2024-01-14'
      }
    }
  },
  {
    id: 'MRN-86420',
    name: 'Robert Martinez',
    priority: 'bereavement',
    address: '1 Hacker Way, Menlo Park, CA 94025',
    coordinates: {
      latitude: 37.4845,
      longitude: -122.1477
    },
    vitals: 'N/A - Family bereavement support',
    age: null, // Deceased
    condition: 'Deceased - Lung cancer (family follow-up)',
    lastVisit: '2024-01-10',
    nextAppointment: 'Family bereavement call scheduled',
    lastSeenBy: {
      provider: 'Sarah Johnson',
      discipline: 'SC',
      date: '2024-01-18',
      time: '14:00'
    },
    palliativeCare: {
      prognosis: 'deceased',
      goalsOfCare: 'family bereavement support',
      dateOfDeath: '2024-01-10',
      placeOfDeath: 'home',
      deathPeaceful: true,
      advanceDirectives: {
        dnr: true,
        dni: true,
        molst: true,
        polst: true,
        lastUpdated: '2023-12-15'
      },
      spiritualNeeds: {
        religion: 'Catholic',
        chaplainVisits: true,
        spiritualConcerns: 'Family spiritual support needed'
      },
      culturalConsiderations: {
        language: 'Spanish/English',
        interpreter: false,
        culturalPractices: 'Traditional Catholic memorial practices'
      }
    },
    family: {
      primaryCaregiver: {
        name: 'Maria Martinez',
        relationship: 'Wife',
        phone: '(650) 555-0741',
        email: 'mmartinez@email.com',
        address: 'Same as patient'
      },
      emergencyContacts: [
        {
          name: 'Roberto Martinez Jr.',
          relationship: 'Son',
          phone: '(650) 555-0852',
          isPrimary: true
        },
        {
          name: 'Carmen Martinez',
          relationship: 'Daughter',
          phone: '(408) 555-0963',
          isPrimary: true
        }
      ],
      familyDynamics: 'Widow struggling with grief. Adult children supportive but live at distance.',
      grief: 'acute',
      caregiverBurden: 'N/A',
      bereavementSupport: {
        enrolled: true,
        counselorAssigned: 'Dr. Sarah Johnson, LCSW',
        nextContact: '2024-01-24',
        supportGroupReferral: true,
        memorialPlanning: 'completed'
      }
    },
    symptoms: null // N/A for deceased patient
  }
]; 