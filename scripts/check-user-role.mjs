import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read .env.local manually
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envLines = envContent.split('\n')

let supabaseUrl, supabaseKey
envLines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim()
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim()
  }
})

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUserRole() {
  const email = 'why@gmail.com'

  console.log(`\n🔍 Checking role for ${email}...\n`)

  try {
    // Get profile from database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('❌ Error fetching profile:', error.message)
      return
    }

    if (!profile) {
      console.error('❌ No profile found for', email)
      return
    }

    console.log('✅ Profile found:')
    console.log('  Email:', profile.email)
    console.log('  Full Name:', profile.full_name || '(not set)')
    console.log('  Role:', profile.role)
    console.log('  User ID:', profile.id)
    console.log('  Created:', new Date(profile.created_at).toLocaleString('zh-CN'))

    if (profile.role === 'seller') {
      console.log('\n✅ User is a SELLER - should have access to /seller')
    } else if (profile.role === 'admin') {
      console.log('\n✅ User is an ADMIN - should have access to /seller and /admin')
    } else {
      console.log('\n⚠️  User role is:', profile.role, '- needs to be "seller" or "admin" to access /seller')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkUserRole()
