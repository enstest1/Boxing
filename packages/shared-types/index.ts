export * from './feather-stub';
export * from './schema';

// API call helper
export const call = async <T>(
  endpoint: any,
  data?: any,
  options?: RequestInit
): Promise<T> => {
  try {
    // Use a relative URL - this avoids cross-origin issues in WSL
    let endpointStr = '';
    
    if (endpoint !== null && endpoint !== undefined) {
      // Force to string
      endpointStr = String(endpoint);
      
      // If it's not empty, ensure it has a leading slash
      if (endpointStr.length > 0) {
        if (endpointStr[0] !== '/') {
          endpointStr = '/' + endpointStr;
        }
      }
    }
    
    // Build the full URL - using relative URL will make the browser use the current origin
    const url = `/api${endpointStr}`;
    
    console.log('API call to:', url);
    
    // Build request options
    const requestOptions: RequestInit = {
      ...(options || {}),
      headers: {
        // Only set default Content-Type if not FormData and not already set
        ...(!(data instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(options?.headers || {})
      }
    };
    
    // If data is provided, add it as body with POST method
    if (data !== undefined && data !== null) {
      requestOptions.method = options?.method || 'POST';
      
      // Handle FormData separately (don't stringify)
      if (data instanceof FormData) {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
    }
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Basic response types
export interface SongUploadResponse {
  id: string;
  name: string;
  url: string;
}

export interface AnalysisResponse {
  id: string;
  songId: string;
  results: string;
}

export interface Combo {
  id: string;
  songId: string;
  sequence: string;
  description: string;
}

export interface CombosResponse {
  combos: Combo[];
}

// Request schema
export const regenerateCombosRequestSchema = {
  songId: "",
};