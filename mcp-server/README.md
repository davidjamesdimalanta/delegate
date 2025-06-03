# Medical App MCP Server

A custom Model Context Protocol (MCP) server designed specifically for palliative care medical applications. This server provides specialized tools, resources, and prompts for managing patient care, visit documentation, and clinical workflows.

## Features

### 🛠️ Medical-Specific Tools

1. **`get_patient_summary`** - Comprehensive patient overview with tasks and visits
2. **`create_care_plan_note`** - Structured care planning documentation
3. **`get_pending_tasks_summary`** - Prioritized task management with filtering
4. **`create_visit_documentation`** - Complete visit assessment documentation
5. **`generate_medication_report`** - Medication administration tracking

### 📚 Resources

- **`medical://patients/all`** - Complete patient database access
- **`medical://tasks/pending`** - Active tasks with patient context
- **`medical://visits/recent`** - Recent visit history
- **`medical://guidelines/palliative-care`** - Clinical guidelines and best practices

### 💬 Intelligent Prompts

- **`clinical_summary`** - Generate professional visit summaries
- **`care_plan_review`** - Evidence-based care plan recommendations
- **`medication_reconciliation`** - Drug interaction and dosing analysis

## Setup Instructions

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your Supabase credentials:

```bash
cp env.example .env
```

Edit `.env` with your Supabase configuration:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Build the Server

```bash
npm run build
```

### 4. Add to Cursor MCP Configuration

Update your `~/.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "your_supabase_access_token"
      ]
    },
    "medical-app": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/build/index.js"],
      "env": {
        "SUPABASE_URL": "your_supabase_project_url",
        "SUPABASE_SERVICE_ROLE_KEY": "your_supabase_service_role_key"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can use the MCP server in Cursor with natural language commands:

### Patient Management
```
"Get a complete summary for patient ID abc-123 including their current tasks and recent visits"

"Create a care plan note for patient xyz-456 about their symptom assessment with high priority"
```

### Task Management
```
"Show me all pending high-priority tasks with patient information"

"Get a summary of pending tasks for the next 24 hours"
```

### Clinical Documentation
```
"Create visit documentation for visit ID visit-789 with pain level 7, family concerns about medication side effects, and goals of care discussion about comfort measures"

"Generate a medication report for patient abc-123 from 2024-01-01 to 2024-01-31"
```

### Clinical Decision Support
```
"Review the current care plan for patient xyz-456 and suggest improvements based on their recent assessments"

"Help me reconcile medications for a patient taking morphine, lorazepam, and haloperidol"
```

## Development

### Watch Mode
```bash
npm run watch
```

### Testing
```bash
npm run dev
```

## Architecture

The MCP server follows the official [Model Context Protocol specification](https://modelcontextprotocol.io/) and integrates with:

- **Supabase Database** - For patient, task, and visit data
- **TypeScript** - For type safety and better development experience
- **Node.js** - Runtime environment
- **Standard I/O Transport** - Communication with MCP clients

## Database Schema Requirements

The server expects the following Supabase tables:

- `patients` - Patient information and demographics
- `tasks` - Medical tasks and care activities
- `visits` - Patient visit records
- `visit_notes` - Visit documentation (optional, for enhanced features)
- `care_notes` - Care plan notes (optional, for enhanced features)

## Clinical Guidelines Integration

The server includes built-in palliative care guidelines covering:

- Core principles of comfort-focused care
- Symptom assessment protocols
- Family support frameworks
- Goals of care discussion guidance
- Documentation requirements

## Security Considerations

- Uses Supabase Row Level Security (RLS) for data access control
- Requires service role key for full database access
- Implements input validation for all tool parameters
- Follows healthcare data privacy best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with your medical app
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions about the medical MCP server, please refer to:
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Supabase Documentation](https://supabase.com/docs)
- Your medical app's documentation 