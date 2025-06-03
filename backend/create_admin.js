// Generate password hash for admin user
// Run with: node hash_password.js

const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'pwd1234';
  const saltRounds = 12;
  
  console.log('🔄 Generating hash for password:', password);
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('✅ Generated hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Hash verification:', isValid ? 'PASSED' : 'FAILED');
    
    console.log('\n📋 SQL command to update admin password:');
    console.log(`UPDATE teachers SET password_hash = '${hash}', must_change_password = false WHERE username = 'admin';`);
    
  } catch (error) {
    console.error('❌ Error generating hash:', error);
  }
}

generateHash();