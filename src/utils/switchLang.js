import Cookies from "js-cookie";
import i18n from "../I18next";

export let currentLanguageCode = Cookies.get("i18next") || "en";

// Function to switch languages
export const switchLang = (lang) => {
  const targetLanguage = currentLanguageCode === "en" ? "ar" : "en";
  Cookies.set("i18next", lang ? lang : targetLanguage);
  currentLanguageCode = targetLanguage;
  i18n.changeLanguage(targetLanguage);
};

export const toggleLang = (lang) => {
  const targetLanguage = lang || (currentLanguageCode === "en" ? "ar" : "en");
  Cookies.set("i18next", targetLanguage);

  currentLanguageCode = targetLanguage;

  i18n.changeLanguage(targetLanguage);
};
