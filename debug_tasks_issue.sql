-- ===================================================================
-- COMPREHENSIVE DEBUGGING FOR TASKS ISSUE (Supabase Compatible)
-- ===================================================================

-- Step 1: Check if tasks table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Check if there are ANY tasks in the table
SELECT COUNT(*) as total_tasks FROM tasks;

-- Step 3: Check all tasks (if any exist)
SELECT * FROM tasks LIMIT 10;

-- Step 4: Check what patients exist (to see what patient_id we should use)
SELECT id, name FROM patients ORDER BY id;

-- Step 5: Check if there are any foreign key constraint issues
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='tasks';

-- Step 6: Try to insert ONE simple task and see what happens
INSERT INTO tasks (title, description, due_time, status, priority, patient_id, task_type, notes) 
VALUES ('Test Task', 'This is a test task', '1:00 PM', 'pending', 'medium', '1', 'general', 'Test notes')
RETURNING *;

-- Step 7: Check if that task was inserted
SELECT COUNT(*) as total_after_test_insert FROM tasks;

-- Step 8: Try inserting without specifying patient_id to see if that's the issue
INSERT INTO tasks (title, description, due_time, status, priority, task_type, notes) 
VALUES ('Test Task 2', 'This is a test task without patient_id', '2:00 PM', 'pending', 'medium', 'general', 'Test notes 2')
RETURNING *;

-- Step 9: Check again
SELECT COUNT(*) as final_count FROM tasks;
SELECT * FROM tasks; 