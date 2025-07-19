#!/usr/bin/env node

/**
 * Test script for the getResults function
 * 
 * This script demonstrates how to test the getResults functionality
 * by sending HTTP requests with different parameters.
 */

const http = require('http');

const BASE_URL = 'http://localhost:7071';

/**
 * Send HTTP request
 */
function sendRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 7071,
            path: endpoint,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && method === 'POST') {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = http.request(options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data && method === 'POST') {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

/**
 * Test the getResults function with different parameters
 */
async function testGetResults() {
    console.log('🧪 Testing getResults Function...\n');

    // Test 1: Get today's results (default)
    console.log('📅 Test 1: Getting today\'s results...');
    try {
        const response = await sendRequest('/api/getResults');
        
        if (response.status === 200) {
            console.log('✅ Success! Retrieved results:');
            console.log(`   Timestamp: ${response.data.timestamp}`);
            console.log(`   Date Range: ${response.data.requestParams.startDate} to ${response.data.requestParams.endDate}`);
            console.log(`   Game Types: ${JSON.stringify(response.data.requestParams.gameTypes)}`);
            console.log(`   Results Count: ${response.data.data?.data?.length || 0}`);
        } else {
            console.log('❌ Error:', response.status, response.data);
        }
    } catch (error) {
        console.log('💥 Request failed:', error.message);
    }
    
    console.log('');

    // Test 2: Get results for a specific date range
    console.log('📅 Test 2: Getting results for specific date range...');
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const today = new Date();
        
        const queryParams = new URLSearchParams({
            startDate: yesterday.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
            gameTypes: JSON.stringify([23]),
            offset: '0',
            count: '10'
        });
        
        const response = await sendRequest(`/api/getResults?${queryParams}`);
        
        if (response.status === 200) {
            console.log('✅ Success! Retrieved results:');
            console.log(`   Timestamp: ${response.data.timestamp}`);
            console.log(`   Date Range: ${response.data.requestParams.startDate} to ${response.data.requestParams.endDate}`);
            console.log(`   Offset: ${response.data.requestParams.offset}, Count: ${response.data.requestParams.count}`);
            console.log(`   Results Count: ${response.data.data?.data?.length || 0}`);
        } else {
            console.log('❌ Error:', response.status, response.data);
        }
    } catch (error) {
        console.log('💥 Request failed:', error.message);
    }
    
    console.log('');

    // Test 3: Test with POST method
    console.log('📅 Test 3: Testing with POST method...');
    try {
        const postData = {
            startDate: '2025-07-19',
            endDate: '2025-07-19',
            gameTypes: [23],
            offset: 0,
            count: 5
        };
        
        const response = await sendRequest('/api/getResults', 'POST', postData);
        
        if (response.status === 200) {
            console.log('✅ Success! Retrieved results via POST:');
            console.log(`   Timestamp: ${response.data.timestamp}`);
            console.log(`   Date Range: ${response.data.requestParams.startDate} to ${response.data.requestParams.endDate}`);
            console.log(`   Results Count: ${response.data.data?.data?.length || 0}`);
        } else {
            console.log('❌ Error:', response.status, response.data);
        }
    } catch (error) {
        console.log('💥 Request failed:', error.message);
    }
}

/**
 * Main test function
 */
async function runTests() {
    console.log('🚀 getResults Function Test Suite\n');
    console.log('Make sure your function app is running with: npm start\n');
    
    try {
        await testGetResults();
        
        console.log('✨ Tests completed!');
        console.log('\n📝 Notes:');
        console.log('   - The function fetches results from TVBet API');
        console.log('   - You can specify date ranges, game types, offset, and count');
        console.log('   - Both GET and POST methods are supported');
        console.log('   - Check the function logs for detailed request information');
        
    } catch (error) {
        console.error('💥 Test suite failed:', error);
    }
}

// Run the tests
runTests();
