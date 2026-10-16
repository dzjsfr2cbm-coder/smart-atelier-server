# SmartAtelier Server

Petit serveur cloud pour recevoir une photo et demander à un modèle vision de proposer une identification. Les résultats doivent être vérifiés par l'utilisateur.

## Déploiement sur Render

1. Importer ces fichiers dans un dépôt GitHub.
2. Dans Render, créer un **Web Service** et sélectionner ce dépôt.
3. Runtime : **Node**.
4. Build Command : `npm install`
5. Start Command : `npm start`
6. Dans **Environment Variables**, ajouter `OPENAI_API_KEY` avec votre vraie clé API.
7. Déployer. Tester l'URL Render dans un navigateur : elle doit répondre avec `{"ok":true,"service":"SmartAtelier API"}`.

Ne mettez jamais votre vraie clé API dans GitHub ni dans l'application mobile.

## Endpoint d'identification

`POST /api/identify` avec une requête `multipart/form-data` contenant le fichier image sous le champ `photo`.

Important : cette archive fournit le serveur cloud. Elle ne contient pas l'application mobile complète et ne crée pas automatiquement un QR code Expo Go. L'application mobile devra être configurée pour appeler l'URL Render.
