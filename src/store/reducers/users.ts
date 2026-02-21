import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {fetchUsersAPI} from '../../api/userService';
import {User} from '../../types/user';

// ─── State Shape ──────────────────────────────────────────────────────────────
interface UsersState {
  allUsers: User[];
  visibleUsers: User[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null; // ← BUG FIX 1: was missing entirely — error state never stored
  page: number;
  limit: number;
  hasMore: boolean;
}

const PAGE_LIMIT = 4;

const initialState: UsersState = {
  allUsers: [],
  visibleUsers: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  limit: PAGE_LIMIT,
  hasMore: true,
};

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, {rejectWithValue}) => {
    try {
      const users = await fetchUsersAPI();
      return users;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        'Network error. Please check your connection.';
      return rejectWithValue(message);
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,

  reducers: {
    loadMoreUsers: state => {
      if (!state.hasMore) {
        return;
      }
      const start = state.visibleUsers.length;
      const end = start + state.limit;
      const nextBatch = state.allUsers.slice(start, end);
      if (nextBatch.length > 0) {
        state.visibleUsers.push(...nextBatch);
      }
      state.hasMore = state.visibleUsers.length < state.allUsers.length;
    },

    resetPagination: state => {
      state.page = 1;
      state.visibleUsers = state.allUsers.slice(0, state.limit);
      state.hasMore = state.allUsers.length > state.limit;
    },

    updateUser: (state, action: PayloadAction<User>) => {
      const updated = action.payload;
      const allIdx = state.allUsers.findIndex(u => u.id === updated.id);
      if (allIdx !== -1) {
        state.allUsers[allIdx] = updated;
      }
      const visIdx = state.visibleUsers.findIndex(u => u.id === updated.id);
      if (visIdx !== -1) {
        state.visibleUsers[visIdx] = updated;
      }
    },

    revertUser: (state, action: PayloadAction<User>) => {
      const original = action.payload;
      const allIdx = state.allUsers.findIndex(u => u.id === original.id);
      if (allIdx !== -1) {
        state.allUsers[allIdx] = original;
      }

      const visIdx = state.visibleUsers.findIndex(u => u.id === original.id);
      if (visIdx !== -1) {
        state.visibleUsers[visIdx] = original;
      }
    },

    clearError: state => {
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.page = 1;
        state.visibleUsers = action.payload.slice(0, state.limit);
        state.hasMore = action.payload.length > state.limit;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? 'Something went wrong. Please retry.';
      });
  },
});

export const {
  loadMoreUsers,
  resetPagination,
  updateUser,
  revertUser,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;
