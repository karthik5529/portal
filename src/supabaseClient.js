// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uqsmfllprpzghhedqmhx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxc21mbGxwcnB6Z2hoZWRxbWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzAxODUsImV4cCI6MjA3MTgwNjE4NX0.l0SOHB38-uCc4-7O0DO3GipHNjT3lq1MxE4LweBsEBk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
