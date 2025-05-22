# TP02 - Application de gestion d'annonces

Ce projet est une application web de gestion d'annonces, réalisée avec React. Elle permet aux utilisateurs de s'inscrire, se connecter, publier des annonces, les modifier, les supprimer, et de consulter celles des autres. L'accès aux fonctionnalités dépend de l'authentification de l'utilisateur.

## Fonctionnalités principales

- **Inscription et connexion** des utilisateurs avec gestion de jeton JWT.
- **Création, modification et suppression** d'annonces (titre, description, prix, image, catégories).
- **Filtrage et recherche** des annonces par mot-clé et catégorie.
- **Affichage détaillé** d'une annonce.
- **Gestion du profil utilisateur** (affichage, suppression du compte, déconnexion).
- **Routes protégées** pour sécuriser l'accès aux pages selon l'état de connexion.

## Structure du projet

- `src/Components/Login` : Formulaire de connexion.
- `src/Components/Register` : Formulaire d'inscription.
- `src/Components/Home` : Page principale listant les annonces et permettant leur gestion.
- `src/Components/ProtectedRoute` : Composant pour protéger les routes nécessitant une authentification.
- `src/Components/PublicOnlyRoute` : Composant pour empêcher l'accès aux pages publiques si déjà connecté.

## Démarrage rapide

1. **Installer les dépendances**  
   Dans le dossier du projet, exécute :
   ```sh
   npm install
   ```

2. **Lancer l'application**  
   ```sh
   npm start
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

3. **Connexion au backend**  
   L'application nécessite un backend Node.js (API REST) accessible sur `http://localhost:8080`.  
   Assure-toi que le serveur backend est démarré et configuré pour gérer les routes `/users` et `/publication`.

## Utilisation

- **Créer un compte** via la page d'inscription.
- **Se connecter** pour accéder à la gestion des annonces.
- **Ajouter, modifier ou supprimer** tes propres annonces.
- **Consulter** les annonces des autres utilisateurs.
- **Filtrer** les annonces par catégorie ou rechercher par mot-clé.
- **Gérer ton profil** via le bouton "Mon compte".

## Technologies utilisées

- React 19
- React Router DOM 7
- Axios
- CSS (custom)
- Font Awesome