import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Extract backend error message from common Django REST formats
      const backendError = 
        error.response.data?.detail ||
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;
      
      return Promise.reject(new Error(backendError));
    }
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Add response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error: unknown) => {
//     if (axios.isAxiosError(error)) {
//       const errorData = error.response?.data as 
//         | { detail?: string }
//         | { [key: string]: string[] } // For field errors like {"date": ["error"]}
//         | string;

//       console.groupCollapsed(`API Error: ${error.config?.url}`);
//       console.error("Status:", error.response?.status);

//       // Handle Django validation errors
//       if (errorData && typeof errorData === 'object' && !Array.isArray(errorData)) {
//         // Type-safe field error extraction
//         const fieldErrors = Object.values(errorData);
//         if (fieldErrors.length > 0 && Array.isArray(fieldErrors[0])) {
//           const firstErrorArray = fieldErrors[0] as string[];
//           if (firstErrorArray.length > 0) {
//             const validationError = firstErrorArray[0];
//             console.error("Validation Error:", validationError);
//             return Promise.reject(new Error(validationError));
//           }
//         }

//         // Handle standard DRF detail errors
//         if ('detail' in errorData && typeof errorData.detail === 'string') {
//           return Promise.reject(new Error(errorData.detail));
//         }
//       }

//       // Handle string errors
//       if (typeof errorData === 'string') {
//         return Promise.reject(new Error(errorData));
//       }

//       console.groupEnd();
//       return Promise.reject(new Error(error.message));
//     }
    
//     return Promise.reject(error instanceof Error ? error : new Error('Unknown error'));
//   }
// );
// export default api;