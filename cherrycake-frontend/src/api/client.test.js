import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient } from './client';
import { store } from '../store';
import { STORAGE_KEY_TOKEN } from '../constants/storage-keys';

describe('apiClient & Interceptors (CC-11)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches Bearer token in request headers when cc_token is present', async () => {
    localStorage.setItem(STORAGE_KEY_TOKEN, 'test-jwt-token-12345');

    // Run the request interceptor manually
    const interceptor = apiClient.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    const modifiedConfig = interceptor(config);

    expect(modifiedConfig.headers.Authorization).toBe('Bearer test-jwt-token-12345');
  });

  it('dispatches showToast with error message on API response error', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const responseInterceptor = apiClient.interceptors.response.handlers[0].rejected;

    const mockAxiosError = {
      response: {
        status: 400,
        data: {
          code: 'VALIDATION_FAILED',
          message: 'Некорректные параметры запроса',
          errors: [{ field: 'email', message: 'Неверный email' }]
        }
      }
    };

    try {
      await responseInterceptor(mockAxiosError);
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.message).toBe('Некорректные параметры запроса');
      expect(err.errors).toHaveLength(1);
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ui/showToast',
        payload: {
          type: 'error',
          message: 'Некорректные параметры запроса'
        }
      })
    );
  });
});