const bcrypt = require('bcrypt');

// Replace 'your-password-here' with your desired password
const password = process.argv[2] || 'admin123';

async function hashPassword() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Your hashed password:');
    console.log(hashedPassword);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

hashPassword(); 