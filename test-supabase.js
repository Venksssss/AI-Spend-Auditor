const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://iolrmjsblbtegtrystca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbHJtanNibGJ0ZWd0cnlzdGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MjI0NTIsImV4cCI6MjA5Mzk5ODQ1Mn0.HIWCEjHW7jPGZApc22NHXVB79QdPcLwrDy4k5qaT5Ko'
)

async function test() {
  const { data, error } = await supabase.from('audits').select('*').limit(1)
  console.log('data:', data)
  console.log('error:', error)
}

test()