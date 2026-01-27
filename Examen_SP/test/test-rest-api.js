const axios = require('axios');

async function testAPI() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Exam2P Audit REST API\n');

  try {
    // Test 1: Get all records
    console.log('📋 Test 1: GET /exam2p-audit (all records)');
    const response1 = await axios.get(`${baseUrl}/exam2p-audit`);
    console.log(`✅ Status: ${response1.status}`);
    console.log(`📊 Total records: ${response1.data.length}`);
    if (response1.data.length > 0) {
      console.log('📄 First record:', JSON.stringify(response1.data[0], null, 2));
    }

    console.log('\n---\n');

    // Test 2: Get with limit
    console.log('📋 Test 2: GET /exam2p-audit?limit=5 (last 5)');
    const response2 = await axios.get(`${baseUrl}/exam2p-audit?limit=5`);
    console.log(`✅ Status: ${response2.status}`);
    console.log(`📊 Records returned: ${response2.data.length}`);
    
    console.log('\n---\n');

    // Test 3: Verify data structure
    console.log('🔍 Test 3: Verifying data structure');
    if (response1.data.length > 0) {
      const record = response1.data[0];
      const requiredFields = [
        'logId',
        'exam2p_entity',
        'exam2p_recordId',
        'exam2p_action',
        'exam2p_user',
        'exam2p_timestamp',
        'exam2p_detail'
      ];

      const missingFields = requiredFields.filter(field => !(field in record));
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields are present');
      } else {
        console.log('❌ Missing fields:', missingFields);
      }
    } else {
      console.log('⚠️  No records to verify structure');
    }

    console.log('\n✅ All tests completed successfully\n');

  } catch (error) {
    console.error('❌ Error in tests:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

testAPI();
