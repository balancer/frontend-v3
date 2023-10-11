# Balancer frontend V3

## Getting Started

_This project uses `pnpm`, if you haven't already installed it you can find the documentation here:
https://pnpm.io/installation_

To setup the development environment, first clone the repo:

```bash
git clone https://github.com/balancer/frontend-v3.git && cd frontend-v3
```

Copy and rename the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
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

## Testing

See [TESTING.md](./test/TESTING.md).
