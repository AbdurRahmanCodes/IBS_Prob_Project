"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider as ApolloProviderComponent } from "@apollo/client/react";
import { SetContextLink } from "@apollo/client/link/context";
import { useAuthStore } from "@/store/auth-store";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
});

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token;

  if (token) {
    return {
      headers: {
        ...prevContext.headers,
        authorization: `Bearer ${token}`,
      },
    };
  }

  // Do not attach an empty authorization header if no token exists
  return {
    headers: {
      ...prevContext.headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProviderComponent client={client}>{children}</ApolloProviderComponent>;
}
