import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type UserRole = 'CUSTOMER' | 'VIEWER' | 'STAFF' | 'ADMIN';

type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  status: 'idle' | 'authenticated' | 'unauthenticated';
};

const initialState: AuthState = {
  token: localStorage.getItem('cc_token'),
  user: null,
  status: localStorage.getItem('cc_token') ? 'authenticated' : 'unauthenticated',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'authenticated';

      localStorage.setItem('cc_token', action.payload.token);
      localStorage.setItem('cc_user', JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = 'unauthenticated';

      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
