// lib/pesapal.ts - Pesapal API v3 Client Utilities

/**
 * Pesapal API v3 Integration
 * Documentation: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json
 */

// Environment configuration
const PESAPAL_CONFIG = {
  consumerKey: 'm8Sn4DxB87FduyNrlLb/4tbNE7pVz6rn',
  consumerSecret: 'G7MuYmn6weGqArJYuEdVo2r1rGU=',
  ipnId: '', // Force regeneration of IPN ID for Live environment
  baseUrl: 'https://pay.pesapal.com/v3',
  callbackUrl: process.env.PESAPAL_CALLBACK_URL || 'https://kazipert.com/api/payment/pesapal/callback',
  ipnUrl: process.env.PESAPAL_IPN_URL || 'https://kazipert.com/api/payment/pesapal/ipn',
};

// Type definitions
export interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
  error: string | null;
  status: string;
  message: string;
}

export interface PesapalOrderRequest {
  id: string; // Merchant reference (unique)
  currency: string; // ISO currency code (e.g., 'OMR', 'KES')
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string; // IPN ID
  branch?: string;
  billing_address: {
    email_address?: string;
    phone_number?: string;
    country_code?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: string | null;
  status: string;
}

export interface PesapalTransactionStatus {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error: {
    error_type: string | null;
    code: string | null;
    message: string | null;
    call_back_url: string | null;
  };
  status: string;
}

export interface PesapalIPNRegistration {
  url: string;
  ipn_notification_type: 'GET' | 'POST';
}

export interface PesapalIPNResponse {
  ipn_id: string;
  url: string;
  created_date: string;
  ipn_notification_type: string;
  ipn_status: string;
  error: string | null;
  status: string;
}

// Token cache
let cachedToken: { token: string; expiryDate: Date } | null = null;

/**
 * Get OAuth bearer token from Pesapal
 * Caches token until expiry
 */
export async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiryDate > new Date()) {
    return cachedToken.token;
  }

  const url = `${PESAPAL_CONFIG.baseUrl}/api/Auth/RequestToken`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: PESAPAL_CONFIG.consumerKey,
      consumer_secret: PESAPAL_CONFIG.consumerSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pesapal auth failed: ${response.statusText}`);
  }

  const data: PesapalAuthResponse = await response.json();

  console.log('🔐 Pesapal Auth Response:', JSON.stringify(data, null, 2));

  if (data.error || data.status !== '200') {
    const errorMessage = typeof data.error === 'object'
      ? JSON.stringify(data.error)
      : (data.error || data.message);
    console.error('❌ Pesapal Auth Error:', errorMessage);
    throw new Error(`Pesapal auth error: ${errorMessage}`);
  }

  // Cache the token
  cachedToken = {
    token: data.token,
    expiryDate: new Date(data.expiryDate),
  };

  return data.token;
}

/**
 * Submit payment order to Pesapal
 * Returns redirect URL for customer to complete payment
 */
export async function submitOrder(
  orderData: PesapalOrderRequest
): Promise<PesapalOrderResponse> {
  const token = await getAuthToken();
  const url = `${PESAPAL_CONFIG.baseUrl}/api/Transactions/SubmitOrderRequest`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Pesapal order submission failed: ${response.statusText}`);
  }

  const data: PesapalOrderResponse = await response.json();

  console.log('📦 Pesapal Order Response:', JSON.stringify(data, null, 2));

  if (data.error || data.status !== '200') {
    const errorMessage = typeof data.error === 'object'
      ? JSON.stringify(data.error)
      : (data.error || 'Unknown error');
    console.error('❌ Pesapal Order Error:', errorMessage);
    throw new Error(`Pesapal order error: ${errorMessage}`);
  }

  return data;
}

/**
 * Get transaction status from Pesapal
 */
