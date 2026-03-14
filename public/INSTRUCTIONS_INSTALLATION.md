# 📱 Installation et Génération APK - Application Police Municipale

## 📦 Contenu de cette archive

Vous avez téléchargé le code complet de votre application :
- `/frontend` - Application mobile Expo React Native
- `/backend` - API FastAPI + MongoDB

## 🚀 Guide d'installation étape par étape

### Prérequis à installer sur votre ordinateur

#### 1. Node.js (obligatoire)
- Téléchargez : https://nodejs.org/
- Choisissez la version **LTS** (ex: 20.x)
- Installez avec toutes les options par défaut
- Vérifiez l'installation :
  ```bash
  node --version
  npm --version
  ```

#### 2. Git (optionnel mais recommandé)
- Windows : https://git-scm.com/download/win
- Mac/Linux : normalement déjà installé

---

## 📥 Décompresser l'archive

### Windows
- Clic droit sur `police-municipale-app.tar.gz`
- "Extraire ici" ou utiliser 7-Zip / WinRAR
- Un dossier se crée avec `frontend/` et `backend/`

### Mac/Linux
```bash
tar -xzf police-municipale-app.tar.gz
```

---

## ⚙️ Configuration

### Étape 1 : Déployer le backend (une fois)

**Option A : Render.com (gratuit, recommandé)**

1. Créez un compte sur https://render.com
2. Cliquez "New +" → "Web Service"
3. Connectez votre code (upload ZIP ou GitHub)
4. Configuration :
   - Runtime : Python
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn server:app --host 0.0.0.0 --port 8001`
   - Root Directory : `backend`
5. Ajoutez une variable d'environnement :
   - `MONGO_URL` = `mongodb+srv://...` (voir MongoDB Atlas ci-dessous)
6. Déployez !

**MongoDB Atlas (base de données gratuite) :**
1. Compte sur https://www.mongodb.com/cloud/atlas/register
2. Créez un cluster gratuit (M0)
3. Database Access → Ajoutez un utilisateur
4. Network Access → Ajoutez `0.0.0.0/0` (accès depuis partout)
5. Connect → Obtenez l'URL de connexion
6. Copiez cette URL dans la variable `MONGO_URL` de Render

**Résultat :** Vous obtenez une URL comme `https://police-municipale-api.onrender.com`

### Étape 2 : Configurer l'app mobile

Dans le dossier `frontend/`, créez/modifiez le fichier `.env` :

```
EXPO_PUBLIC_BACKEND_URL=https://votre-backend.onrender.com
```

Remplacez par l'URL de votre backend Render.

---

## 🔨 Générer l'APK Android

### Installation EAS CLI (une fois)

Ouvrez un terminal dans le dossier `frontend/` :

```bash
cd frontend
npm install -g eas-cli
```

### Connexion à Expo

```bash
eas login
```

Si vous n'avez pas de compte Expo :
- Créez-en un gratuitement sur https://expo.dev

### Configuration EAS

```bash
eas build:configure
```

Choisissez :
- All (Android + iOS si vous voulez les deux)
- Appuyez sur Entrée

Cela crée un fichier `eas.json`. Modifiez-le pour générer un APK :

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Lancer le build APK

```bash
eas build --platform android --profile preview
```

**Ce qui se passe :**
- 📤 Le code est envoyé aux serveurs Expo
- ⏱️ Build dans le cloud (15-20 minutes)
- 📧 Vous recevez un email avec le lien de téléchargement de l'APK
- 💾 Téléchargez l'APK
- 📱 Envoyez-le à vos collègues !

---

## 📱 Installation de l'APK sur Android

1. Transférez le fichier `.apk` sur votre téléphone
2. Ouvrez le fichier
3. Android demande "Autoriser l'installation depuis cette source"
4. Activez l'autorisation
5. Cliquez "Installer"
6. ✅ L'app est installée !

---

## 🔄 Mise à jour de l'application

### Pour modifier l'application

1. **Modifiez le code** sur Emergent (ou localement)
2. **Incrémentez la version** dans `frontend/app.json` :
   ```json
   {
     "expo": {
       "version": "1.0.1",  // ← Changez ici
       "android": {
         "versionCode": 2  // ← Et ici
       }
     }
   }
   ```
3. **Rebuild l'APK** :
   ```bash
   eas build --platform android --profile preview
   ```
4. **Distribuez le nouveau APK** à vos collègues
5. Ils cliquent dessus → mise à jour automatique !

---

## 🆘 Problèmes courants

### "Command not found: eas"
→ Réinstallez EAS CLI : `npm install -g eas-cli`

### "Build failed - Missing credentials"
→ Lancez : `eas build:configure`

### L'APK ne s'installe pas
→ Vérifiez "Sources inconnues" dans Paramètres Android

### L'app crash au démarrage
→ Vérifiez que l'URL backend est correcte dans `.env`

### Le backend ne répond pas
→ Vérifiez que MongoDB est bien connecté sur Render

---

## 📞 Support

- Documentation Expo : https://docs.expo.dev
- Documentation EAS Build : https://docs.expo.dev/build/introduction
- Support Emergent : support@emergent.sh

---

## ✅ Checklist complète

- [ ] Node.js installé
- [ ] Archive décompressée
- [ ] Backend déployé sur Render
- [ ] MongoDB Atlas créé
- [ ] Fichier `.env` modifié avec URL backend
- [ ] EAS CLI installé
- [ ] Compte Expo créé
- [ ] `eas build:configure` exécuté
- [ ] Premier build lancé
- [ ] APK téléchargé
- [ ] APK testé sur un téléphone

**Bon déploiement ! 🚀**
