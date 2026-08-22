# 🚀 Quick Setup: Supabase MCP Tool

## ✅ Step-by-Step Instructions

### Step 1: Locate the MCP Configuration File
```
Path: .kiro/settings/mcp.json
```

### Step 2: Copy the Configuration

**Option A: Using File Explorer**
1. Open `.kiro/settings/mcp.json` in any text editor
2. Replace the contents with the configuration from `mcp-config-supabase.json`
3. Save the file

**Option B: Using Command**
```bash
# Windows PowerShell
Copy-Item "mcp-config-supabase.json" ".kiro\settings\mcp.json" -Force

# Or open in notepad
notepad .kiro\settings\mcp.json
```

**Option C: Manual Copy**
Copy this configuration:
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

### Step 3: Verify the Configuration

1. **Check the file:**
   ```bash
   cat .kiro\settings\mcp.json
   ```

2. **Expected output:**
   ```json
   {
     "mcpServers": {
       "supabase": { ... }
     }
   }
   ```

### Step 4: Restart Kiro (if needed)

- Close Kiro completely
- Reopen it
- Wait for MCP to connect (look for status indicator)

### Step 5: Test the Connection

Ask Kiro:
```
"List all Supabase MCP tools available"
```

Or:
```
"Show me the tables in my Supabase database"
```

---

## 🎯 What This Enables

Once configured, you can use natural language to:

### Database Operations:
- "Show me all users"
- "Count architectures created today"
- "Add a column to the users table"

### Debugging:
- "Check Supabase logs for errors"
- "Show slow queries"

### Development:
- "Deploy my edge function"
- "Run database migrations"

### Documentation:
- "How do I use Supabase RLS?"
- "Show auth examples"

---

## ✅ Configuration Details

**Project Reference:** `lussyymwvhovegbxepsf`

**Enabled Features:**
1. ✅ Documentation
2. ✅ Account Management  
3. ✅ Database Queries
4. ✅ Debugging Tools
5. ✅ Development Utilities
6. ✅ Edge Functions
7. ✅ Database Branching

---

## 🛠️ Troubleshooting

### Issue: File not found
**Solution:**
```bash
# Create the directory if it doesn't exist
mkdir -p .kiro/settings
echo '{}' > .kiro/settings/mcp.json
```

### Issue: MCP not connecting
**Solution:**
1. Check internet connection
2. Verify project reference is correct
3. Restart Kiro IDE

### Issue: Permission denied
**Solution:**
Run as administrator or check file permissions

---

## 📚 More Information

For detailed documentation, see:
- `SUPABASE_MCP_SETUP.md` - Comprehensive guide
- `mcp-config-supabase.json` - Configuration template

---

## ✅ Quick Checklist

- [ ] Located `.kiro/settings/mcp.json`
- [ ] Copied configuration from `mcp-config-supabase.json`
- [ ] Saved the file
- [ ] Restarted Kiro (if needed)
- [ ] Tested with a query
- [ ] Verified MCP connection status

---

**Status:** Ready to configure  
**Time to setup:** ~2 minutes  
**Difficulty:** Easy ⭐

🎉 **You're ready to use Supabase MCP!**
