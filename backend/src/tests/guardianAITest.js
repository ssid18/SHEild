const { chatWithGuardian } = require('../controllers/guardianAIController');
const { db } = require('../firebase');

// Mock request and response objects
const mockReq = {
  user: {
    uid: 'test-user-123'
  },
  body: {
    message: ''
  }
};

const mockRes = {
  json: (data) => {
    console.log('Response:', data);
    return data;
  },
  status: (code) => {
    console.log('Status Code:', code);
    return mockRes;
  }
};

// Test scenarios
const testScenarios = [
  {
    name: 'General Safety Check',
    message: "Hi Guardian, I'm feeling a bit nervous about walking home tonight."
  },
  {
    name: 'Emergency Situation',
    message: "I'm feeling unsafe right now, there's someone following me."
  },
  {
    name: 'Positive Response',
    message: "I'm doing great today, thanks for checking in!"
  },
  {
    name: 'Safety Tips Request',
    message: "Can you give me some safety tips for using public transport?"
  },
  {
    name: 'Emotional Support',
    message: "I'm feeling anxious about going out tonight."
  }
];

// Create test user profile
const setupTestUser = async () => {
  try {
    await db.collection('users').doc(mockReq.user.uid).set({
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date()
    });
    console.log('Test user profile created');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// Run tests
const runTests = async () => {
  console.log('Starting Guardian AI Chatbot Tests...\n');
  
  // Setup test user
  await setupTestUser();

  // Run each test scenario
  for (const scenario of testScenarios) {
    console.log(`\n=== Testing Scenario: ${scenario.name} ===`);
    console.log('User Message:', scenario.message);
    
    mockReq.body.message = scenario.message;
    await chatWithGuardian(mockReq, mockRes);
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\nAll tests completed!');
};

// Run the tests
runTests().catch(console.error); 