import { HttpLink, split } from "@apollo/client"
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"
import { createClient } from "graphql-ws"

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.APOLLO_SUBSCRIPTION_URL || "ws://localhost:8000/graphql",
    keepAlive: 5_000, // ping server every 5 seconds
  })
)

const httpLink = new HttpLink({
  uri: process.env.APOLLO_ROUTER_URL || "http://localhost:4000",
  fetchOptions: { cache: "no-store" },
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    const isSubscription =
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"

    return isSubscription
  },
  wsLink,
  httpLink
)

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  })
})
