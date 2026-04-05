import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
supabase.from('users').select('count').then(({ data, error }) => {
  if (error) {
    console.log('ไม่สามารถเชื่อมต่อ Supabase ได้', error.message)
  } else {
    console.log('เชื่อมต่อ Supabase สำเร็จ')
  }
})
