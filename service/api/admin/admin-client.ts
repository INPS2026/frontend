import { createBrowserApiClient } from '@/lib/api-client';
import { MAX_REQUEST_RETRIES } from '@/lib/constants';
import { TokenService } from '@/lib/token-service';
import { refreshStaffToken } from '../staff-auth.api';

const adminClient = createBrowserApiClient();

adminClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const config = err.config;
    const shouldRetry = !err.response || err.response.status === 401;

    if (!shouldRetry) {
      return Promise.reject(err);
    }

    config._retryCount = config._retryCount ?? 0;

    if (config._retryCount >= MAX_REQUEST_RETRIES) {
      return Promise.reject(err);
    }

    config._retryCount += 1;

    if (err.response.status === 401) {
      const storedToken = TokenService.getRefreshToken();

      if (storedToken) {
        const result = await refreshStaffToken(storedToken);

        if (result.success) {
          TokenService.set({
            accessToken: result.token,
            refreshToken: result.refreshToken,
          });

          config.headers.set('Authorization', `Bearer ${result.token}`);
          return adminClient(config);
        }
      }
    }

    Promise.reject(err);
  },
);

export { adminClient };
