# Rulefy

Telegram Business bot for **message schemes** (auto-replies, commands, filters) + optional **encrypted anti-delete / anti-edit** protection.

> Zero-access by design: user messages are **not stored** unless the user explicitly enables the anti-delete feature. Encryption key never leaves the Mini App.

## Features

- **Schemes** — trigger → action rules that work in private chats via Telegram Business Connection
- **Commands** — `.hello` style commands inside any managed chat
- **Anti-delete / anti-edit** (optional, off by default) — client-side AES-GCM encryption, decryption only in Mini App
- **Open-source** — self-host freely; official instance is clearly marked

## Stack

- TypeScript + [GrammY](https://grammy.dev)
- PostgreSQL (Prisma)

<!--- Redis-->

- Telegram Mini App for scheme builder + decryption UI

## Project structure

```
rulefybot/
├── apps/
│   ├── bot/              # GrammY bot
│   └── mini-app/         # Telegram Mini App
├── packages/
│   ├── shared/           # Scheme types + Zod schemas
│   └── crypto/           # Client-side encryption helpers
├── prisma/
│   └── schema.prisma
└── README.md
```

### Connect the bot

1. Open Telegram → Settings → Telegram Business → Chat Automation
2. Add @rulefybot

## Encryption (anti-delete)

1. User enables the feature in Mini App and sets a passphrase
2. Mini App derives an AES-GCM key
3. When a business message arrives and the feature is on, the payload is encrypted **client-side** (or via a controlled flow) and only ciphertext is stored
4. On `deleted_business_messages` / `edited_business_message` the bot notifies the owner
5. Owner opens Mini App and see deleted/edited messages decrypted with the passphrase

**If the passphrase is lost, data cannot be recovered.** This is intentional.

## Self-hosting vs Official

|                           | Official             | Self-hosted            |
| ------------------------- | -------------------- | ---------------------- |
| `IS_OFFICIAL=true`        | ✅                   | ❌                     |
| Branding in notifications | Official             | "Self-hosted instance" |
| Mini App domain           | Official domain only | Your domain            |
| Message storage           | Only if user enables | Only if user enables   |

Never connect a random third-party instance to your Business account unless you trust the operator.

## Roadmap

- [ ] Project skeleton + scheme types
- [ ] Business connection handling
- [ ] Basic scheme engine
- [ ] Mini App (scheme builder + decrypt UI)
- [ ] Full anti-delete encryption pipeline
- [ ] Public scheme gallery
- [ ] Variables between schemes
- [ ] Media preview compression

## License

RulefyBot is licensed under the
GNU Affero General Public License v3.0.

You are free to use, modify, and distribute
this software under the terms of the license.

See [LICENSE](./LICENSE) for details.
