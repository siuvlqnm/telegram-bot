export async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
       const response = await fetch(url, options);
       if (!response.ok) {
           throw new Error(`API Error: ${response.status} - ${response.statusText}`);
       }
       return await response.json() as T;
    } catch(error){
        console.error("API Error:", error);
        throw error;
    }
  }