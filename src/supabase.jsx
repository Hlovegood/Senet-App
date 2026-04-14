import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://mtqhstpbnpguqqptdzmn.supabase.co'
const supabaseKey = "sb_publishable_OD-xQPNftm5p5_h-qit_Uw_S6DNuW2O"
export const supabase = createClient(supabaseUrl, supabaseKey)