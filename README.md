<h1 align="center">👤 User Management App</h1>

<p align="center">
  A production-ready <strong>React Native</strong> application for browsing, searching, and managing users with offline support and optimistic UI updates.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.74.5-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.4-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2.2.7-purple?style=for-the-badge&logo=redux" />
  <img src="https://img.shields.io/badge/Formik-2.4.9-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running on Android](#running-on-android)
  - [Running on iOS](#running-on-ios)
- [📱 Screens](#-screens)
- [🏗️ Architecture](#️-architecture)
- [🔌 API](#-api)
- [🧪 Testing](#-testing)
- [📦 Key Dependencies](#-key-dependencies)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- 📋 **User List** — Fetches users from a remote API and displays them in a clean list
- 🔍 **Search** — Real-time search/filter users by name or email
- 🔄 **Pull-to-Refresh** — Easily refresh the user list with a pull gesture
- 📄 **Pagination** — Efficient pagination for large user datasets
- 👁️ **User Detail View** — View complete user profile information
- ✏️ **Local Editing** — Edit user details locally with form validation (Formik + Yup)
- 💾 **Offline Support** — Data persists locally via Redux Persist + AsyncStorage
- ⚡ **Optimistic UI Updates** — Instant UI feedback before server confirmation
- 🧹 **Clean Architecture** — Well-structured folder layout for scalability

---

## 🛠️ Tech Stack

| Category              | Technology                          |
|-----------------------|-------------------------------------|
| Framework             | React Native 0.74.5                 |
| Language              | TypeScript 5.0.4                    |
| State Management      | Redux Toolkit + React-Redux         |
| Persistence           | Redux Persist + AsyncStorage        |
| Form Handling         | Formik + Yup                        |
| Navigation            | React Navigation (Native Stack)     |
| HTTP Client           | Axios                               |
| Icons                 | React Native Vector Icons           |
| Storage (Native)      | React Native MMKV                   |
| Linting               | ESLint + Prettier                   |
| Testing               | Jest + React Testing Library        |

---

## 📁 Project Structure

```
UserManagementApp/
├── src/
│   ├── api/                    # API service layer
│   │   ├── index.ts            # Axios instance configuration
│   │   └── userService.ts      # User-related API calls
│   ├── components/             # Reusable UI components
│   │   ├── ErrorView.tsx       # Error state component
│   │   ├── FormField.tsx       # Reusable Formik form field
│   │   ├── SearchBar.tsx       # Search input component
│   │   └── UserItem.tsx        # Single user list item
│   ├── navigation/             # React Navigation setup
│   │   ├── AppNavigator.tsx    # Root navigator
│   │   └── types.ts            # Navigation type definitions
│   ├── screens/                # App screens
│   │   ├── UserListScreen.tsx  # Main user list screen
│   │   └── UserDetailScreen.tsx# User detail & edit screen
│   ├── store/                  # Redux store
│   │   ├── index.ts            # Store configuration & persistence
│   │   ├── hooks/              # Typed Redux hooks
│   │   └── reducers/           # Redux slices
│   ├── styles/                 # Global styles & themes
│   └── types/                  # Shared TypeScript types
├── android/                    # Android native project
├── ios/                        # iOS native project
├── __tests__/                  # Test files
├── App.tsx                     # App root component
├── index.js                    # App entry point
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the React Native development environment set up:

- **Node.js** >= 18
- **npm** or **Yarn**
- **Android Studio** (for Android) with an emulator or physical device
- **Xcode** (for iOS, macOS only) with a simulator or physical device
- **Java Development Kit (JDK)** >= 17

> 📖 Follow the official [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide for complete instructions.

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/UserManagementApp.git
   cd UserManagementApp
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS CocoaPods (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

---

### Running on Android

1. Start an Android emulator or connect a physical device.
2. Run the Metro bundler:
   ```bash
   npm start
   # or
   yarn start
   ```
3. In a new terminal, run the Android app:
   ```bash
   npm run android
   # or
   yarn android
   ```

---

### Running on iOS

> ⚠️ iOS builds require macOS with Xcode installed.

1. Run the Metro bundler:
   ```bash
   npm start
   # or
   yarn start
   ```
2. In a new terminal, run the iOS app:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

---

## 📱 Screens

### 1. User List Screen
- Displays a paginated list of users fetched from the API
- Includes a **search bar** to filter by name or email
- Supports **pull-to-refresh**
- Shows a loading indicator and error state

### 2. User Detail Screen
- Shows full user details (name, email, phone, address, etc.)
- Allows **local editing** of user fields with form validation
- Uses **Formik** for form state and **Yup** for validation
- Supports **optimistic UI updates**

---

## 🏗️ Architecture

This app follows a **feature-driven**, layered architecture:

```
UI (Screens & Components)
        ↓
  Redux Store (State)
        ↓
   API Services (Axios)
        ↓
  Remote API (JSONPlaceholder)
```

- **Redux Toolkit** manages all global state (user list, selected user, loading/error states).
- **Redux Persist** with **AsyncStorage** ensures data survives app restarts (offline-first).
- **Formik + Yup** handle form state and validation at the screen level.
- **React Navigation** provides type-safe screen navigation.
- **Axios** handles all HTTP requests with a centralized instance.

---

## 🔌 API

This app uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) free REST API for demo data.

| Endpoint              | Description           |
|-----------------------|-----------------------|
| `GET /users`          | Fetch all users       |
| `GET /users/:id`      | Fetch user by ID      |
| `PUT /users/:id`      | Update user (mocked)  |

---

## 🧪 Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

Tests are written using **Jest** and **React Testing Library for React Native**.

---

## 📦 Key Dependencies

| Package                                 | Version   | Purpose                       |
|-----------------------------------------|-----------|-------------------------------|
| `react-native`                          | 0.74.5    | Core framework                |
| `@reduxjs/toolkit`                      | 2.2.7     | State management              |
| `react-redux`                           | 9.1.2     | React bindings for Redux      |
| `redux-persist`                         | ^6.0.0    | State persistence             |
| `@react-native-async-storage/async-storage` | ^2.2.0 | Async key-value storage     |
| `@react-navigation/native-stack`        | 6.11.0    | Screen navigation             |
| `axios`                                 | 1.6.7     | HTTP client                   |
| `formik`                                | ^2.4.9    | Form management               |
| `yup`                                   | ^1.7.1    | Schema validation             |
| `react-native-vector-icons`             | 10.2.0    | Icon library                  |
| `react-native-mmkv`                     | 2.12.2    | Fast native key-value storage |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please follow the existing code style (ESLint + Prettier) before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ using React Native</p>
