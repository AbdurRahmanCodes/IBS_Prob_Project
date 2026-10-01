"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider as ApolloProviderComponent } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProviderComponent client={client}>{children}</ApolloProviderComponent>;
}
