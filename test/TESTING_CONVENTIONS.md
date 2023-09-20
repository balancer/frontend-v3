# Testing overview

Check [testing doc](./TESTING.md) for instructions for running the different types of tests.

## What to test?

Testing software is complex and there is a lot of literature on the subject.

There are different types of tests with different characteristics and tradeoffs like shown in the
classical [testing pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) or in the
[testing trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications).

> People love debating what percentage of which type of tests to write, but it's a distraction.
> Nearly zero teams write expressive tests that establish clear boundaries, run quickly & reliably,
> and only fail for useful reasons. Focus on that instead.
>
> -- _Justin Searls_

We will start by focusing in unit tests (and some integration tests) so we need to find a sweet spot
where the testing DX is good enough to prevent a steep learning curve for any developer to start
contributing to the testing suite.

### Component vs Hook tests

We will use react testing library for both so we have custom helper functions for both cases:

Component tests: `renderHookWithDefaultProviders` Hook tests: `renderHookWithDefaultProviders`

Testing components requires interacting with the DOM though testing library utilities and the bigger
the component is, the slower and the more difficult to test and maintain. That's why, in case of
doubt, **it is better to focus on testing hooks** (much simpler to test) instead of trying to have
super complete Component tests that require deeper testing knowledge and skills.

Testing hooks independently of the components that use them, requires **extracting as much logic as
possible into a separate function (hook)**.

## Dependency injection

We can use dependency injection (DI) to explicitly inject mocks that replace our slow/complex
dependencies.

Clean architectures enable a proper unit testing strategy by separating the code in layers.
Simplifying a lot:

- one layer that handles the pure business logic (domain): fast code 🚀
- another layer that handles infrastructure code, the one that deals with network requests,
  file-systems, databases and so on: slow code 🐢

> [!IMPORTANT] The domain can be tested with fast unit tests where the infrastructure (AKA I/O)
> boundaries are replaced by "injected" mocks.

In our context, the 2 most important types of infrastructure dependencies are:

- Network requests (API GraphQL requests and other third party requests)
- Onchain calls (our contract interaction hooks use wagmi/viem that perform multiple RPC and WS
  requests underneath)

### Network request mocks (MSW)

We use MSW to mock every network request (excluding onchain ones) that our modules under tests
perform. If your test triggers a network request that is is not mocked yet, MSW will print a warning
to remind you to add a MSW handler for that concrete request.

- Most of our GraphQL queries/mutations run within an ApolloProvider. Our helper
  functions(`renderHookWithDefaultProviders` and `renderHookWithDefaultProviders`) use a default
  setup that allows apollo to use our MSW handlers.

- Any other explicit GraphQL and REST Api requests can be easily mocked by following a similar
  approach.

### Onchain calls

Using MSW handlers to mock any possible onchain request is not feasible. That's why we need to
explicitly mock those modules that depend on onchain calls.

How do you mock a dependency in react?

- Using vi.mock (AKA jest.mock in vitest) 👎
- Passing the module as a prop 👎
- Using a react context to provide the dependency 👍

The two first options have many disadvantages (that we will not cover in this document). Using a
react context is a little more verbose but, by far, the most powerful and flexible solution.
