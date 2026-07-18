import { API, apiKey } from "../service/apiUrl";

export const continueWithGoogle = () => {
  window.location.href = `${apiKey}${API.auth.google}`;
};
