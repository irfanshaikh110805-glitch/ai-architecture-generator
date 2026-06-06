-- ============================================================================
-- Supabase Data Verification Queries
-- Run these in Supabase SQL Editor to verify data is being saved correctly
-- ============================================================================

-- 1. Check if architectures are being saved
SELECT 
  id,
  user_id,
  LEFT(idea, 50) as idea_preview,
  architecture_type,
  created_at
FROM public.architectures
ORDER BY created_at DESC
LIMIT 10;

-- 2. Count architectures per user
SELECT 
  user_id,
  COUNT(*) as architecture_count,
  MAX(created_at) as last_generated
FROM public.architectures
GROUP BY user_id
ORDER BY architecture_count DESC;

-- 3. Check if diagrams are being saved
SELECT 
  id,
  LEFT(idea, 30) as idea,
  CASE 
    WHEN er_diagram IS NOT NULL THEN '✅ Has ER Diagram'
    ELSE '❌ No ER Diagram'
  END as er_status,
  CASE 
    WHEN architecture_diagram IS NOT NULL THEN '✅ Has Arch Diagram'
    ELSE '❌ No Arch Diagram'
  END as arch_status,
  LENGTH(er_diagram) as er_diagram_length,
  LENGTH(architecture_diagram) as arch_diagram_length
FROM public.architectures
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check tech stack data
SELECT 
  id,
  LEFT(idea, 30) as idea,
  architecture_type,
  LEFT(tech_stack_frontend, 50) as frontend,
  LEFT(tech_stack_backend, 50) as backend,
  LEFT(tech_stack_database, 50) as database
FROM public.architectures
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check estimation data
SELECT 
  id,
  LEFT(idea, 30) as idea,
  estimation_hours,
  estimation_team_size,
  LEFT(estimation_cost, 50) as cost
FROM public.architectures
ORDER BY created_at DESC
LIMIT 10;

-- 6. Check for duplicate ideas (same idea_hash)
SELECT 
  idea_hash,
  COUNT(*) as count,
  STRING_AGG(LEFT(idea, 30), ' | ') as ideas
FROM public.architectures
GROUP BY idea_hash
HAVING COUNT(*) > 1;

-- 7. Check related tables (should be empty for now)
SELECT 
  'features' as table_name,
  COUNT(*) as record_count
FROM public.features
UNION ALL
SELECT 
  'database_tables',
  COUNT(*)
FROM public.database_tables
UNION ALL
SELECT 
  'apis',
  COUNT(*)
FROM public.apis
UNION ALL
SELECT 
  'components',
  COUNT(*)
FROM public.components
UNION ALL
SELECT 
  'roadmap_phases',
  COUNT(*)
FROM public.roadmap_phases;

-- 8. Get full details of most recent architecture
SELECT 
  *
FROM public.architectures
ORDER BY created_at DESC
LIMIT 1;

-- 9. Check user profiles
SELECT 
  id,
  email,
  tier,
  daily_limit,
  monthly_limit,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- 10. Check if RLS policies are working (should only see your own data)
-- Run this while logged in as a user
SELECT 
  COUNT(*) as my_architectures
FROM public.architectures
WHERE user_id = auth.uid();

-- ============================================================================
-- Expected Results
-- ============================================================================

-- Query 1: Should show your generated architectures
-- Query 2: Should show count per user
-- Query 3: Should show ✅ for both diagrams
-- Query 4: Should show tech stack strings
-- Query 5: Should show estimation data
-- Query 6: Should be empty (no duplicates) or show intentional duplicates
-- Query 7: Should show 0 for all tables (not implemented yet)
-- Query 8: Should show complete architecture record
-- Query 9: Should show user profiles
-- Query 10: Should show only your architectures (RLS working)

-- ============================================================================
-- Troubleshooting
-- ============================================================================

-- If Query 1 returns no results:
-- - Check if you're logged in
-- - Check if you've generated any architectures
-- - Check browser console for "Architecture saved to Supabase"

-- If Query 3 shows ❌ for diagrams:
-- - Check if backend is sanitizing diagrams correctly
-- - Check if AI is generating diagram code
-- - Check browser console for errors

-- If Query 7 shows counts > 0:
-- - Great! Related tables are being populated
-- - This means the full implementation is working

-- If Query 10 returns 0 but Query 1 shows data:
-- - RLS policies might not be working correctly
-- - Check if you're using the correct user_id
-- - Check if auth.uid() matches your user_id
