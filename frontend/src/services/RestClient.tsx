// RestService.ts
import axios, { AxiosRequestConfig, Method } from 'axios';

// Defining the structure for endpoint configuration
interface EndpointConfig {
  url: string;
  method: Method;
}

class RestClient {
  private endpoints: Map<string, EndpointConfig> = new Map();

  private static instance: RestClient;

  // Method to register an endpoint
  registerEndpoint(key: string, config: EndpointConfig): void {
    this.endpoints.set(key, config);
  }

  // Singleton implementation
  static getInstance = () => {
    if (!RestClient.instance) {
      RestClient.instance = new RestClient();
    }
    return RestClient.instance;
  };

  // Method to make a request to a registered endpoint
  async makeRequest<T>(key: string, requestData?: any, queryParams?: Record<string,any>): Promise<T> {
    const endpoint = this.endpoints.get(key);
    if (!endpoint) {
      throw new Error(`Endpoint with key "${key}" not found.`);
    }

    const config: AxiosRequestConfig = {
      url: endpoint.url,
      method: endpoint.method,
      params: queryParams,
    };


    // Add request body for POST requests
    if (endpoint.method === 'POST' && requestData) {
      config.data = requestData;
      console.log("Request Data:" + config.data);
    }

    try {
      const response = await axios(config);
      console.log(response.request)
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default RestClient;

//USAGE
// // For a GET request
// restService.makeRequest<User>('getUser')
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// // For a POST request
// const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
// restService.makeRequest<User>('createUser', newUser)
//   .then(data => console.log(data))
//   .catch(error => console.error(error));
