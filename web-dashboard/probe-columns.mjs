import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()] })
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const PROBES = {
  user_profiles:   ['id','name','goal','weight','plan','onboarding_completed','age','height_cm','gender','activity_level','target_weight_kg','daily_calorie','bmr'],
  food_logs:       ['id','user_id','food_name','calories','protein_g','carbs_g','fat_g','meal_type','logged_at'],
  weight_logs:     ['id','user_id','weight_kg','bmi','logged_at'],
  daily_summaries: ['id','user_id','summary_date','calories_in','calories_out','workout_done','streak_day'],
  workouts:        ['id','user_id','title','duration','completed','created_at'],
  ai_chats:        ['id','user_id','message','role','created_at'],
}

for (const [tbl, cols] of Object.entries(PROBES)) {
  console.log(`\n=== ${tbl} ===`)
  for (const c of cols) {
    const { error } = await db.from(tbl).select(c).limit(1)
    const msg = error ? (error.message || JSON.stringify(error)) : 'ok'
    console.log(`  ${c.padEnd(22)} ${msg}`)
  }
}
