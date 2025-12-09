# ReBook Development Quick Reference

## 🚀 Daily Commands

```bash
# Start dev server
npm run dev

# Build for production (test compilation)
npm run build

# Type check without building
npx tsc --noEmit

# Format code (if prettier installed)
npx prettier --write .
```

---

## 📝 Environment Setup

### 1. Copy env template
```bash
cp .env.example .env.local
```

### 2. Fill in secrets
- **DEEPSEEK_API_KEY**: Get from https://platform.deepseek.com/api_keys
- **NEXT_PUBLIC_NFT_CONTRACT_ADDRESS**: Deploy via thirdweb dashboard
- **NEXT_PUBLIC_THIRDWEB_CLIENT_ID**: From thirdweb.com/create-api-key

---

## 🔑 Key File Locations

| Purpose | File Path |
|---------|-----------|
| AI Summarisation | `src/lib/deepseek.ts` |
| NFT Contract Logic | `src/lib/nft.ts` |
| Wallet Config | `src/lib/wallets.ts` |
| Book Types | `src/lib/types.ts` |
| Celo Chain Config | `src/lib/constants.ts` |
| Access Gate | `src/components/ui/AccessGate.tsx` |
| Mint Flow | `src/components/ui/MintFlow.tsx` |
| Book Reader | `src/components/reader/BookReader.tsx` |
| Book Selection | `src/components/layout/BookSelection.tsx` |

---

## 🧪 Testing Workflows

### Test AI Summary
1. Start dev server
2. Open http://localhost:3000
3. Connect wallet
4. Claim NFT if needed
5. Select a book
6. Click floating "AI Summary" button
7. Verify summary appears

### Test NFT Minting
1. Use wallet **without** NFT
2. Connect wallet
3. Enter name → Generate art
4. Click "Claim Free NFT"
5. Verify gasless mint succeeds

---

## 🐛 Common Issues

### "Cannot find module 'openai'"
```bash
npm install openai@latest
```

### "BigInt literals are not available"
- Check `tsconfig.json` has `"target": "ES2020"`

### "NFT contract not found"
- Deploy contract via thirdweb dashboard
- Add address to `.env.local`
- Restart dev server

### DeepSeek API errors
- Verify API key in `.env.local`
- Check credits at platform.deepseek.com
- Test with curl:
  ```bash
  curl https://api.deepseek.com/v1/chat/completions \
    -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}'
  ```

---

## 📚 Documentation

- **Phase 1**: See `README.md`
- **Phase 2 Setup**: See `PHASE2_DEPLOYMENT.md`
- **Phase 2 Summary**: See `PHASE2_SUMMARY.md`
- **Thirdweb Docs**: https://portal.thirdweb.com
- **DeepSeek Docs**: https://platform.deepseek.com/docs

---

## 🎨 UI Component Patterns

### Premium Button
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
  Click Me
</button>
```

### Glass Modal
```tsx
<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
  Content
</div>
```

### Loading Spinner
```tsx
<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
```

---

## 🔐 Security Checklist

- [ ] API keys in `.env.local` (never commit)
- [ ] Server-side API routes for sensitive operations
- [ ] Input validation on all API endpoints
- [ ] Rate limiting (add in production)
- [ ] CORS headers configured
- [ ] Contract permissions set correctly

---

## 🚢 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors in browser
- [ ] Mobile responsive verified
- [ ] NFT contract deployed on mainnet
- [ ] Gasless relay enabled
- [ ] Environment variables set in Vercel/Netlify
- [ ] API routes working in production
- [ ] Error tracking configured (Sentry)

---

**Happy coding! 🚀**
