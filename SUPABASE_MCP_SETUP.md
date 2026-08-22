# Supabase MCP Tool Setup Guide

## 🎯 What is MCP?

**MCP (Model Context Protocol)** allows AI assistants to directly interact with external services like Supabase through standardized tools. This enables direct database queries, debugging, and management without manual API calls.

---

## ✅ Adding Supabase MCP Server

### Option 1: Manual Configuration (Recommended)

1. **Open the MCP configuration file:**
   ```
   .kiro/settings/mcp.json
   ```

2. **Add the Supabase server configuration:**
   ```json
   {
     "mcpServers": {
       "supabase": {
         "url": "https://mcp.supabase.com/mcp?project_ref=lussyymwvhovegbxepsf&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching",
         "disabled": false
       }
     }
   }
   ```

3. **Save the file** and the MCP server will auto-connect

### Option 2: Using Kiro Command Palette

1. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
2. Type "MCP: Configure Servers"
3. Add the Supabase configuration manually

### Option 3: Using Kiro MCP UI

1. Open Kiro IDE
2. Look for "MCP Servers" view in the Kiro panel
3. Click "Add Server"
4. Paste the configuration

---

## 🔧 Configuration Breakdown

```json
{
  "mcpServers": {
    "supabase": {                    // Server name
      "url": "...",                  // MCP endpoint URL
      "disabled": false              // Enable/disable server
    }
  }
}
```

### URL Parameters Explained:

| Parameter | Value | Description |
|-----------|-------|-------------|
| `project_ref` | `lussyymwvhovegbxepsf` | Your Supabase project reference |
| `features` | Multiple | Enabled MCP features |

### Features Enabled:

1. **docs** - Documentation access
2. **account** - Account management
3. **database** - Direct database queries
4. **debugging** - Debug tools
5. **development** - Development utilities
6. **functions** - Edge functions management
7. **branching** - Database branching (Preview branches)

---

## 🚀 What You Can Do With Supabase MCP

### 1. Database Operations
```
Ask Kiro:
- "Query all users from the database"
- "Show me the schema for the architectures table"
- "Count how many users signed up today"
- "Add a new column to the users table"
```

### 2. Debugging
```
Ask Kiro:
- "Check Supabase logs for errors"
- "Show me slow queries in the last hour"
- "Debug authentication issues"
```

### 3. Development
```
Ask Kiro:
- "Deploy my edge function"
- "Update database schema"
- "Run migration scripts"
```

### 4. Documentation
```
Ask Kiro:
- "Show Supabase documentation for RLS"
- "How do I implement row-level security?"
```

---

## 📊 Available MCP Tools

Once configured, Kiro will have access to these Supabase tools:

### Database Tools:
- `query_database` - Execute SQL queries
- `list_tables` - Show all tables
- `describe_table` - Get table schema
- `create_table` - Create new table
- `alter_table` - Modify table structure

### Account Tools:
- `get_project_info` - Project details
- `list_databases` - Show databases
- `get_usage_stats` - Usage metrics

### Function Tools:
- `list_functions` - Show edge functions
- `deploy_function` - Deploy function
- `invoke_function` - Test function

### Debugging Tools:
- `view_logs` - Check logs
- `analyze_performance` - Performance metrics
- `check_health` - Health status

---

## 🔐 Security & Permissions

### What MCP Can Access:

✅ **Can Access:**
- Database schema (read-only)
- Public documentation
- Project metadata
- Logs and metrics

✅ **Can Modify (with confirmation):**
- Database records
- Table structures
- Edge functions

❌ **Cannot Access:**
- Service role keys (secure)
- Billing information
- Personal data without RLS

### Authentication:

The MCP URL includes your project reference but requires:
- Valid Supabase authentication
- Proper RLS (Row Level Security) policies
- Project permissions

---

## 🧪 Testing the MCP Connection

After adding the configuration:

### 1. Check Connection Status
Open Kiro and look for "MCP Servers" in the status bar or panel:
- ✅ Green = Connected
- ⚠️ Yellow = Connecting
- ❌ Red = Error

