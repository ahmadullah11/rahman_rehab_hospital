export interface Branch {
  id: string;
  label: string;
  city: string;
  address: string;
  phones: string[];
  hours: string;
  primary?: boolean;
  mapQuery: string;
}

export const HOSPITAL = {
  /** Short brand used in the navbar, footer and page title. */
  name: "Rahman Rehab",
  /** Full legal name used in cards, the footer and metadata. */
  fullName: "Rahman Rehab & Psychiatry Treatment Hospital",
  tagline: "Rehabilitation & Psychiatric Treatment Center",
};

export const PHONES = ["0301-8875892", "0316-9398564"];

export const CONTACT = {
  phones: PHONES,
  email: "Rahman75432@gmail.com",
  hours: "Always open",
  hoursDetail: "24 hours a day, 7 days a week",
  mainAddress: "S.S Club Street, opposite Gul Haji Plaza, University Road, Peshawar",
  swatAddress: "Matta, Swat",
};

export const SOCIALS = {
  facebook: "https://www.facebook.com/RahmanCenterPeshawar/",
  tiktok: "https://www.tiktok.com/@anayat_official3",
};

export const BRANCHES: Branch[] = [
  {
    id: "peshawar",
    label: "Main Branch",
    city: "Peshawar",
    address: "S.S Club Street, opposite Gul Haji Plaza, University Road, Peshawar",
    phones: ["0301-8875892", "0316-9398564"],
    hours: "Always open",
    primary: true,
    mapQuery:
      "Rahman Rehab & Psychiatry Treatment Hospital, S.S Club Street, opposite Gul Haji Plaza, University Road, Peshawar",
  },
  {
    id: "swat",
    label: "Swat Branch",
    city: "Swat",
    address: "Matta, Swat",
    phones: ["0341-9380320"],
    hours: "Always open",
    mapQuery: "Rahman Rehab & Psychiatry Treatment Hospital, Matta, Swat",
  },
];

/** Turns a local Pakistani number such as 0301-8875892 into +923018875892. */
export function toTel(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("92")) return `+${digits}`;
  return `+92${digits.replace(/^0/, "")}`;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
