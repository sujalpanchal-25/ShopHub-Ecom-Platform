const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export const saveTokens = (
  access,
  refresh
) => {
  localStorage.setItem(
    ACCESS_TOKEN,
    access
  );

  localStorage.setItem(
    REFRESH_TOKEN,
    refresh
  );
};

export const getAccessToken =
  () => {
    return localStorage.getItem(
      ACCESS_TOKEN
    );
  };

export const getRefreshToken =
  () => {
    return localStorage.getItem(
      REFRESH_TOKEN
    );
  };

export const isAuthenticated =
  () => {
    return !!localStorage.getItem(
      ACCESS_TOKEN
    );
  };

export const logout = () => {
  localStorage.removeItem(
    ACCESS_TOKEN
  );

  localStorage.removeItem(
    REFRESH_TOKEN
  );
};