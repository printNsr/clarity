export const DISCIPLINES = {
  Electrical: { code: "E", text: "text-[#7C3AED]", bg: "bg-[#7C3AED]", soft: "bg-[#F5F3FF]", border: "border-[#DDD6FE]", hex: "#7C3AED" },
  Mechanical: { code: "M", text: "text-[#16A36A]", bg: "bg-[#16A36A]", soft: "bg-[#ECFDF5]", border: "border-[#BBF7D0]", hex: "#16A36A" },
  Fire: { code: "F", text: "text-[#EF4444]", bg: "bg-[#EF4444]", soft: "bg-[#FEF2F2]", border: "border-[#FECACA]", hex: "#EF4444" },
  Architecture: { code: "A", text: "text-[#64748B]", bg: "bg-[#64748B]", soft: "bg-[#F8FAFC]", border: "border-[#E2E8F0]", hex: "#64748B" },
};

export const DISCIPLINE_NAMES = Object.keys(DISCIPLINES);

export function disc(name) {
  return DISCIPLINES[name] || DISCIPLINES.Architecture;
}