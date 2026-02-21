<img width="1080" height="2220" alt="Screenshot_1771668916" src="https://github.com/user-attachments/assets/4f620dd8-b9ca-4a0e-846f-0a7bcb545c33" /># 📱 User Management App

A production-ready **React Native** application built with TypeScript, Redux Toolkit, and clean architecture. Fetches users from a public API, supports search, pagination, pull-to-refresh, offline caching, and full user editing with form validation.

---

## ✨ Features

- 🔍 **Search** — filter users by name, email, or username across all records
- 📄 **Pagination** — loads 4 users at a time, more on scroll
- 🔄 **Pull-to-Refresh** — re-fetches latest data from the API
- ✏️ **Edit User** — Formik + Yup form with inline validation
- ⚡ **Optimistic Updates** — edits reflect instantly; auto-reverts on API failure
- 📦 **Offline Support** — redux-persist caches data in AsyncStorage
- ❌ **Error Handling** — full-screen error view + inline banner for refresh failures

---

## 🗂️ Folder Structure

```
src/
├── api/
│   ├── index.ts              # Axios instance + error interceptor
│   └── userService.ts        # fetchUsersAPI abstraction
├── components/
│   ├── UserItem.tsx          # Memoized list row
│   ├── SearchBar.tsx         # Controlled search input
│   ├── FormField.tsx         # Reusable labelled input with error
│   └── ErrorView.tsx         # Full-screen error + retry
├── navigation/
│   ├── AppNavigator.tsx      # Stack navigator
│   └── types.ts              # RootStackParamList
├── screens/
│   ├── UserListScreen.tsx    # List + search + pagination + refresh
│   └── UserDetailScreen.tsx  # Detail view + Formik/Yup edit form
├── store/
│   ├── index.ts              # Redux store + redux-persist
│   ├── hooks/index.ts        # useAppDispatch / useAppSelector
│   └── reducers/
│       └── users.ts          # Users slice (thunk + pagination + optimistic)
├── styles/
│   └── colors.ts             # Central color palette
├── types/
│   └── user.ts               # User, Address, Company, Geo interfaces
```

---

## 🏗️ Architecture Decisions

### State Management — Redux Toolkit

RTK is chosen over Zustand/Context because the data graph (allUsers → paginated visibleUsers, loading states, optimistic edits, error state) benefits from a predictable, traceable single source of truth. `createAsyncThunk` handles the full fetch lifecycle cleanly, and `revertUser` makes rollback straightforward to debug in Redux DevTools.

### Offline Support — redux-persist

The `users` slice is persisted to AsyncStorage. On relaunch, cached users are available immediately with zero loading time. If a background refresh fails, an inline banner is shown instead of a hard error screen.

### Optimistic UI

On edit save:

1. `updateUser` dispatched → UI updates instantly
2. API PATCH runs in background
3. On failure → `revertUser` dispatched → state rolled back + Alert shown

### Pagination Strategy

All records are fetched once. `visibleUsers` is a progressive slice of `allUsers`. Search bypasses pagination and queries `allUsers` directly so results are never truncated by page size.

---

## 🛠️ Tech Stack

| Library          | Purpose               |
| ---------------- | --------------------- |
| React Native     | Mobile framework      |
| TypeScript       | Type safety           |
| Redux Toolkit    | State management      |
| redux-persist    | Offline caching       |
| AsyncStorage     | Persistent storage    |
| Axios            | HTTP client           |
| Formik           | Form state management |
| Yup              | Schema validation     |
| React Navigation | Stack navigation      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/UserManagementApp.git
cd UserManagementApp

# Install dependencies
npm install

# iOS only — install pods
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📡 API

Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) — a free public REST API for testing.

```
GET https://jsonplaceholder.typicode.com/users
```

---

## 📸 Screenshots

> Add your screenshots here after running the app.
> <img width="1080" height="2220" alt="Screenshot_1771668916" src="https://github.com/user-attachments/assets/79ae86fe-7090-49d7-8aae-1311ff3a2ed4" />
> <img width="1080" height="2220" alt="Screenshot_1771668925" src="https://github.com/user-attachments/assets/7cc53ee8-f224-449a-8a92-68a0f7bc5482" />
> <img width="1080" height="2220" alt="Screenshot_1771668934" src="https://github.com/user-attachments/assets/10f5f17c-c105-44d2-bfe1-d1814595d2d5" />
> <img width="1080" height="2220" alt="Screenshot_1771668958" src="https://github.com/user-attachments/assets/a62b918c-c314-4856-87f6-13c64645961e" />
> <img width="1080" height="2220" alt="Screenshot_1771668970" src="https://github.com/user-attachments/assets/4909c2c4-f0c4-4391-8e85-e87d103d0b1a" />
> <img width="1080" height="2220" alt="Screenshot_1771668972" src="https://github.com/user-attachments/assets/97fbc4e4-02bb-4267-95d9-5b2a3ad963f3" />
> <img width="1080" height="2220" alt="Screenshot_1771668981" src="https://github.com/user-attachments/assets/b44cb9e0-47f8-4737-964e-aac0bf9470ff" />


---

## 📄 License

MIT
