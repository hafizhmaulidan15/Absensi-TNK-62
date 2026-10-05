import { AttendanceRecord } from '@/types/attendance';

// Helper SVG placeholder generator for realistic documentation photo preview
function generateSamplePhotoDataUrl(name: string, shift: string, location: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0254D8"/>
        <stop offset="100%" stop-color="#0B2545"/>
      </linearGradient>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>
    <circle cx="300" cy="180" r="70" fill="#FF7A00" opacity="0.9"/>
    <path d="M260 210 Q300 240 340 210 L330 260 L270 260 Z" fill="#FFFFFF" opacity="0.3"/>
    <text x="300" y="170" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">DOKUMENTASI PIKET</text>
    <text x="300" y="200" fill="#FFD580" font-family="sans-serif" font-size="16" text-anchor="middle">TNK 62 - IPB UNIVERSITY</text>
    <rect x="40" y="310" width="520" height="100" rx="12" fill="#000000" opacity="0.6"/>
    <text x="60" y="340" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">MAHASISWA: ${name.toUpperCase()}</text>
    <text x="60" y="365" fill="#A0C4FF" font-family="sans-serif" font-size="13">SHIFT: ${shift} WIB Â· TERVERIFIKASI</text>
    <text x="60" y="390" fill="#E2E8F0" font-family="sans-serif" font-size="12">LOKASI: ${location}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_STUDENT_NAMES = [
  'Ahmad Fauzi Rahman',
  'Siti Nurhaliza Azzahra',
  'Budi Santoso',
  'Dewi Sartika Lestari',
  'Rizky Pratama Ramadhan',
  'Putri Ayu Handayani',
  'Fajar Nugroho',
  'Anisa Tri Wahyuni',
  'Muhammad Rayhan Dwi',
  'Nabila Salsabila',
  'Ilham Kurniawan',
  'Zahra Aulia Citra'
];

export const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: 'TNK62-REC-001',
    timestamp: '2026-10-04T23:28:10.000Z',
    formattedDate: '05/10/2026',
    formattedTime: '06:28:10 WIB',
    studentName: 'Ahmad Fauzi Rahman',
    studentNim: 'J0301221015',
    shift: '06.30',
    location: 'Kandang Ruminansia Besar (Sapi Perah & Potong)',
    photoUrl: generateSamplePhotoDataUrl('Ahmad Fauzi Rahman', '06.30', 'Kandang Sapi Perah'),
    notes: 'Pemberian pakan konsentrat pagi 30kg dan pembersihan saluran sanitasi kandang A.',
    status: 'Tepat Waktu',
    verified: true,
    syncedToDrive: true,
  },
  {
    id: 'TNK62-REC-002',
    timestamp: '2026-10-04T23:35:22.000Z',
    formattedDate: '05/10/2026',
    formattedTime: '06:35:22 WIB',
    studentName: 'Siti Nurhaliza Azzahra',
    studentNim: 'J0301221042',
    shift: '06.30',
    location: 'Kandang Unggas (Broiler & Layer)',
    photoUrl: generateSamplePhotoDataUrl('Siti Nurhaliza Azzahra', '06.30', 'Kandang Broiler & Layer'),
    notes: 'Pemberian air minum vitamin vita-stress dan pencatatan mortalitas hari ke-21.',
    status: 'Tepat Waktu',
    verified: true,
    syncedToDrive: true,
  },
  {
    id: 'TNK62-REC-003',
    timestamp: '2026-10-05T00:15:05.000Z',
    formattedDate: '05/10/2026',
    formattedTime: '07:15:05 WIB',
    studentName: 'Budi Santoso',
    studentNim: 'J0301221008',
    shift: '06.30',
    location: 'Laboratorium Nutrisi dan Pakan Ternak',
    photoUrl: generateSamplePhotoDataUrl('Budi Santoso', '06.30', 'Lab Nutrisi Pakan'),
    notes: 'Preparasi sampel silase rumput gajah dan uji kadar bahan kering.',
    status: 'Terlambat',
    verified: true,
    syncedToDrive: true,
  },
  {
    id: 'TNK62-REC-004',
    timestamp: '2026-10-04T05:05:40.000Z',
    formattedDate: '04/10/2026',
    formattedTime: '12:05:40 WIB',
    studentName: 'Rizky Pratama Ramadhan',
    studentNim: 'J0301221088',
    shift: '12.00',
    location: 'Pabrik Mini Pengolahan Pakan (Feed Mill)',
    photoUrl: generateSamplePhotoDataUrl('Rizky Pratama Ramadhan', '12.00', 'Feed Mill Mini IPB'),
    notes: 'Pencampuran bahan baku dedak padi dan bungkil kedelai 100kg batch siang.',
    status: 'Tepat Waktu',
    verified: true,
    syncedToDrive: true,
  },
  {
    id: 'TNK62-REC-005',
    timestamp: '2026-10-04T09:12:15.000Z',
    formattedDate: '04/10/2026',
    formattedTime: '16:12:15 WIB',
    studentName: 'Putri Ayu Handayani',
    studentNim: 'J0301221029',
    shift: '16.00',
    location: 'Kandang Ruminansia Kecil (Domba & Kambing)',
    photoUrl: generateSamplePhotoDataUrl('Putri Ayu Handayani', '16.00', 'Kandang Domba & Kambing'),
    notes: 'Pemberian pakan rumput odot sore dan pengecekan kesehatan cempe.',
    status: 'Tepat Waktu',
    verified: true,
    syncedToDrive: true,
  },
  {
    id: 'TNK62-REC-006',
    timestamp: '2026-10-04T09:45:00.000Z',
    formattedDate: '04/10/2026',
    formattedTime: '16:45:00 WIB',
    studentName: 'Fajar Nugroho',
    studentNim: 'J0301221063',
    shift: '16.00',
    location: 'Unit Pengolahan Limbah & Biogas',
    photoUrl: generateSamplePhotoDataUrl('Fajar Nugroho', '16.00', 'Unit Biogas SV IPB'),
    notes: 'Pengisian slurry digester biogas kapasitas 200 liter feses sapi.',
    status: 'Terlambat',
    verified: true,
    syncedToDrive: true,
  },
];

