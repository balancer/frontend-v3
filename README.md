# Balancer frontend V3

## Getting Started

_This project uses `pnpm`, if you haven't already installed it you can find the documentation here:
https://pnpm.io/installation_

To setup the development environment, first clone the repo:

```bash
git clone https://github.com/balancer/frontend-v3.git && cd frontend-v3
```

Make sure that `.env.local` file exists in the root directory of the project and that it has
`NEXT_PUBLIC_BALANCER_API_URL` defined. Example:

```bash
NEXT_PUBLIC_BALANCER_API_URL=https://api-v3.balancer.fi/graphql
```

Next, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
