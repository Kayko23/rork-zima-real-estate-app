export type Slot = { iso: string; label: string; available: boolean };

export async function fetchSlots(providerId: string, dateIso: string): Promise<Slot[]> {
  await sleep(150);
  const baseHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  return baseHours.map(h => {
    const iso = `${dateIso}T${h}:00.000Z`;
    return { iso, label: h, available: h !== '11:00' };
  });
}

export async function bookAppointment(params: {
  providerId: string;
  datetimeIso: string;
  message?: string;
}) {
  await sleep(300);
  return { id: `${Date.now()}`, ...params };
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
