# Supabase Database Integration Setup

This guide will help you set up and use the Supabase database integration for your palliative care patient management app.

## 🗄️ Database Schema

Your patient data is now connected to a Supabase PostgreSQL database with the following structure:

### Patients Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (Primary Key) | Patient Medical Record Number |
| `name` | TEXT | Patient full name |
| `priority` | TEXT | Care priority level |
| `address` | TEXT | Patient address |
| `coordinates` | JSONB | Latitude/longitude coordinates |
| `vitals` | TEXT | Current vital signs information |
| `age` | INTEGER | Patient age (nullable) |
| `condition` | TEXT | Medical condition |
| `last_visit` | DATE | Date of last visit |
| `next_appointment` | TEXT | Next appointment details |
| `last_seen_by` | JSONB | Last provider information |
| `palliative_care` | JSONB | Palliative care specific data |
| `family` | JSONB | Family and caregiver information |
| `symptoms` | JSONB | Current symptoms and assessments |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

## 🚀 Quick Setup

### 1. Database Setup

1. **Run the SQL Schema**: Copy the contents of `sql/create_patients_table.sql` and run it in your Supabase SQL Editor:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to SQL Editor
   - Paste and run the SQL commands

2. **Environment Variables**: Your `.env.local` file should contain:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Initialize Sample Data

The app will automatically detect if your database is empty and seed it with sample patient data on first run.

```typescript
import { initializeDatabase } from './utils/database'

// This runs automatically when using usePatients hook
await initializeDatabase()
```

## 📱 Using the Database in Your App

### Basic Patient Operations

```typescript
import { usePatients } from './hooks/usePatients'

function PatientScreen() {
  const { 
    patients, 
    loading, 
    error, 
    refreshPatients,
    createPatient,
    updatePatient,
    deletePatient 
  } = usePatients()

  // Your component logic here...
}
```

### Available Operations

#### Fetch All Patients
```typescript
const { patients, loading, error } = usePatients()
```

#### Get Single Patient
```typescript
import { usePatient } from './hooks/usePatients'

const { patient, loading, error } = usePatient('MRN-12345')
```

#### Create New Patient
```typescript
const newPatient = {
  id: 'MRN-99999',
  name: 'John Doe',
  priority: 'symptom-care',
  address: '123 Main St',
  coordinates: { latitude: 40.7128, longitude: -74.0060 },
  vitals: 'Stable',
  age: 65,
  condition: 'Heart failure',
  // ... other required fields
}

await createPatient(newPatient)
```

#### Update Patient
```typescript
await updatePatient('MRN-12345', {
  vitals: 'Updated vitals: 98.6°F, 110/70 mmHg',
  priority: 'urgent-comfort'
})
```

#### Delete Patient
```typescript
await deletePatient('MRN-12345')
```

#### Search Patients
```typescript
await searchPatients('cancer') // Searches name, condition, address
```

#### Filter by Priority
```typescript
await getPatientsByPriority('imminent')
```

## 🔄 Real-time Updates

The app includes real-time synchronization. When data changes in the database (from any source), your app will automatically update:

```typescript
// Real-time subscription is automatically set up in usePatients hook
// Changes from other users/devices will appear instantly
```

## 🏥 Sample Patient Data

Your app comes with 6 sample patients representing different palliative care scenarios:

1. **Sarah Johnson** - Advanced breast cancer (urgent-comfort)
2. **Michael Chen** - End-stage COPD (symptom-care)
3. **Emily Rodriguez** - End-stage pancreatic cancer (imminent)
4. **David Thompson** - ALS (family-support)
5. **Lisa Wang** - Metastatic ovarian cancer (psychosocial)
6. **Robert Martinez** - Deceased patient (bereavement)

Each patient includes comprehensive data:
- Demographics and contact information
- Palliative care goals and preferences
- Family dynamics and caregiver information
- Symptom assessments (ESAS scores)
- Advance directives
- Cultural and spiritual considerations

## 🔧 Database Functions and Views

### Custom Functions

- `get_patients_by_priority(priority_level)` - Fetch patients by priority
- `search_patients(search_term)` - Full-text search across patients

### Views

- `urgent_patients` - Pre-filtered view of high-priority patients

### Usage Examples

```typescript
// Using custom functions via Supabase client
import { supabase } from './utils/supabase'

// Get urgent patients using the view
const { data } = await supabase.from('urgent_patients').select('*')

// Use custom function
const { data } = await supabase.rpc('get_patients_by_priority', { 
  priority_level: 'imminent' 
})
```

## 🛠️ Advanced Usage

### Row Level Security (RLS)

The database has RLS enabled for security. Current policies:
- Authenticated users: Full access (CRUD operations)
- Anonymous users: Read-only access

### Custom Queries

```typescript
import { supabase } from './utils/supabase'

// Complex filtering
const { data } = await supabase
  .from('patients')
  .select(`
    id, 
    name, 
    priority,
    palliative_care->prognosis as prognosis,
    family->primaryCaregiver->name as caregiver_name
  `)
  .in('priority', ['imminent', 'urgent-comfort'])
  .order('updated_at', { ascending: false })
```

### Batch Operations

```typescript
// Insert multiple patients
const { data, error } = await supabase
  .from('patients')
  .upsert(arrayOfPatients)
```

## 📊 Monitoring and Performance

### Indexes

The database includes indexes on commonly queried fields:
- `priority` - For filtering by care priority
- `name` - For patient name searches
- `last_visit` - For date-based queries
- `condition` - For medical condition filtering
- `updated_at` - For sorting by last update

### Query Optimization

- Use `select()` to specify only needed columns
- Leverage indexed columns for filtering
- Use the provided utility functions for common operations

## 🔍 Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify environment variables in `.env.local`
   - Check Supabase project status
   - Ensure network connectivity

2. **Permission Errors**
   - Verify RLS policies
   - Check authentication status
   - Review user permissions

3. **Data Not Appearing**
   - Check if database was initialized
   - Verify table creation
   - Look for JavaScript console errors

### Debug Mode

Enable detailed logging:

```typescript
// Add to your app's root component
if (__DEV__) {
  console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL)
  // Don't log the anon key in production!
}
```

## 🎯 Next Steps

1. **Customize the Schema**: Modify `sql/create_patients_table.sql` for your specific needs
2. **Add Authentication**: Implement user login for multi-user scenarios
3. **Create More Views**: Add specialized views for different user roles
4. **Implement Backup**: Set up regular database backups
5. **Add Validation**: Implement client-side and database-level validation

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL JSONB Guide](https://www.postgresql.org/docs/current/datatype-json.html)
- [React Native Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

---

Your palliative care management app is now powered by a robust, real-time database that scales with your needs while maintaining the privacy and security requirements of healthcare applications. 