### 2. Test a Simple Query
Ask Kiro:
```
"Using Supabase MCP, show me all tables in my database"
```

### 3. Verify Features
```
"List available Supabase MCP tools"
```

---

## 🛠️ Troubleshooting

### Issue: MCP Server Not Connecting

**Solution 1: Check Network**
```bash
# Test MCP endpoint
curl "https://mcp.supabase.com/mcp?project_ref=lussyymwvhovegbxepsf"
```

**Solution 2: Verify Project Ref**
- Go to Supabase Dashboard
- Settings → General
- Confirm project reference: `lussyymwvhovegbxepsf`

**Solution 3: Restart Kiro**
- Close Kiro completely
- Reopen and wait for MCP to connect

### Issue: MCP Tools Not Available

**Check:**
1. Is `"disabled": false` in config?
2. Is the URL correctly formatted?
3. Are you authenticated with Supabase?

### Issue: Permission Denied

**Fix:**
1. Check Supabase RLS policies
2. Verify project permissions
3. Ensure service role key is set in backend `.env`

---

## 📋 Complete Configuration Example

### With Multiple MCP Servers:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=lussyymwvhovegbxepsf&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching",
      "disabled": false
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      },
      "disabled": true
    }
  }
}
```

---

## 🎯 Use Cases for Your Project

### 1. Database Management
```
"Show me all users who signed up in the last 7 days"
"Create a backup of the architectures table"
"Optimize slow queries"
```

### 2. Development Workflow
```
"Run the latest migration"
"Deploy the authentication function"
"Test the rate limiting edge function"
```

### 3. Monitoring & Analytics
```
"How many architecture generations happened today?"
"Show me error logs from the last hour"
"What's the database size?"
```

### 4. Schema Updates
```
"Add a 'favorite' boolean column to architectures table"
"Create an index on user_id for faster queries"
"Update the user tier enum values"
```

---

## 📚 Learn More

### Supabase MCP Documentation:
- https://supabase.com/docs/guides/ai/mcp

### Model Context Protocol:
- https://modelcontextprotocol.io/

### Kiro MCP Guide:
- Check Kiro documentation for MCP setup

---

## ✅ Quick Setup Checklist

- [ ] Open `.kiro/settings/mcp.json`
- [ ] Add Supabase MCP configuration
- [ ] Save the file
- [ ] Restart Kiro (if needed)
- [ ] Check MCP connection status
- [ ] Test with a simple query
- [ ] Verify all features work

---

## 🎉 Benefits of Using Supabase MCP

### 1. **Direct Database Access**
No need to write SQL queries manually - just ask Kiro in natural language!

### 2. **Faster Development**
```
Before: Write SQL → Test → Fix → Repeat
After:  Ask Kiro → Done ✅
```

### 3. **Better Debugging**
```
Instead of: Checking logs manually
Just ask: "Show me errors in the last hour"
```

### 4. **Automated Tasks**
```
"Check database health every hour"
"Auto-optimize slow queries"
"Monitor user signups"
```

### 5. **Documentation at Your Fingertips**
```
"How do I implement RLS for architectures?"
"Show me Supabase auth examples"
```

---

## 🔄 Updating Configuration

To modify features or disable temporarily:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=lussyymwvhovegbxepsf&features=docs%2Cdatabase",
      "disabled": false  // Set to true to disable
    }
  }
}
```

**Feature Codes:**
- `docs` - Documentation
- `account` - Account info
- `database` - DB queries
- `debugging` - Logs & debug
- `development` - Dev tools
- `functions` - Edge functions
- `branching` - DB branches

---

## 🎊 You're All Set!

After adding the Supabase MCP server, you can:

✅ Query your database naturally  
✅ Debug issues faster  
✅ Manage your Supabase project from Kiro  
✅ Access documentation instantly  
✅ Automate common tasks  

**Happy coding with Supabase MCP!** 🚀

---

**Configuration Status:** Ready to add  
**Project Reference:** `lussyymwvhovegbxepsf`  
**Features:** Full access (7 features enabled)  
**Security:** Project-scoped with RLS  
