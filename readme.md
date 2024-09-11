# 🎬 MovieIncApp - Movie Application with TMDB API

**MovieIncApp** is a mobile application developed with **React Native** and **TypeScript** that allows users to explore popular movies and TV shows, add favorites, rate movies, and manage their profile, all integrated with **The Movie Database (TMDB)** API.

## 🚀 Key Features:
- **Home Screen**: Displays a list of "Now Playing" movies using the `/movie/now_playing` endpoint from TMDB.
- **Favorites**: Users can add or remove movies from their favorites list. This feature is handled through the `/account/{account_id}/favorite` endpoint.
- **Movie Rating**: Users can rate movies using TMDB's API with a scoring system.
- **Profile Screen**: Shows the user’s profile information and allows account management.
- **Movie Detail Screen**: Includes complete movie details such as title, genres, average vote, release date, and a list of recommendations.
- **Authentication**: Implements TMDB's authentication system with login, logout, and token management.

## 📱 Navigation:
- **Stack Navigator**: Manages main navigation between the Login, Movie Detail, and tab navigation screens.
- **Bottom Tab Navigator**: A bottom menu navigation that includes:
  - **Now Playing**: Movies currently in theaters.
  - **My Favorites**: Access to the user's saved favorite movies.
  - **My Profile**: User account management.

## 🛠️ Technologies Used:
- **React Native** with TypeScript for mobile interface development.
- **React Navigation** for screen navigation.
- **Expo SecureStore** for securely storing session tokens.
- **Axios** for communication with the TMDB API.
- **React Native Paper** for UI components like buttons and icons.
- **Moment.js** for formatting dates.
- **@kolking/react-native-rating** for managing the movie rating system.

## 📡 Integrated API:
The application communicates with the **TMDB API** to retrieve movie data, manage favorites, and handle authentication. The main functionalities handled by the API include:
- Fetching currently playing movies.
- Fetching complete movie details.
- Adding or removing movies from favorites.
- Rating movies.
- Managing user profiles.

## 📂 Folder Structure:
- **src/navigation**: Configuration for screen navigation.
- **src/services**: Logic for communication with the TMDB API to retrieve data, handle authentication, and manage favorites.
- **src/context**: React contexts for managing user authentication and other global states.
- **src/screens**: Main screen components of the application.
- **src/utils**: Helper functions such as formatting dates, getting colors based on ratings, and managing images.

## ⚙️ Setup and Installation:
1. Clone this repository.
   ```bash
   git clone https://github.com/MarioDev64/MovieIncApp.git
   ```
2. Install dependencies.
   ```bash
   npm install
   # or
   yarn install
   ```
3. Don’t forget to rename the .env.example file to .env.
   ```bash
   EXPO_PUBLIC_API_KEY=
   # and
   EXPO_PUBLIC_API_TOKEN=
   ```
4. Start the application in development mode.
    ```bash
   npx expo start
   # or
   npm run start
   # or
   yarn start
   ```
   