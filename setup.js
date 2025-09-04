const fs = require('fs');
const path = require('path');

// Create .env file for backend
const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/message_app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development`;

const envPath = path.join(__dirname, 'backend', '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created backend/.env file');
} else {
  console.log('⚠️  backend/.env already exists');
}

console.log('\n🚀 Setup complete!');
console.log('\nNext steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Run: npm run install-all');
console.log('3. Run: npm run dev');
console.log('\nThe application will be available at:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend: http://localhost:5000');
