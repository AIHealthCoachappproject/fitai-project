// test-supabase.mjs — Phase 1 connection test (v2: matches ACTUAL schema from CLAUDE.md)
// Run:  node test-supabase.mjs   (from web-dashboard/)

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

console.log('======================================================')
console.log('  FitAI — Supabase Schema Test v2')
console.log('======================================================')

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
const anon  = createClient(SUPABASE_URL, ANON_KEY,    { auth: { persistSession: false } })

// Each row: table -> columns we expect (from CLAUDE.md ACTUAL schema + user_id that migration added)
const EXPECT = {
  users:           ['id', 'email', 'name', 'goal', 'weight', 'plan', 'created_at', 'onboarding_completed'],
  user_profiles:   ['id', 'age', 'height_cm', 'gender', 'activity_level', 'target_weight_kg', 'daily_calorie', 'bmr', 'name', 'goal', 'plan', 'onboarding_completed'],
  food_logs:       ['id', 'user_id', 'food_name', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'meal_type', 'logged_at'],
  weight_logs:     ['id', 'user_id', 'weight_kg', 'bmi', 'logged_at'],
  workouts:        ['id', 'user_id', 'title', 'duration', 'completed', 'created_at'],
  workout_plans:   ['id', 'plan_name', 'goal_type', 'days_per_week', 'exercises', 'generated_by_ai', 'is_active'],
  daily_summaries: ['id', 'user_id', 'summary_date', 'calories_in', 'calories_out', 'workout_done', 'streak_day'],
  ai_chats:        ['id', 'user_id', 'message', 'role', 'created_at'],
}

let pass = 0, fail = 0
const issues = []

for (const [table, cols] of Object.entries(EXPECT)) {
  const { error, count } = await admin.from(table).select(cols.join(','), { count: 'exact', head: true })
  if (error) {
    console.log(`  FAIL ${table.padEnd(18)} ${error.message}`)
    issues.push(`${table}: ${error.message}`)
    fail++
  } else {
    console.log(`  OK   ${table.padEnd(18)} rows=${count ?? '?'}`)
    pass++
  }
}

console.log('\n[auth] admin.listUsers')
{
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 5 })
  if (error) { console.log('  FAIL', error.message); fail++ }
  else       { console.log(`  OK   total_users=${data.users.length}`); pass++ }
}

console.log('\n[anon] getSession')
{
  const { data, error } = await anon.auth.getSession()
  if (error) { console.log('  FAIL', error.message); fail++ }
  else       { console.log(`  OK   session=${data.session ? 'present' : 'null (expected)'}`); pass++ }
}

console.log('\n======================================================')
console.log(`  RESULT: ${pass} passed, ${fail} failed`)
if (issues.length) console.log('  ISSUES:\n   - ' + issues.join('\n   - '))
console.log('======================================================')
process.exit(fail === 0 ? 0 : 1)
