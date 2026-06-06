-- ============================================================================
-- DEBUG: Check if architectures exist at all
-- ============================================================================

-- 1. Check total count (as admin, bypassing RLS)
-- Run this in SQL Editor
SELECT COUNT(*) as total_architectures
FROM public.architectures;

-- 2. Check all architectures with user info
SELECT 
  a.id,
  a.user_id,
  LEFT(a.idea, 50) as idea,
  a.created_at,
  up.email
FROM public.architectures a
LEFT JOIN public.user_profiles up ON up.id = a.user_id
ORDER BY a.created_at DESC;

-- 3. Check current user ID
SELECT auth.uid() as current_user_id;

-- 4. Check user_profiles
SELECT 
  id,
  email,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- 5. Check if user_id in architectures matches auth.users
SELECT 
  a.id as arch_id,
  a.user_id as arch_user_id,
  au.id as auth_user_id,
  au.email,
  CASE 
    WHEN a.user_id = au.id THEN '✅ Match'
    ELSE '❌ Mismatch'
  END as match_status
FROM public.architectures a
LEFT JOIN auth.users au ON au.id = a.user_id
ORDER BY a.created_at DESC;

-- ============================================================================
-- If Query 1 returns 0:
-- - Architectures are NOT being saved to Supabase
-- - Check browser console for errors
-- - Check if Supabase client is initialized
--
-- If Query 1 returns > 0 but Query 10 (from previous file) returns 0:
-- - Architectures exist but RLS is blocking access
-- - user_id mismatch between architectures and current user
-- - Check Query 5 to see the mismatch
-- ============================================================================
