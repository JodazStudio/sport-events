import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUser(email) {
  console.log(`Checking user: ${email}...`);
  
  // 1. Check in Auth
  const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error listing users:', authError.message);
    return;
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error('❌ User NOT FOUND in Supabase Auth.');
    console.log('Suggestions:');
    console.log('1. Go to Supabase Dashboard -> Authentication -> Users');
    console.log('2. Click "Add user" -> "Create new user"');
    console.log('3. Ensure "Auto-confirm user?" is CHECKED.');
    return;
  }
  
  console.log('✅ User found in Supabase Auth.');
  console.log('User ID:', user.id);
  console.log('Email Confirmed:', user.email_confirmed_at ? 'Yes' : '❌ NO');
  
  if (!user.email_confirmed_at) {
    console.log('Action: Confiming user...');
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email_confirm: true
    });
    if (updateError) console.error('Error confirming user:', updateError.message);
    else console.log('✅ User confirmed successfully.');
  }

  // 2. Check in managers table
  const { data: manager, error: dbError } = await supabaseAdmin
    .from('managers')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (dbError) {
    console.error('❌ User NOT FOUND in public.managers table.');
    console.log('Action: Creating manager record...');
    const { error: insertError } = await supabaseAdmin
      .from('managers')
      .insert({
        id: user.id,
        name: user.user_metadata?.name || 'Admin User',
        email: user.email
      });
      
    if (insertError) console.error('Error creating manager:', insertError.message);
    else console.log('✅ Manager record created.');
  } else {
    console.log('✅ Manager record found.');
  }
}

const emailToCheck = process.argv[2];
if (!emailToCheck) {
  console.log('Please provide an email: node scripts/check-auth.mjs your@email.com');
} else {
  checkUser(emailToCheck);
}
