import { treatments } from "./spa-data";
export type CheckoutTreatment = {
  treatmentId: number;
  guestName: string;
  duration: string;
};
export function priceTreatments(
  items: CheckoutTreatment[],
  isHotelGuest: boolean,
) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 50)
    throw new Error("Select at least one treatment.");
  let subtotal = 0;
  let guests = 0;
  const services = items.map((item) => {
    const t = treatments.find((t) => t.id === item.treatmentId);
    if (!t || typeof item.guestName !== "string" || item.guestName.length > 100)
      throw new Error("Invalid treatment.");
    const durations = t.duration.split(" / ").map((d) => d.trim());
    const index = durations.indexOf(item.duration);
    if (index < 0) throw new Error("Select a valid treatment duration.");
    const prices = t.price
      .split(" / ")
      .map((p) => Number(p.replace(/[^\d]/g, "")));
    subtotal += prices[index] || prices[0] || t.priceValue;
    guests += t.isCouple ? 2 : 1;
    return `${item.guestName.replace(/[<>&"']/g, "")}: ${t.name} (${item.duration})`;
  });
  if (guests > 50) throw new Error("Too many guests.");
  return {
    amount: Math.round(subtotal * (isHotelGuest ? 0.9 : 1) * 100) / 100,
    guests,
    service: services.join(" | "),
  };
}
