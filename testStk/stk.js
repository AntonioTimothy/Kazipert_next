const https = require('https');
const http = require('http');

class STKPushTester {
    constructor() {
        this.config = {
            authUrl: 'http://172.16.200.51:9110/auth2/realms/master/protocol/openid-connect/token',
            stkPushUrl: 'http://172.16.200.51/stk_push/stk_request',
            credentials: {
                clientId: 'TEST',
                clientSecret: 'AINpW0FFvp09kuLhz9eBdjyngyY9LNok',
                username: 'test',
                password: 'test'
            }
        };
        
        this.accessToken = null;
    }

    // Generate Base64 encoded credentials
    getBase64Credentials() {
        const credentials = `${this.config.credentials.clientId}:${this.config.credentials.clientSecret}`;
        return Buffer.from(credentials).toString('base64');
    }

    // Generate unique transaction reference
    generateTransactionReference() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TEST${timestamp}${random}`;
    }

    // Get current date in ISO format
    getCurrentDate() {
        return new Date().toISOString();
    }

    // Make HTTP request using Node.js built-in http/https
    makeRequest(options, data = null) {
        return new Promise((resolve, reject) => {
            const lib = options.protocol === 'https:' ? https : http;
            
            const req = lib.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    try {
                        const parsedData = responseData ? JSON.parse(responseData) : {};
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: parsedData
                        });
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            // Set timeout
            req.setTimeout(30000);

            // Send data if provided
            if (data) {
                req.write(data);
            }

            req.end();
        });
    }

    // Step 1: Get Access Token
    async getAccessToken() {
        console.log('🔐 STEP 1: Getting Access Token...');
        console.log(`📡 URL: ${this.config.authUrl}`);
        
        try {
            const formData = `grant_type=client_credentials`;
            
            const url = new URL(this.config.authUrl);
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${this.getBase64Credentials()}`,
                    'Content-Length': Buffer.byteLength(formData)
                }
            };

            const response = await this.makeRequest(options, formData);
            
            if (response.statusCode >= 200 && response.statusCode < 300) {
                this.accessToken = response.data.access_token;
                console.log('✅ Access Token Obtained Successfully!');
                console.log(`📝 Token: ${this.accessToken ? this.accessToken.substring(0, 50) + '...' : 'NULL'}`);
                console.log(`⏰ Expires in: ${response.data.expires_in} seconds`);
                console.log(`🔧 Token Type: ${response.data.token_type}`);
                return true;
            } else {
                throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.log('❌ Failed to get Access Token');
            this.handleError(error);
            return false;
        }
    }

    // Step 2: Make STK Push Request
    async makeSTKPushRequest() {
        console.log('\n💰 STEP 2: Making STK Push Request...');
        console.log(`📡 URL: ${this.config.stkPushUrl}`);

        const requestData = {
            accountReference: "9810173719",
            businessShortCode: "174379",
            phoneNumber: "254726862144",
            requestDate: this.getCurrentDate(),
            transAmount: "1",
            transactionDesc: "Payment of registration",
            transactionReference: this.generateTransactionReference(),
            callbackurl: "https://kazipert.com/api/stk_push_callback"
        };

        console.log('📦 Request Data:');
        console.log(JSON.stringify(requestData, null, 2));

        try {
            const jsonData = JSON.stringify(requestData);
            const url = new URL(this.config.stkPushUrl);
            
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'username': this.config.credentials.username,
                    'password': this.config.credentials.password,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Length': Buffer.byteLength(jsonData)
                }
            };

            const response = await this.makeRequest(options, jsonData);
            
            if (response.statusCode >= 200 && response.statusCode < 300) {
                console.log('✅ STK Push Request Successful!');
                console.log('📋 Response:');
                console.log(JSON.stringify(response.data, null, 2));
                return response.data;
            } else {
                throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.log('❌ STK Push Request Failed');
            this.handleError(error);
            return null;
        }
    }

    // Test connectivity
    async testConnectivity() {
        console.log('🌐 Testing Connectivity...');
        
        try {
            // Test auth endpoint
            const authUrl = new URL(this.config.authUrl);
            const authOptions = {
                hostname: authUrl.hostname,
                port: authUrl.port,
                path: authUrl.pathname,
                method: 'GET',
                timeout: 10000
            };

            await this.makeRequest(authOptions);
            console.log('✅ Authentication endpoint is reachable');
            
            // Test STK Push endpoint
            const stkUrl = new URL(this.config.stkPushUrl);
            const stkOptions = {
                hostname: stkUrl.hostname,
                port: stkUrl.port,
                path: stkUrl.pathname,
                method: 'GET',
                timeout: 10000
            };

            await this.makeRequest(stkOptions);
            console.log('✅ STK Push endpoint is reachable');
            
            return true;
        } catch (error) {
            console.log('❌ Connectivity test failed');
            console.log('💡 Please check:');
            console.log('   - Network connectivity');
            console.log('   - Firewall settings');
            console.log('   - Server availability');
            console.log(`   - Error: ${error.message}`);
            return false;
        }
    }

    // Handle errors
    handleError(error) {
        console.log(`🚨 Error: ${error.message}`);
        
        if (error.code) {
            console.log(`🔧 Error Code: ${error.code}`);
        }
        
        if (error.response) {
            console.log(`📊 Response Status: ${error.response.statusCode}`);
            console.log(`📝 Response Data: ${JSON.stringify(error.response.data, null, 2)}`);
        }
    }

    // Main test function
    async runTest() {
        console.log('🚀 ==========================================');
        console.log('🚀 STK PUSH API TEST STARTING');
        console.log('🚀 ==========================================');
        console.log(`🕐 Started at: ${new Date().toISOString()}`);
        console.log('🔧 Configuration:');
        console.log(`   Auth URL: ${this.config.authUrl}`);
        console.log(`   STK URL: ${this.config.stkPushUrl}`);
        console.log(`   Client ID: ${this.config.credentials.clientId}`);
        console.log('');

        // Test connectivity first
        const isConnected = await this.testConnectivity();
        if (!isConnected) {
            console.log('❌ Exiting due to connectivity issues');
            process.exit(1);
        }

        // Get access token
        const tokenSuccess = await this.getAccessToken();
        if (!tokenSuccess) {
            console.log('❌ Exiting due to authentication failure');
            process.exit(1);
        }

        // Make STK Push request
        const stkResponse = await this.makeSTKPushRequest();
        
        console.log('\n🎯 ==========================================');
        console.log('🎯 TEST SUMMARY');
        console.log('🎯 ==========================================');
        
        if (stkResponse) {
            console.log('✅ STK Push Test: SUCCESS');
            console.log(`📱 Check phone 254721506974 for MPESA prompt`);
            
            if (stkResponse.responseCode === '0') {
                console.log('🎉 Payment request accepted for processing');
            } else {
                console.log(`⚠️  Response Code: ${stkResponse.responseCode}`);
                console.log(`📝 Message: ${stkResponse.responseMessage}`);
                
                if (stkResponse.customerMessage) {
                    console.log(`📱 Customer Message: ${stkResponse.customerMessage}`);
                }
            }
        } else {
            console.log('❌ STK Push Test: FAILED');
        }

        console.log(`🕐 Finished at: ${new Date().toISOString()}`);
        console.log('🎯 ==========================================\n');
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.log('🚨 Uncaught Exception:');
    console.log(error.message);
    console.log(error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('🚨 Unhandled Rejection at:', promise);
    console.log('Reason:', reason);
    process.exit(1);
});

// Main execution
async function main() {
    const tester = new STKPushTester();
    await tester.runTest();
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(error => {
        console.log('🚨 Fatal error in main function:');
        console.log(error.message);
        console.log(error.stack);
        process.exit(1);
    });
}

module.exports = STKPushTester;