// Simple test script to verify database setup
// Run with: node test-database.js

import { createClient } from '@supabase/supabase-js'
import { SAMPLE_PATIENTS } from '../constants/SamplePatients.js'

// Load environment variables
import 'dotenv/config'


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.log('Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { error } = await supabase.from('patients').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Successfully connected to Supabase!')
    return true
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    return false
  }
}

async function testTableExists() {
  console.log('🗄️ Checking if patients table exists...')
  
  try {
    const { count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Table check failed:', error.message)
      console.log('💡 Run the SQL from sql/create_patients_table.sql in your Supabase dashboard')
      return false
    }
    
    console.log(`✅ Patients table exists with ${count || 0} records`)
    return true
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    return false
  }
}

async function testSeedData() {
  console.log('🌱 Testing data seeding...')
  
  try {
    // Check current count
    const { count: initialCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Initial patient count: ${initialCount || 0}`)
    
    if ((initialCount || 0) > 0) {
      console.log('📝 Database already has data, skipping seed test')
      return true
    }
    
    // Transform and insert first sample patient as test
    const testPatient = {
      id: SAMPLE_PATIENTS[0].id,
      name: SAMPLE_PATIENTS[0].name,
      priority: SAMPLE_PATIENTS[0].priority,
      address: SAMPLE_PATIENTS[0].address,
      coordinates: SAMPLE_PATIENTS[0].coordinates,
      vitals: SAMPLE_PATIENTS[0].vitals,
      age: SAMPLE_PATIENTS[0].age,
      condition: SAMPLE_PATIENTS[0].condition,
      last_visit: SAMPLE_PATIENTS[0].lastVisit,
      next_appointment: SAMPLE_PATIENTS[0].nextAppointment,
      last_seen_by: SAMPLE_PATIENTS[0].lastSeenBy,
      palliative_care: SAMPLE_PATIENTS[0].palliativeCare,
      family: SAMPLE_PATIENTS[0].family,
      symptoms: SAMPLE_PATIENTS[0].symptoms,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('patients')
      .insert(testPatient)
      .select()
    
    if (error) {
      console.error('❌ Seed test failed:', error.message)
      return false
    }
    
    console.log('✅ Successfully inserted test patient:', data[0].name)
    
    // Clean up test data
    await supabase.from('patients').delete().eq('id', testPatient.id)
    console.log('🧹 Cleaned up test data')
    
    return true
  } catch (err) {
    console.error('❌ Unexpected error during seed test:', err.message)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting Supabase Database Tests\n')
  
  const connectionOk = await testConnection()
  if (!connectionOk) return
  
  console.log('')
  const tableOk = await testTableExists()
  if (!tableOk) return
  
  console.log('')
  const seedOk = await testSeedData()
  
  console.log('\n' + '='.repeat(50))
  if (connectionOk && tableOk && seedOk) {
    console.log('🎉 All tests passed! Your database is ready to use.')
    console.log('💡 You can now run your app and the sample data will be automatically seeded.')
  } else {
    console.log('❌ Some tests failed. Please check the errors above.')
  }
  console.log('='.repeat(50))
}

runTests().catch(console.error) 