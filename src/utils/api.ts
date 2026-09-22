import { auth } from '../config/firebase';

const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * A wrapper around the native fetch API that automatically injects the Firebase
 * ID token into the Authorization header for authenticated requests.
 * 
 * @param endpoint The API endpoint (e.g., '/patient/profile')
 * @param options Standard fetch options (method, body, headers, etc.)
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Ensure the user is logged in
  const user = auth.currentUser;
  let token = '';
  
  if (user) {
    try {
      token = await user.getIdToken();
    } catch (e) {
      console.error('Failed to get Firebase ID token:', e);
    }
  }

  // Set up the default headers, merging in any custom headers provided
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Construct the full URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Execute the fetch request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Automatically throw on standard HTTP errors to mimic axios behavior
  // Note: We leave it to the caller to handle the error or parse the JSON response
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parse errors for non-JSON error responses
    }
    
    throw new Error(
      errorData?.detail?.error || errorData?.detail || response.statusText || 'API Request Failed'
    );
  }

  return response.json();
}
