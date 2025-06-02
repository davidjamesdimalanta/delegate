-- ===================================================================
-- FIX ROW LEVEL SECURITY (RLS) FOR TASKS TABLE
-- ===================================================================

-- Step 1: Check if RLS is enabled on tasks table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';

-- Step 2: Check current policies on tasks table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tasks';

-- Step 3: If RLS is enabled but no policies exist, we need to either:
-- Option A: Disable RLS (simplest for development)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Option B: Or create policies to allow access (more secure for production)
-- Uncomment these lines if you want to use RLS with policies instead:

-- -- Enable RLS if not already enabled
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- 
-- -- Allow all operations for authenticated users
-- CREATE POLICY "Allow all operations for authenticated users" ON tasks
--   FOR ALL 
--   TO authenticated 
--   USING (true) 
--   WITH CHECK (true);
-- 
-- -- Allow all operations for anonymous users (for development)
-- CREATE POLICY "Allow all operations for anonymous users" ON tasks
--   FOR ALL 
--   TO anon 
--   USING (true) 
--   WITH CHECK (true);

-- Step 4: Test that we can now access tasks
SELECT COUNT(*) as total_tasks FROM tasks;
SELECT * FROM tasks LIMIT 5; 