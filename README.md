# SatisfactoryFAQBot

This bot automatically responds to questions about Satisfactory modding.

## Installing locally

(Prerequisite: node.js)

1. `npm install`
2. Create a Discord bot through the web interface.
3. Add your Discord bot to your server.
4. Create auth.json in the root directory with content

    ```
    {
        "token": "YOUR_DISCORD_BOT_AUTH_TOKEN_HERE"
    }
    ```
5. Compile the project with `npm run build` (one-time) or `npm run watch` (auto-recompilation)
6. Boot the bot with `npm run start`

## Production deployment

(Prerequisite: Docker CLI)

1. Compile the project as described above.
2. `docker build -t satisfactory-faq-bot .`
