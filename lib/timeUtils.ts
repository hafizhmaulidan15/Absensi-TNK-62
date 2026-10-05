import { PiketShift, ShiftInfo } from '@/types/attendance';

export const SHIFT_CONFIGS: ShiftInfo[] = [
  {
    shift: '06.30',
    name: 'Piket Pagi',
    timeRange: '06.30 - 06.40 WIB (Maks 10 Menit)',
    openHour: 6,
    openMinute: 30,
    closeHour: 6,
    closeMinute: 40,
    description: 'Pemberian pakan pagi, sanitasi kandang, dan recording ternak.',
  },
  {
    shift: '12.00',
    name: 'Piket Siang',
    timeRange: '12.00 - 12.10 WIB (Maks 10 Menit)',
    openHour: 12,
    openMinute: 0,
    closeHour: 12,
    closeMinute: 10,
    description: 'Pengecekan air minum ternak, ventilasi kandang, dan pakan hijauan.',
  },
  {
    shift: '16.00',
    name: 'Piket Sore',
    timeRange: '16.00 - 16.10 WIB (Maks 10 Menit)',
    openHour: 16,
    openMinute: 0,
    closeHour: 16,
    closeMinute: 10,
    description: 'Pemberian pakan sore, kontrol brooding/kandang, dan penutupan tirai.',
  },
];

/**
 * Mendapatkan jam, menit, detik dalam Waktu Indonesia Barat (WIB, Asia/Jakarta)
 */
export function getWIBTimeParts(date: Date): { hours: number; minutes: number; seconds: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(date);

    const hours = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const seconds = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);

    return { hours, minutes, seconds };
  } catch {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
  }
}

/**
 * Mendapatkan status shift dengan aturan: maksimal 10 menit setelah masuk waktunya
 */
export function getShiftAvailability(
  shift: PiketShift,
  currentTime: Date
): {
  isAvailable: boolean;
  reason: string;
  statusLabel: string;
  minutesRemaining?: number;
} {
  const config = SHIFT_CONFIGS.find((s) => s.shift === shift);
  if (!config) {
    return { isAvailable: false, reason: 'Shift tidak valid', statusLabel: 'Tidak Valid' };
  }

  const { hours, minutes } = getWIBTimeParts(currentTime);
  const currentTotalMinutes = hours * 60 + minutes;

  const openTotalMinutes = config.openHour * 60 + config.openMinute;
  const closeTotalMinutes = config.closeHour * 60 + config.closeMinute;

  // Jika sebelum jam masuk
  if (currentTotalMinutes < openTotalMinutes) {
    const diff = openTotalMinutes - currentTotalMinutes;
    const diffHours = Math.floor(diff / 60);
    const diffMins = diff % 60;
    const timeUntil = diffHours > 0 ? `${diffHours} jam ${diffMins} mnt lagi` : `${diffMins} menit lagi`;
    return {
      isAvailable: false,
      reason: `Belum dibuka. Dibuka tepat pukul ${String(config.openHour).padStart(2, '0')}.${String(config.openMinute).padStart(2, '0')} WIB (${timeUntil}).`,
      statusLabel: 'Belum Dibuka',
      minutesRemaining: diff,
    };
  }

  // Jika lewat 10 menit setelah jam masuk
  if (currentTotalMinutes > closeTotalMinutes) {
    return {
      isAvailable: false,
      reason: `Waktu presensi telah ditutup pukul ${String(config.closeHour).padStart(2, '0')}.${String(config.closeMinute).padStart(2, '0')} WIB (batas maksimal 10 menit setelah masuk).`,
      statusLabel: 'Telah Ditutup',
    };
  }

  // Sedang dalam rentang 10 menit
  const remaining = closeTotalMinutes - currentTotalMinutes;
  return {
    isAvailable: true,
    reason: `Sesi sedang aktif dibuka sampai pukul ${String(config.closeHour).padStart(2, '0')}.${String(config.closeMinute).padStart(2, '0')} WIB (sisa ${remaining} menit).`,
    statusLabel: 'Aktif Dibuka',
    minutesRemaining: remaining,
  };
}

/**
 * Format tanggal dalam Bahasa Indonesia (Zona Waktu Asia/Jakarta - WIB)
 */
export function formatIndonesianDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}

/**
 * Format jam dalam WIB (HH:mm:ss WIB, zona waktu Asia/Jakarta)
 */
export function formatWIBTime(date: Date): string {
  try {
    const formatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
    return `${formatted.replace(/\./g, ':')} WIB`;
  } catch {
    const { hours, minutes, seconds } = getWIBTimeParts(date);
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return `${h}:${m}:${s} WIB`;
  }
}

/**
 * Format tanggal DD/MM/YYYY dalam zona Asia/Jakarta (WIB)
 */
export function formatWIBDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    const d = new Date(date.getTime() + 7 * 3600 * 1000);
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(
      d.getUTCMonth() + 1
    ).padStart(2, '0')}/${d.getUTCFullYear()}`;
  }
}

/**
 * Hitung status kehadiran (Tepat Waktu)
 */
export function calculateAttendanceStatus(
  shift: PiketShift,
  time: Date
): 'Tepat Waktu' | 'Terlambat' | 'Toleransi' {
  const config = SHIFT_CONFIGS.find((s) => s.shift === shift);
  if (!config) return 'Tepat Waktu';

  const { hours, minutes } = getWIBTimeParts(time);
  const totalMin = hours * 60 + minutes;
  const closeMin = config.closeHour * 60 + config.closeMinute;

  if (totalMin <= closeMin) {
    return 'Tepat Waktu';
  } else {
    return 'Terlambat';
  }
}
