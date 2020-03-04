import { pricingMargins } from "../data/pricing";

const europeanCountries = [
  "BE",
  "BG",
  "CZ",
  "DK",
  "DE",
  "EE",
  "IE",
  "EL",
  "ES",
  "FR",
  "HR",
  "IT",
  "CY",
  "LV",
  "LT",
  "LU",
  "HU",
  "MT",
  "NL",
  "AT",
  "PL",
  "PT",
  "RO",
  "SI",
  "SK",
  "FI",
  "SE",
  "UK",
  "GB",
  "NO",
  "LI",
  "IS",
  ""
];

export const checkIfEuropean = countryCode => {
  return europeanCountries.find(country => {
    return country === countryCode;
  });
};

export const getPricingMargin = countryCode => {
  return pricingMargins[countryCode];
};