export async function getTransactionStatus(
  orderTrackingId: string
): Promise<PesapalTransactionStatus> {
  const token = await getAuthToken();
  const url = `${PESAPAL_CONFIG.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Pesapal status check failed: ${response.statusText}`);
  }

  const data: PesapalTransactionStatus = await response.json();

  return data;
}

/**
 * Register IPN URL with Pesapal
 * This is a one-time setup operation
 */
export async function registerIPN(
  ipnData: PesapalIPNRegistration
): Promise<PesapalIPNResponse> {
  const token = await getAuthToken();
  const url = `${PESAPAL_CONFIG.baseUrl}/api/URLSetup/RegisterIPN`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(ipnData),
  });

  if (!response.ok) {
    throw new Error(`Pesapal IPN registration failed: ${response.statusText}`);
  }

  const data: PesapalIPNResponse = await response.json();

  if (data.error || data.status !== '200') {
    throw new Error(`Pesapal IPN error: ${data.error || 'Unknown error'}`);
  }

  return data;
}

/**
 * Get list of registered IPNs
 */
export async function getRegisteredIPNs(): Promise<PesapalIPNResponse[]> {
  const token = await getAuthToken();
  const url = `${PESAPAL_CONFIG.baseUrl}/api/URLSetup/GetIpnList`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Pesapal get IPNs failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Ensure IPN ID is available, registering if necessary
 */
export async function ensureIpnId(): Promise<string> {
  if (PESAPAL_CONFIG.ipnId) {
    return PESAPAL_CONFIG.ipnId;
  }

  console.log('⚠️ IPN ID not found in config, attempting to register...');

  try {
    const ipnResponse = await registerIPN({
      url: PESAPAL_CONFIG.ipnUrl,
      ipn_notification_type: 'POST'
    });

    // Update config in memory
    PESAPAL_CONFIG.ipnId = ipnResponse.ipn_id;
    console.log('✅ IPN registered successfully:', PESAPAL_CONFIG.ipnId);

    return PESAPAL_CONFIG.ipnId;
  } catch (error) {
    console.error('❌ Failed to auto-register IPN:', error);
    throw error;
  }
}

/**
 * Helper function to create order request
 */
export function createOrderRequest(
  userId: string,
  userEmail: string,
  userPhone: string,
  userName: string,
  amount: number,
  currency: string = 'KES',
  ipnId?: string
): PesapalOrderRequest {
  const merchantReference = `EMP-VER-${userId}-${Date.now()}`;

  const orderRequest: PesapalOrderRequest = {
    id: merchantReference,
    currency: currency,
    amount: amount,
    description: 'Kazipert Employer Verification Fee',
    callback_url: PESAPAL_CONFIG.callbackUrl,
    notification_id: ipnId || PESAPAL_CONFIG.ipnId,
    branch: 'Kazipert Platform',
    billing_address: {
      email_address: userEmail,
      phone_number: userPhone,
      country_code: 'KE', // Kenya for test
      first_name: userName.split(' ')[0] || '',
      last_name: userName.split(' ').slice(1).join(' ') || '',
    },
  };

  console.log('📝 Creating Pesapal Order Request:', JSON.stringify(orderRequest, null, 2));

  return orderRequest;
}

/**
 * Check if payment is successful based on status code
 */
export function isPaymentSuccessful(statusCode: string): boolean {
  // Pesapal status codes:
  // 0 = Invalid
  // 1 = Completed
  // 2 = Failed
  // 3 = Reversed
  return statusCode === '1';
}

/**
 * Get payment status description
 */
export function getPaymentStatusDescription(statusCode: string): string {
  const statusMap: Record<string, string> = {
    '0': 'Invalid',
    '1': 'Completed',
    '2': 'Failed',
    '3': 'Reversed',
  };
  return statusMap[statusCode] || 'Unknown';
}

export default {
  getAuthToken,
  submitOrder,
  getTransactionStatus,
  registerIPN,
  getRegisteredIPNs,
  createOrderRequest,
  isPaymentSuccessful,
  getPaymentStatusDescription,
};
