export interface FeatherCallOptions {
  url: string; // e.g. /api/v1/songs
  method: 'GET' | 'POST';
  data?: any; // JSON or FormData
  headers?: Record<string, string>;
}

export interface FeatherCallResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export class FeatherError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`Feather API call failed with status ${status}`);
    this.status = status;
    this.data = data;
  }
}

export async function call<T = any>(
  opts: FeatherCallOptions
): Promise<FeatherCallResponse<T>> {
  // This is a stub implementation - in production, this would be replaced
  // with the actual implementation from the Feather SDK
  try {
    // Mock implementation for local development/testing
    const response = await fetch(opts.url, {
      method: opts.method,
      headers: opts.headers,
      body: opts.data instanceof FormData ? opts.data : JSON.stringify(opts.data),
    });

    const responseData = await response.json();
    const headers: Record<string, string> = {};
    
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    if (!response.ok) {
      throw new FeatherError(response.status, responseData);
    }

    return {
      status: response.status,
      data: responseData,
      headers,
    };
  } catch (error) {
    if (error instanceof FeatherError) {
      throw error;
    }
    throw new Error(`Feather API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}