import { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const apiUrl = "http://localhost:8000";

export async function client(endpoint: string, config: RequestInit = {}) {
  const response = await fetch(`${apiUrl}/${endpoint}`, config);
  if (response.status === 401) {
    return Promise.reject({ message: `Please re-authenticate` });
  }

  try {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export function useAuthClient() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useCallback(
    async (endpoint: string, body?: any, config: RequestInit = {}) => {
      if (body) {
        config = {
          body: JSON.stringify(body),
          method: "POST",
          ...config,
          headers: {
            "content-type": "application/json",
            ...config.headers,
          },
        };
      }

      const accessToken = isAuthenticated
        ? await getAccessTokenSilently()
        : undefined;
      if (accessToken) {
        config = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      }

      return client(endpoint, config);
    },
    [getAccessTokenSilently, isAuthenticated]
  );
}
