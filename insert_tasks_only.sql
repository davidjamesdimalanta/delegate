-- ===================================================================
-- INSERT SAMPLE TASKS (table already exists)
-- ===================================================================

-- First, check what patients you have available
SELECT id, name FROM patients ORDER BY id;

-- Insert basic sample tasks for patient "1" (assuming this patient exists)
INSERT INTO tasks (title, description, due_time, status, priority, patient_id, task_type, notes) VALUES
-- Pending Tasks
('Medication Administration', 'Administer insulin to patient. Check blood sugar levels before administration and record results.', '2:30 PM', 'pending', 'critical', '1', 'medication', 'Patient has been showing elevated glucose levels consistently. Monitor for any adverse reactions.'),
('Vital Signs Check', 'Record vital signs for post-op patient including blood pressure, heart rate, temperature, and respiratory rate.', '3:00 PM', 'pending', 'medium', '1', 'vitals', 'Patient is recovering well from surgery. Continue monitoring every 2 hours.'),
('Patient Discharge', 'Complete discharge paperwork and provide patient with post-care instructions and medication schedule.', '4:15 PM', 'pending', 'low', '1', 'discharge', ''),
('Wound Care Assessment', 'Assess and redress surgical wound for patient. Check for signs of infection.', '5:00 PM', 'pending', 'medium', '1', 'assessment', 'Wound healing progressing normally. No signs of infection observed.'),
('Physical Therapy Session', 'Assist patient with mobility exercises and rehabilitation following hip replacement surgery.', '6:30 PM', 'pending', 'low', '1', 'therapy', ''),
('Emergency Response', 'Respond to urgent call in ICU - patient monitoring required for cardiac irregularities.', 'NOW', 'pending', 'critical', '1', 'emergency', 'URGENT: Patient showing cardiac irregularities. Immediate attention required.'),

-- Completed Tasks
('Morning Medication Round', 'Administered all scheduled morning medications to patients in assigned ward. All medications given on time without complications.', '8:00 AM', 'completed', 'medium', '1', 'medication', 'All morning medications administered successfully. Patient responded well to insulin dose adjustment.'),
('Patient Assessment', 'Completed comprehensive initial assessment for new patient admission including medical history, current symptoms, and care plan development.', '10:30 AM', 'completed', 'low', '1', 'assessment', 'Initial assessment completed. Patient is stable and comfortable. Care plan established with physician.'),
('Blood Draw', 'Collected blood samples for routine lab work including CBC, metabolic panel, and lipid profile as ordered by physician.', '11:15 AM', 'completed', 'medium', '1', 'general', 'Blood samples collected without complications. Samples sent to lab for processing. Results expected by 2 PM.');

-- ===================================================================
-- Check if you have MRN patients for palliative care tasks
-- ===================================================================
SELECT id, name FROM patients WHERE id IN ('MRN-12345', 'MRN-67890', 'MRN-24680');

-- If the above query returns patients, run this insert for palliative care tasks:
-- (Only run if you have these patients)
INSERT INTO tasks (title, description, due_time, status, priority, patient_id, task_type, notes) VALUES
-- Tasks for Sarah Johnson (MRN-12345)
('Family Support Assessment', 'Conduct family support assessment and provide resources for patient with advanced breast cancer', '4:00 PM', 'pending', 'family-support', 'MRN-12345', 'palliative', 'Focus on caregiver burden and grief support. Husband showing signs of stress.'),
('Pain Management Review', 'Review current pain management protocol and adjust medications as needed', '2:00 PM', 'pending', 'symptom-care', 'MRN-12345', 'palliative', 'Current pain level 6/10. Target is 3/10. Consider morphine adjustment.'),

-- Tasks for Michael Chen (MRN-67890)
('Symptom Assessment', 'Conduct comprehensive symptom assessment using ESAS-r for COPD patient', '5:00 PM', 'pending', 'symptom-care', 'MRN-67890', 'palliative', 'Monitor pain levels and respiratory symptoms. Patient reports increased dyspnea.'),
('Goals of Care Discussion', 'Review advance directives and care preferences with patient and family', '3:30 PM', 'pending', 'goals-of-care', 'MRN-67890', 'palliative', 'Patient expressing uncertainty about treatment goals. Family meeting needed.'),

-- Tasks for Emily Rodriguez (MRN-24680)
('End-of-Life Care Planning', 'Coordinate comfort care measures and family support for imminent patient', '6:00 PM', 'pending', 'goals-of-care', 'MRN-24680', 'palliative', 'Family meeting scheduled. Discuss final wishes and comfort measures.'),
('Comfort Care Assessment', 'Ensure patient comfort and manage symptoms for end-stage pancreatic cancer', 'CONTINUOUS', 'pending', 'symptom-care', 'MRN-24680', 'palliative', 'Monitor pain, nausea, agitation. Family present and supportive.');

-- ===================================================================
-- Verify the tasks were inserted successfully
-- ===================================================================
SELECT 
    id,
    title,
    status,
    priority,
    patient_id,
    due_time,
    created_at
FROM tasks 
ORDER BY created_at DESC;

-- Count tasks by status
SELECT 
    status,
    COUNT(*) as count
FROM tasks 
GROUP BY status
ORDER BY status;

-- Count tasks by patient
SELECT 
    patient_id,
    COUNT(*) as task_count
FROM tasks 
GROUP BY patient_id
ORDER BY patient_id; 