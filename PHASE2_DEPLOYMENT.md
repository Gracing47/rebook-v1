# Phase 2 Deployment Guide

## Prerequisites

1. **DeepSeek API Key**  
   - Get from: https://platform.deepseek.com/api_keys
   - Add to `.env.local`: `DEEPSEEK_API_KEY=sk-...`

2. **NFT Contract Deployment**  
   - Log in to [thirdweb dashboard](https://thirdweb.com/dashboard)
   - Deploy an **Edition Drop** contract on **Celo Mainnet**
   - Configure:
     - Token ID 0 = Access Pass
     - Set claim conditions (free mint, unlimited supply)
     - Enable gasless transactions (thirdweb's relay)
   - Copy contract address
   - Add to `.env.local`: `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...`

## Installation

Run in Git Bash:

```bash
npm install openai@latest
```

## Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your API keys:
   ```
   DEEPSEEK_API_KEY=sk-...
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=...
   ```

## Testing Phase 2

### AI Summarisation
1. Connect wallet
2. Claim/own the NFT
3. Select a book
4. Click the floating "AI Summary" button
5. Verify summary appears in modal

### NFT Gating
1. Use a wallet **without** the NFT
2. Connect wallet
3. Enter your name in the mint flow
4. Click "Generate My NFT"
5. Verify unique artwork appears
6. Click "Claim Free NFT"
7. Verify gasless mint succeeds
8. Verify book selection unlocks

## Troubleshooting

### DeepSeek API Errors
- Check API key is valid
- Verify you have credits
- Check rate limits

### NFT Contract Errors
- Verify contract is deployed on Celo Mainnet (chain ID 42220)
- Check claim conditions are active
- Ensure gasless relay is enabled in thirdweb dashboard
- Verify contract address in `.env.local`

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` has `"target": "ES2020"`

## Next Steps (Phase 3)

- [ ] Deploy to production (Vercel/Netlify)
- [ ] Add analytics dashboard
- [ ] Implement invite system
- [ ] Add community features (comments, ratings)
- [ ] Production AI art generation (DALL-E integration)
