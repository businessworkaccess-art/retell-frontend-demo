# Retell AI Frontend Demo

A simple, stunning, and deployable UI for testing your Retell AI agents. Built with Next.js, Retell SDK, and Framer Motion.

## 🚀 Features

- **Ultra-realistic Voice Interactions**: Seamlessly test your Retell agents.
- **Modern UI**: Clean, premium design with glassmorphism and animations.
- **One-Click Deploy**: Optimized for Vercel deployment.
- **Easy Config**: Just paste your Agent ID and API Key.

## 🛠️ Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory and add your Retell credentials:

```bash
RETELL_API_KEY=your_retell_api_key_here
NEXT_PUBLIC_RETELL_AGENT_ID=your_retell_agent_id_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start testing.

## 🌐 Deployment

### Deploy to Vercel

1. Push this code to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/new).
3. Import your repository.
4. Add the following Environment Variables in Vercel:
   - `RETELL_API_KEY`
   - `NEXT_PUBLIC_RETELL_AGENT_ID`
5. Click **Deploy**.

## 📄 License

MIT
