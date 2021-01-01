import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

function AuthProvider({ children }: PropsWithChildren<{}>) {
  return (
    <Auth0Provider
      domain="necromunda.eu.auth0.com"
      clientId="b7ygyG8tVEzTFBGwGkVIirZX0FrCQWrg"
      redirectUri={window.location.origin}
      audience="https://necromunda.alexmarshall.com"
      children={children}
    />
  );
}

const queryClient = new QueryClient();

function ReactQueryProvider({ children }: PropsWithChildren<{}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default function AppProviders({ children }: PropsWithChildren<{}>) {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <ChakraProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ChakraProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
}
