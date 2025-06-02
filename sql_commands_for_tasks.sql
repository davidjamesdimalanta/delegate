-- ===================================================================
-- STEP 1: Check if tasks table exists
-- ===================================================================
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'tasks'
) AS tasks_table_exists;

-- ===================================================================
-- STEP 2: Create tasks table (only run if table doesn't exist)
-- ===================================================================
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'inProgress', 'completed', 'overdue', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low', 'symptom-care', 'family-support', 'goals-of-care')),
    patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID,
    assigned_to UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    task_type TEXT DEFAULT 'general' CHECK (task_type IN ('general', 'medication', 'vitals', 'assessment', 'discharge', 'wound_care', 'therapy', 'emergency', 'palliative')),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_patient_id ON tasks(patient_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_time ON tasks(due_time);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_task_type ON tasks(task_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- STEP 3: Check what patients exist in your database
-- ===================================================================
SELECT id, name FROM patients ORDER BY id;

-- ===================================================================
-- STEP 4: Insert sample tasks (using patient ID "1" and any others you have)
-- ===================================================================

-- First, let's add some basic tasks for patient "1"
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
-- STEP 5: If you have the MRN patients, add palliative care tasks
-- ===================================================================

-- Only run these if you have the MRN patients in your database
-- First check if these patients exist:
SELECT id, name FROM patients WHERE id IN ('MRN-12345', 'MRN-67890', 'MRN-24680');

-- If they exist, insert palliative care tasks:
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
-- STEP 6: Verify the tasks were inserted
-- ===================================================================
SELECT 
    id,
    title,
    status,
    priority,
    patient_id,
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