// Countries offered in the onboarding. The backend stores an ISO 3166-1 alpha-2 code
// (country_code); the names come from the platform's Intl data, so there is no list of
// names to maintain. Presentation only: add codes freely.
const codes = [
  "AR", "AT", "AU", "BE", "BR", "CA", "CH", "CL", "CN", "CO", "CZ", "DE", "DK", "ES",
  "FI", "FR", "GB", "GR", "HU", "IE", "IN", "IT", "JP", "KR", "MA", "MX", "NL", "NO",
  "NZ", "PE", "PL", "PT", "RO", "SE", "SG", "TR", "UA", "US", "UY", "ZA",
] as const;

export type CountryOption = { code: string; name: string };

export function countryOptions(locale = "en"): CountryOption[] {
  const names = new Intl.DisplayNames([locale], { type: "region" });

  return codes
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
