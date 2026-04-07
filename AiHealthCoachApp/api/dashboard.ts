import { supabase } from "./supabase";

export const getDashboardData = async (userId: string) => {
  // ดึงข้อมูลสรุปรายวัน
  const { data: summary, error: summaryError } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', userId)
    .single();

  // ดึงค่า BMI ล่าสุดจาก weight_logs
  const { data: weightLog, error: weightError } = await supabase
    .from('weight_logs')
    .select('bmi')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(1)
    .single();

  if (summaryError || weightError) {
    console.error("Error fetching dashboard:", summaryError || weightError);
    return null;
  }

  return {
    ...summary,
    current_bmi: weightLog?.bmi || 0
  };
};