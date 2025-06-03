#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
    type CallToolRequest,
    type GetPromptRequest,
    type ReadResourceRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create MCP server
const server = new Server(
  {
    name: "medical-app-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_patient_summary",
        description: "Get a comprehensive summary of a patient including current tasks, recent visits, and care plan",
        inputSchema: {
          type: "object",
          properties: {
            patient_id: {
              type: "string",
              description: "The ID of the patient"
            }
          },
          required: ["patient_id"]
        }
      },
      {
        name: "create_care_plan_note",
        description: "Create a structured care plan note for a patient",
        inputSchema: {
          type: "object",
          properties: {
            patient_id: {
              type: "string",
              description: "The ID of the patient"
            },
            note_type: {
              type: "string",
              enum: ["symptom_assessment", "family_support", "goals_of_care", "medication_review", "general"],
              description: "Type of care plan note"
            },
            content: {
              type: "string",
              description: "The note content"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Priority level of the note"
            }
          },
          required: ["patient_id", "note_type", "content"]
        }
      },
      {
        name: "get_pending_tasks_summary",
        description: "Get a summary of all pending tasks with patient context",
        inputSchema: {
          type: "object",
          properties: {
            priority_filter: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Filter tasks by priority (optional)"
            },
            limit: {
              type: "number",
              description: "Maximum number of tasks to return (default: 10)"
            }
          }
        }
      },
      {
        name: "create_visit_documentation",
        description: "Create comprehensive visit documentation with assessment data",
        inputSchema: {
          type: "object",
          properties: {
            visit_id: {
              type: "string",
              description: "The ID of the visit"
            },
            assessment_data: {
              type: "object",
              properties: {
                symptoms: {
                  type: "string",
                  description: "Symptom assessment notes"
                },
                pain_level: {
                  type: "number",
                  minimum: 0,
                  maximum: 10,
                  description: "Pain level (0-10 scale)"
                },
                family_support: {
                  type: "string",
                  description: "Family support assessment"
                },
                goals_of_care: {
                  type: "string",
                  description: "Goals of care discussion notes"
                },
                interventions: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of interventions performed"
                }
              }
            },
            next_steps: {
              type: "string",
              description: "Recommended next steps or follow-up actions"
            }
          },
          required: ["visit_id", "assessment_data"]
        }
      },
      {
        name: "generate_medication_report",
        description: "Generate a medication administration report for a patient",
        inputSchema: {
          type: "object",
          properties: {
            patient_id: {
              type: "string",
              description: "The ID of the patient"
            },
            date_range: {
              type: "object",
              properties: {
                start_date: {
                  type: "string",
                  format: "date",
                  description: "Start date for the report (YYYY-MM-DD)"
                },
                end_date: {
                  type: "string",
                  format: "date",
                  description: "End date for the report (YYYY-MM-DD)"
                }
              },
              required: ["start_date", "end_date"]
            }
          },
          required: ["patient_id", "date_range"]
        }
      }
    ]
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "medical://patients/all",
        mimeType: "application/json",
        name: "All Patients",
        description: "List of all patients in the system"
      },
      {
        uri: "medical://tasks/pending",
        mimeType: "application/json", 
        name: "Pending Tasks",
        description: "All pending medical tasks"
      },
      {
        uri: "medical://visits/recent",
        mimeType: "application/json",
        name: "Recent Visits",
        description: "Recent patient visits"
      },
      {
        uri: "medical://guidelines/palliative-care",
        mimeType: "text/markdown",
        name: "Palliative Care Guidelines",
        description: "Clinical guidelines for palliative care"
      }
    ]
  };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const { uri } = request.params;

  try {
    switch (uri) {
      case "medical://patients/all": {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return {
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2)
          }]
        };
      }

      case "medical://tasks/pending": {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            patients(name, priority)
          `)
          .in('status', ['pending', 'inProgress'])
          .order('priority', { ascending: false });
        
        if (error) throw error;
        
        return {
          contents: [{
            uri,
            mimeType: "application/json", 
            text: JSON.stringify(data, null, 2)
          }]
        };
      }

      case "medical://visits/recent": {
        const { data, error } = await supabase
          .from('visits')
          .select(`
            *,
            patients(name, priority)
          `)
          .order('scheduledTime', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        
        return {
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2)
          }]
        };
      }

      case "medical://guidelines/palliative-care": {
        const guidelines = `# Palliative Care Guidelines

## Core Principles
1. **Comfort-focused care** - Prioritize symptom management and quality of life
2. **Patient-centered approach** - Respect patient values, preferences, and goals
3. **Family involvement** - Include family members in care planning and support
4. **Interdisciplinary care** - Coordinate across multiple healthcare disciplines

## Assessment Areas
### Symptom Management
- Pain assessment using validated scales (0-10)
- Nausea, fatigue, and breathing difficulties
- Psychological symptoms (anxiety, depression)

### Family Support
- Caregiver burden assessment
- Emotional support needs
- Practical support requirements

### Goals of Care
- Treatment preferences and limitations
- End-of-life care planning
- Quality vs. quantity of life discussions

## Documentation Requirements
- Regular pain and symptom assessments
- Family meeting notes
- Advance directive status
- Medication reconciliation`;

        return {
          contents: [{
            uri,
            mimeType: "text/markdown",
            text: guidelines
          }]
        };
      }

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  } catch (error) {
    throw new Error(`Failed to read resource ${uri}: ${error}`);
  }
});

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "clinical_summary",
        description: "Generate a clinical summary for a patient visit",
        arguments: [
          {
            name: "patient_data",
            description: "Patient information and visit data",
            required: true
          }
        ]
      },
      {
        name: "care_plan_review",
        description: "Review and suggest updates to a patient's care plan",
        arguments: [
          {
            name: "current_plan",
            description: "Current care plan data",
            required: true
          },
          {
            name: "recent_assessments",
            description: "Recent assessment data",
            required: true
          }
        ]
      },
      {
        name: "medication_reconciliation",
        description: "Help reconcile patient medications and identify potential issues",
        arguments: [
          {
            name: "current_medications",
            description: "List of current medications",
            required: true
          },
          {
            name: "patient_conditions",
            description: "Patient's current conditions",
            required: true
          }
        ]
      }
    ]
  };
});

// Handle prompt requests
server.setRequestHandler(GetPromptRequestSchema, async (request: GetPromptRequest) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "clinical_summary":
      return {
        description: "Generate a clinical summary for a patient visit",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please generate a comprehensive clinical summary based on the following patient data:

${args?.patient_data}

Please structure the summary with the following sections:
1. Patient Overview
2. Current Symptoms and Assessment
3. Interventions Performed
4. Patient/Family Response
5. Plan and Next Steps
6. Recommendations

Use professional medical terminology while keeping the summary clear and actionable.`
            }
          }
        ]
      };

    case "care_plan_review":
      return {
        description: "Review and suggest updates to a patient's care plan",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please review the following care plan and recent assessments, then provide recommendations for updates:

Current Care Plan:
${args?.current_plan}

Recent Assessments:
${args?.recent_assessments}

Please provide:
1. Assessment of current plan effectiveness
2. Identified gaps or areas for improvement
3. Specific recommendations for plan updates
4. Priority level for each recommendation
5. Suggested timeline for implementation

Focus on evidence-based palliative care practices and patient-centered outcomes.`
            }
          }
        ]
      };

    case "medication_reconciliation":
      return {
        description: "Help reconcile patient medications and identify potential issues",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please review the following medication list and patient conditions to identify potential issues and provide recommendations:

Current Medications:
${args?.current_medications}

Patient Conditions:
${args?.patient_conditions}

Please analyze for:
1. Drug interactions
2. Duplicate therapies
3. Inappropriate medications for palliative care
4. Missing medications that might improve comfort
5. Dosing appropriateness
6. Route of administration considerations

Provide specific recommendations with rationale for each identified issue.`
            }
          }
        ]
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_patient_summary": {
        const { patient_id } = args as { patient_id: string };
        
        // Get patient data
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patient_id)
          .single();
        
        if (patientError) throw patientError;

        // Get current tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('patient_id', patient_id)
          .in('status', ['pending', 'inProgress']);
        
        if (tasksError) throw tasksError;

        // Get recent visits
        const { data: visits, error: visitsError } = await supabase
          .from('visits')
          .select('*')
          .eq('patientId', patient_id)
          .order('scheduledTime', { ascending: false })
          .limit(5);
        
        if (visitsError) throw visitsError;

        const summary = {
          patient,
          active_tasks: tasks,
          recent_visits: visits,
          summary_generated_at: new Date().toISOString()
        };

        return {
          content: [
            {
              type: "text",
              text: `Patient Summary for ${patient.name}:

**Patient Information:**
- ID: ${patient.id}
- Priority: ${patient.priority}
- Address: ${patient.address}

**Active Tasks:** ${tasks.length}
${tasks.map((task: any) => `- ${task.title} (${task.status}, Priority: ${task.priority})`).join('\n')}

**Recent Visits:** ${visits.length}
${visits.map((visit: any) => `- ${visit.visitType} on ${new Date(visit.scheduledTime).toLocaleDateString()} (${visit.status})`).join('\n')}

**Full Data:**
\`\`\`json
${JSON.stringify(summary, null, 2)}
\`\`\``
            }
          ]
        };
      }

      case "create_care_plan_note": {
        const { patient_id, note_type, content, priority = "medium" } = args as {
          patient_id: string;
          note_type: string;
          content: string;
          priority?: string;
        };

        // Create a structured note entry
        const note = {
          patient_id,
          note_type,
          content,
          priority,
          created_at: new Date().toISOString(),
          created_by: "MCP Server",
          tags: [note_type, priority]
        };

        // In a real implementation, you'd save this to your notes table
        // For now, we'll return the structured note
        return {
          content: [
            {
              type: "text",
              text: `Care Plan Note Created:

**Type:** ${note_type}
**Priority:** ${priority}
**Patient ID:** ${patient_id}
**Content:** ${content}

**Structured Note:**
\`\`\`json
${JSON.stringify(note, null, 2)}
\`\`\`

Note: This note should be saved to your care_notes table in the database.`
            }
          ]
        };
      }

      case "get_pending_tasks_summary": {
        const { priority_filter, limit = 10 } = args as {
          priority_filter?: string;
          limit?: number;
        };

        let query = supabase
          .from('tasks')
          .select(`
            *,
            patients(name, priority, address)
          `)
          .in('status', ['pending', 'inProgress'])
          .order('priority', { ascending: false })
          .limit(limit);

        if (priority_filter) {
          query = query.eq('priority', priority_filter);
        }

        const { data: tasks, error } = await query;
        
        if (error) throw error;

        const summary = {
          total_tasks: tasks.length,
          tasks_by_priority: tasks.reduce((acc: Record<string, number>, task: any) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          tasks
        };

        return {
          content: [
            {
              type: "text",
              text: `Pending Tasks Summary:

**Total Tasks:** ${tasks.length}
**By Priority:** ${Object.entries(summary.tasks_by_priority).map(([p, count]) => `${p}: ${count}`).join(', ')}

**Task List:**
${tasks.map((task: any) => `- **${task.title}** (${task.priority}) - Patient: ${task.patients?.name || 'Unknown'} - Due: ${task.due_time || 'No due date'}`).join('\n')}

**Full Data:**
\`\`\`json
${JSON.stringify(summary, null, 2)}
\`\`\``
            }
          ]
        };
      }

      case "create_visit_documentation": {
        const { visit_id, assessment_data, next_steps } = args as {
          visit_id: string;
          assessment_data: any;
          next_steps?: string;
        };

        const documentation = {
          visit_id,
          assessment_data,
          next_steps,
          documented_at: new Date().toISOString(),
          documentation_type: "comprehensive_visit_note"
        };

        return {
          content: [
            {
              type: "text",
              text: `Visit Documentation Created:

**Visit ID:** ${visit_id}
**Pain Level:** ${assessment_data.pain_level || 'Not assessed'}
**Symptoms:** ${assessment_data.symptoms || 'None noted'}
**Family Support:** ${assessment_data.family_support || 'Not assessed'}
**Goals of Care:** ${assessment_data.goals_of_care || 'Not discussed'}
**Interventions:** ${assessment_data.interventions?.join(', ') || 'None'}
**Next Steps:** ${next_steps || 'None specified'}

**Complete Documentation:**
\`\`\`json
${JSON.stringify(documentation, null, 2)}
\`\`\`

Note: This documentation should be saved to your visit_notes table.`
            }
          ]
        };
      }

      case "generate_medication_report": {
        const { patient_id, date_range } = args as {
          patient_id: string;
          date_range: { start_date: string; end_date: string };
        };

        // Query visits within date range for medication data
        const { data: visits, error } = await supabase
          .from('visits')
          .select('*')
          .eq('patientId', patient_id)
          .gte('scheduledTime', date_range.start_date)
          .lte('scheduledTime', date_range.end_date)
          .order('scheduledTime', { ascending: true });

        if (error) throw error;

        const report = {
          patient_id,
          date_range,
          total_visits: visits.length,
          medications_administered: visits.filter((v: any) => v.medicationsAdministered?.length > 0),
          report_generated_at: new Date().toISOString()
        };

        return {
          content: [
            {
              type: "text",
              text: `Medication Report for Patient ${patient_id}:

**Date Range:** ${date_range.start_date} to ${date_range.end_date}
**Total Visits:** ${visits.length}
**Visits with Medications:** ${report.medications_administered.length}

**Medication Administration Details:**
${report.medications_administered.map((visit: any) => 
  `- ${new Date(visit.scheduledTime).toLocaleDateString()}: ${visit.medicationsAdministered?.join(', ') || 'None'}`
).join('\n')}

**Full Report Data:**
\`\`\`json
${JSON.stringify(report, null, 2)}
\`\`\``
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new Error(`Tool execution failed: ${error}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Medical App MCP Server running on stdio");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
} 