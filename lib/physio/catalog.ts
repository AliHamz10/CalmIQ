import type { PhysioClinic } from "./types";

/**
 * Public Islamabad physiotherapy clinics for the home directory.
 * Independent local practices — not CalmIq staff. Numbers verified for Islamabad only.
 */
export const PHYSIO_CITY = "Islamabad" as const;

export const ISLAMABAD_PHYSIO_CLINICS: readonly PhysioClinic[] = [
  {
    id: "hm-physiocare",
    name: "HM PhysioCare",
    phone: "+923239358935",
    displayPhone: "+92 323 9358935",
    area: "G-8 Markaz",
    sourceUrl: "https://www.hmphysiocare.com/",
  },
  {
    id: "islamabad-physiotherapy-clinic",
    name: "Islamabad Physiotherapy Clinic",
    phone: "+923025788348",
    displayPhone: "+92 302 5788348",
    area: "Gulberg",
    sourceUrl: "https://islamabadphysiotherapyclinic.com/contact",
  },
  {
    id: "the-muscular-junction",
    name: "The Muscular Junction",
    phone: "+923396116665",
    displayPhone: "+92 339 6116665",
    area: "River Gardens",
    sourceUrl: "https://themuscularjunction.com/contact",
  },
  {
    id: "ok-cures",
    name: "OK Cures",
    phone: "+923319340645",
    displayPhone: "+92 331 9340645",
    area: "G-8 Markaz",
    sourceUrl: "https://ok-cures.com/contact/",
  },
  {
    id: "dr-zia-pain-brain",
    name: "Dr Zia Pain & Brain Therapies",
    phone: "+923304343123",
    displayPhone: "+92 330 4343123",
    area: "F-11/3",
    sourceUrl: "https://www.physiotherapy.com.pk/contact/",
  },
] as const;

export function listPhysioClinics(): readonly PhysioClinic[] {
  return ISLAMABAD_PHYSIO_CLINICS;
}
