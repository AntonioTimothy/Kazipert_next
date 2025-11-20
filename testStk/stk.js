const https = require('https');

class STKPushTester {
    constructor() {
        this.config = {
            // Updated URLs from your requirement
            authUrl: 'https://apps.nationalbank.co.ke/auth2/master/protocol/openid-connect/token',
            stkPushUrl: 'https://apps.nationalbank.co.ke/stk/stk_request',
            credentials: {
                clientId: 'MARTSTEC',
                clientSecret: '9aC8X0X!Z8$PUQb4fVQv1bgJkFJy',
                username: 'MARTSTEC',
                password: 'COt$2233B123#k12'
            }
        };
        
        this.accessToken = null;
    }

    // Generate Base64 encoded credentials (EXACTLY as in documentation)
    getBase64Credentials() {
        const credentials = `${this.config.credentials.clientId}:${this.config.credentials.clientSecret}`;
        return Buffer.from(credentials).toString('base64');
    }

    // Generate unique transaction reference
    generateTransactionReference() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `WA82-0UI1O-IOP9-${random}`;
    }

    // Get current date in ISO format
    getCurrentDate() {
        return new Date().toISOString();
    }

    // Make HTTPS request (both URLs are HTTPS)
    makeRequest(options, data = null) {
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
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
                        console.log('📄 Raw response that failed to parse:', responseData);
                        reject(new Error(`Failed to parse response: ${error.message}. Raw response: ${responseData}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request error: ${error.message} (code: ${error.code})`));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout after 30 seconds'));
            });

            // Set timeout
            req.setTimeout(30000);

            // For self-signed certificates, reject unauthorized
            req.setHeader('Connection', 'close');
            // Equivalent to -k flag in curl (bypass SSL verification)
            req.rejectUnauthorized = false;

            // Send data if provided
            if (data) {
                req.write(data);
            }

            req.end();
        });
    }

    // Step 1: Get Access Token (EXACTLY as in documentation)
    async getAccessToken() {
        console.log('🔐 STEP 1: Getting Access Token...');
        console.log(`📡 URL: ${this.config.authUrl}`);
        console.log(`🔑 Using Client ID: ${this.config.credentials.clientId}`);
        console.log(`🔑 Using Client Secret: ${this.config.credentials.clientSecret.substring(0, 10)}...`);
        
        try {
            // EXACTLY as in documentation: grant_type=client_credentials
            const formData = 'grant_type=client_credentials';
            
            const url = new URL(this.config.authUrl);
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // EXACT header from docs
                    'Authorization': `Basic ${this.getBase64Credentials()}`, // EXACT header from docs
                    'Content-Length': Buffer.byteLength(formData)
                },
                // SSL configuration equivalent to curl -k
                rejectUnauthorized: false
            };

            console.log(`🔧 Auth Request Headers:`, {
                'Content-Type': options.headers['Content-Type'],
                'Authorization': 'Basic [BASE64_REDACTED]',
                'Content-Length': options.headers['Content-Length']
            });
            console.log(`🔧 Auth Request Body: ${formData}`);

            const response = await this.makeRequest(options, formData);
            
            console.log(`📊 Auth Response Status: ${response.statusCode}`);
            
            if (response.statusCode >= 200 && response.statusCode < 300) {
                if (response.data && response.data.access_token) {
                    this.accessToken = response.data.access_token;
                    console.log('✅ Access Token Obtained Successfully!');
                    console.log(`📝 Token: ${this.accessToken.substring(0, 50)}...`);
                    console.log(`⏰ Expires in: ${response.data.expires_in} seconds`);
                    console.log(`🔧 Token Type: ${response.data.token_type}`);
                    if (response.data.scope) {
                        console.log(`🎯 Scope: ${response.data.scope}`);
                    }
                    return true;
                } else {
                    throw new Error('No access_token in response: ' + JSON.stringify(response.data));
                }
            } else {
                throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.log('❌ Failed to get Access Token');
            this.handleError(error);
            return false;
        }
    }

    // Step 2: Make STK Push Request (EXACTLY as in documentation)
    async makeSTKPushRequest() {
        console.log('\n💰 STEP 2: Making STK Push Request...');
        console.log(`📡 URL: ${this.config.stkPushUrl}`);

        // EXACT parameters from documentation with required fields
        const requestData = {
            accountReference: "20173154#MARTSTEC", // From docs
            businessShortCode: "625625", // From docs
            phoneNumber: "254726862144", // From docs
            requestDate: this.getCurrentDate(),
            transAmount: "1", // From docs
            transactionDesc: "Kazipert Registration", // From docs
            transactionReference: this.generateTransactionReference(),
            callbackurl: "https://kazipert.com/api/payment/mpesa-callback" // Required field
        };

        console.log('📦 STK Push Request Data (EXACT format from docs):');
        console.log(JSON.stringify(requestData, null, 2));
        console.log(`🔑 Using Token: ${this.accessToken.substring(0, 50)}...`);

        try {
            const jsonData = JSON.stringify(requestData);
            const url = new URL(this.config.stkPushUrl);
            
            // EXACT headers from documentation
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'accept': '*/*', // EXACT header from docs
                    'username': this.config.credentials.username, // EXACT header from docs
                    'password': this.config.credentials.password, // EXACT header from docs
                    'Content-Type': 'application/json', // EXACT header from docs
                    'Authorization': `Bearer ${this.accessToken}`, // EXACT header from docs
                    'Content-Length': Buffer.byteLength(jsonData)
                },
                // SSL configuration equivalent to curl -k
                rejectUnauthorized: false
            };

            console.log(`🔧 STK Request Headers (EXACT from docs):`, {
                'accept': '*/*', // EXACT header from docs
                'username': this.config.credentials.username, // EXACT header from docs
                'password': this.config.credentials.password, // EXACT header from docs
                'Content-Type': 'application/json', // EXACT header from docs
                'Authorization': `Bearer ${this.accessToken}`, // EXACT header from docs
                'Content-Length': Buffer.byteLength(jsonData)
            },);

            const response = await this.makeRequest(options, jsonData);
            
            console.log(`📊 STK Response Status: ${response.statusCode}`);
            
            if (response.statusCode >= 200 && response.statusCode < 300) {
                console.log('✅ STK Push Request Successful!');
                console.log('📋 Response Data:');
                console.log(JSON.stringify(response.data, null, 2));
                return response.data;
            } else {
                throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.log('❌ STK Push Request Failed', error);
            this.handleError(error);
            return null;
        }
    }

    // Test connectivity
    async testConnectivity() {
        console.log('🌐 Testing Connectivity...');
        
        try {
            // Test auth endpoint
            console.log(`🔍 Testing Auth endpoint: ${this.config.authUrl}`);
            const authUrl = new URL(this.config.authUrl);
            const authOptions = {
                hostname: authUrl.hostname,
                port: authUrl.port || 443,
                path: authUrl.pathname,
                method: 'GET',
                timeout: 10000,
                rejectUnauthorized: false
            };

            const authResponse = await this.makeRequest(authOptions);
            console.log(`✅ Authentication endpoint is reachable (Status: ${authResponse.statusCode})`);
            
            // Test STK Push endpoint
            console.log(`🔍 Testing STK Push endpoint: ${this.config.stkPushUrl}`);
            const stkUrl = new URL(this.config.stkPushUrl);
            const stkOptions = {
                hostname: stkUrl.hostname,
                port: stkUrl.port || 443,
                path: stkUrl.pathname,
                method: 'GET',
                timeout: 10000,
                rejectUnauthorized: false
            };

            const stkResponse = await this.makeRequest(stkOptions);
            console.log(`✅ STK Push endpoint is reachable (Status: ${stkResponse.statusCode})`);
            
            return true;
        } catch (error) {
            console.log('❌ Connectivity test failed');
            console.log('💡 Please check:');
            console.log('   - Network connectivity');
            console.log('   - Internet access to apps.nationalbank.co.ke');
            console.log('   - DNS resolution');
            console.log('   - Firewall/proxy settings');
            this.handleError(error);
            return false;
        }
    }

    // Handle errors with detailed information
    handleError(error) {
        console.log(`🚨 Error Details:`);
        console.log(`   Message: ${error.message}`);
        
        if (error.code) {
            console.log(`   System Code: ${error.code}`);
        }
        
        if (error.response) {
            console.log(`   Response Status: ${error.response.statusCode}`);
            console.log(`   Response Data: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        
        // Log stack trace for debugging
        console.log(`   Stack: ${error.stack}`);
    }

    // Main test function
    async runTest() {
        console.log('🚀 ==========================================');
        console.log('🚀 STK PUSH API TEST STARTING');
        console.log('🚀 ==========================================');
        console.log(`🕐 Started at: ${new Date().toISOString()}`);
        console.log('🔧 Configuration (VERIFIED AGAINST DOCS):');
        console.log(`   Auth URL: ${this.config.authUrl}`);
        console.log(`   STK URL: ${this.config.stkPushUrl}`);
        console.log(`   Client ID: ${this.config.credentials.clientId}`);
        console.log(`   Username: ${this.config.credentials.username}`);
        console.log(`   Password: ${this.config.credentials.password ? 'SET' : 'NOT SET'}`);
        console.log('');

        // Test connectivity first
        const isConnected = await this.testConnectivity();
        if (!isConnected) {
            console.log('❌ Exiting due to connectivity issues');
            process.exit(1);
        }

        // Get access token
        const tokenSuccess = await this.getAccessToken();
        if (!tokenSuccess || !this.accessToken) {
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
            
            // Check response format
            if (stkResponse.responseCode === '0') {
                console.log('🎉 Payment request accepted for processing');
            } else if (stkResponse.responseCode) {
                console.log(`⚠️  API Response Code: ${stkResponse.responseCode}`);
                console.log(`📝 API Message: ${stkResponse.responseMessage}`);
                
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