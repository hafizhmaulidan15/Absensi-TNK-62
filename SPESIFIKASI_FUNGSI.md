# Spesifikasi Teknis & Fungsional — Absensi Piket TNK 62

Dokumen ini dipakai sebagai acuan saat membuat salinan project.
Berisi **ketentuan** (aturan main) dan **fungsi** (apa saja yang bisa dilakukan).

---

## 1. Identitas Proyek

| Item | Nilai |
| :--- | :--- |
| Nama Aplikasi | Presensi Piket TNK 62 |
| Institucional | Program Studi Teknologi dan Manajemen Ternak (TNK), Sekolah Vokasi IPB University |
| Angkatan | 62 |
| Zona waktu | Asia/Jakarta (WIB) — seluruh perhitungan waktu memakai zona ini, bukan zona perangkat |
| Repo | `https://github.com/hafizhmaulidan15/Absensi-TNK-62` |
| Hosting | Vercel — `https://absensi-tnk-62.vercel.app` |
| Akses admin | `https://absensi-tnk-62.vercel.app/#admin` |

---

## 2. Arsitektur

```
[ Browser HP / Laptop ]
        |
        |  (1) Isi form + ambil foto dari kamera
        v
[ Next.js 15 (app/page.tsx) ]  -- React 19, Tailwind CSS 4
        |
        |  (2) POST JSON (mode: no-cors) ke Google Apps Script
        v
[ Google Apps Script : Code.gs ]
        |
        +--> (3) Simpan foto ke Google Drive (folder wajib) / fallback nama referensi
        +--> (4) Tambah baris ke Google Sheets (sheet wajib)
        |
        v
[ Panel Admin ]
        |
        |  (5) GET /exec -> JSON semua baris sheet
        +--> tabel rekap, filter, statistik, ekspor CSV
```

**Prinsip penting:** seluruh aturan waktu dihitung di server/browser dengan `Intl` timezone `Asia/Jakarta`. Jangan pernah memakai `new Date().getHours()` langsung untuk aturan bisnis.

---

## 3. Pilihan Teknis (dan alasannya)

| Keputusan | Alasan |
| :--- | :--- |
| Next.js App Router + React 19 | Satu aplikasi, satu URL; halaman admin cukup lewat `#admin` tanpa routing tambahan |
| Tailwind CSS v4 | Token konsisten, `globals.css` hanya 1 baris import + definisi `@theme` |
| TypeScript strict (`ignoreBuildErrors: false`) | Build gagal kalau ada tipe salah — buds张口 termasuk galat yang lolos review |
| Tanpa database eksternal | Google Sheets cukup untuk skala satu angkatan; nol biaya hosting |
| `mode: 'no-cors'` saat POST | Google Apps Script tidak mengirim header CORS; `no-cors` +
  `Content-Type: text/plain` adalah satu-satunya cara POST lintas origin yang lolos preflight |

---

## 4. KETENTENTAN (Aturan Main)

### 4.1 Shift Piket

| Shift | Jam | Nama | Toleransi (tepat waktu sampai) |
| :--- | :--- | :--- | :--- |
| `06.30` | 06.30 WIB | Piket Pagi | 06.40 WIB |
| `12.00` | 12.00 WIB | Piket Siang | 12.10 WIB |
| `16.00` | 16.00 WIB | Piket Sore | 16.10 WIB |

### 4.2 Jendela Pengisian (Kunci Jam)

Setiap shift hanya bisa diisi di rentang jamnya. Di luar itu, kartu shift displays **Terkunci** dan tombol kirim nonaktif.

| Shift | Bisa diisi |
| :--- | :--- |
| Pagi | 06.00 – 11.59 WIB |
| Siang | 12.00 – 15.59 WIB |
| Sore | 16.00 – 21.00 WIB |

Di luar semua jendela (21.00 – 06.00), **tidak ada** shift yang bisa diisi.

### 4.3 Toleransi dan Status

| Kondisi | Status | Bisa kirim? |
| :--- | :--- | :--- |
| Sebelum jam shift (masih dalam jendela) | `Belum Masuk Jam` | Ya |
| Tepat pada jam shift sampai +10 menit | `Tepat Waktu` | Ya |
| Setelah lewat +10 menit (tapi masih dalam jendela) | `Terlambat` | **Ya** — sengaja boleh, supaya tetap tercatat |
| Di luar jendela | `Terkunci` | **Tidak** |

**Rumus status** (`calculateAttendanceStatus`):
`totalMenitWIB <= (jamShift + 10 menit)` → `Tepat Waktu`, selain itu → `Terlambat`.

### 4.4 Form Mahasiswa

| Field | Aturan |
| :--- | :--- |
| Nama Lengkap | Wajib |
| NIM | Wajib (boleh kosong di kode, tapi_ui mengarahkan pengisian) |
| Shift | Wajib; terkunci di luar jendela (§4.2) |
| Lokasi | Kandang Itik / Kandang Puyuh (hanya dua) |
| Foto | **Wajib, hanya dari kamera** — tidak ada upload galeri |
| Catatan | Opsional; default: `Piket kandang/laboratorium terlaksana tepat waktu.` |

### 4.5 Foto — Ketentuan Wajib

1. Foto hanya boleh diambil lewat kamera bawaan (`getUserMedia`), bukan galeri.
2. Kamera otomatis menyala saat form dibuka;Orientation `environment` (belakang) sebagai default.
3. Tombol **"Ambil Foto Sekarang"** mengambil frame ke canvas.
4. Canvas diberi watermark: baris biru tua berisi `TNK 62 IPB · PIKET <shift> WIB` dan baris kedua `nama | tanggal jam WIB`.
5. Format keluaran: `data:image/jpeg;base64,...` kualitas 0.85.

**Alasan kenapa galeri dihapus:**的药tu》规定 agar bukti picnik tidak memakai foto lama.

### 4.6 Data Manual (Panel Admin)

| Field | Aturan |
| :--- | :--- |
| Nama | Wajib |
| NIM | Opsional |
| Shift | Pagi / Siang / Sore |
| Status | Bisa dipilih: `Tepat Waktu` / `Terlambat` / `Toleransi` |
| Lokasi | Kandang Itik / Kandang Puyuh |
| Foto | Opsional (boleh upload dari perangkat) |
| Catatan | Opsional; default: `Presensi susulan diinput manual oleh Admin / Dosen.` |

Data manual otomatis diberi akhiran `[INPUT MANUAL]` pada kolom Catatan di spreadsheet, dan di dashboard muncul badge abu **Manual**.

### 4.7 Keamanan

| Item | Nilai | Catatan |
| :--- | :--- | :--- |
| PIN admin | `TNK61SVIPB` | Disimpan di `.env.local` sebagai `NEXT_PUBLIC_ADMIN_PIN`, tidak masuk repo |
| Fallback PIN | `TNK61SVIPB` | Hardcoded di `AdminDashboard.tsx` sebagai cadangan bila env belum diset |
| Akses spreadsheet | Publik (`Siapa saja`) |anyone bisa baca/tulis — **cukup untuk internal, bukan untuk data sensitif** |

> Catatan jujur: PIN dicek di sisi klien, jadi siapa pun yang Inspect Element bisa melihatnya di bundle JS. Untuk produksi sungguhan, autentikasi harus pindah ke server (route handler + session).

---

## 5. FUNGSI (Fitur)

### 5.1 Halaman Mahasiswa (`/`)

| Fungsi | Detail |
| :--- | :--- |
| Jam live | Jam WIB berjalan di navbar, update tiap 1 detik |
| Auto pilih shift | Jam 06–12 → Pagi, 12–16 → Siang, 16–21 → Sore |
| Hero banner | 3 kartu shift + status (`Tepat Waktu` / `Belum Masuk Jam` / `Terkunci` / `Terlambat`) + jam WIB |
| Foto kamera | Live preview, tombol balik kamera, snapshot dengan watermark, ambil ulang |
| Validasi | Nama wajib, foto wajib, shift harus tidak terkunci |
| Submit | Kirim ke GAS, tampilkan kartu hasil (nama, NIM, waktu, shift, lokasi, status, penyimpanan) |
| Reset form | Otomatis kosong setelah submit sukses |

### 5.2 Panel Admin (`/#admin`)

| Fungsi | Detail |
| :--- | :--- |
| Login | PIN, tombol tampil/sembunyikan, pesan "Password salah" |
| Sumber data | Ambil dari spreadsheet via `doGet`, fallback ke localStorage |
| Tombol Segarkan | Tarik ulang data sheet |
| Indikator status | Titik hijau (siap) / amber (memuat) / merah (gagal) |
| Filter tanggal | Semua / Hari Ini / Kemarin / 7 Hari / Tanggal khusus |
| Filter shift | Semua / Pagi / Siang / Sore |
| Filter status | Semua / Tepat Waktu / Toleransi / Terlambat |
| Pencarian | Nama, NIM, atau lokasi |
| Statistik KPI | Total, presensi hari ini, tingkat ketepatan waktu, distribusi sesi |
| Badge Manual | Otomatis muncul bila Catatan memuat `[INPUT MANUAL]` |
| Pratinjau foto | Klik thumbnail → modal detail |
| Ekspor CSV | `Rekap_Presensi_Piket_TNK62_<tanggal>.csv` (dengan BOM UTF-8) |
| Tambah manual | Modal dengan upload foto + pilih status |
| Verifikasi | Tandai baris sudah diverifikasi |
| Hapus | Hapus baris (dengan konfirmasi) |

### 5.3 Modal SOP (tombol "SOP" di navbar)

1. Jadwal sesi & toleransi waktu
2. SOP pakaian & APD — WP Praktikum + sepatu boots
3. SOP dokumentasi foto — timestamp/map cam
4. Kontak bantuan — Kak Riswi TNK 61

---

## 6. Struktur Data

### 6.1 Google Sheets — sheet `DataAbsen`

Header baris 1 **wajib** ada:

| Kolom | Nama | Tipe |
| :--- | :--- | :--- |
| A | Timestamp | DateTime (otomatis) |
| B | Nama Mahasiswa | String |
| C | NIM | String |
| D | Waktu Piket | `06.30` / `12.00` / `16.00` |
| E | Lokasi | `Kandang Itik` / `Kandang Puyuh` |
| F | Status | `Tepat Waktu` / `Terlambat` / `Toleransi` |
| G | Catatan | String |
| H | URL Foto | String (URL Drive **atau** `[FILE] Nama_Timestamp.ext`) |

> ⚠️ Baris 1 dianggap header dan dilewati oleh `doGet`. Kalau baris 1 bukan header, baris pertama akan hilang saat dashboard membaca data.

### 6.2 Tipe TypeScript (`types/attendance.ts`)

```ts
PiketShift  = '06.30' | '12.00' | '16.00'
UnitLocation = 'Kandang Itik' | 'Kandang Puyuh'

AttendanceRecord {
  id, timestamp, formattedDate, formattedTime,
  studentName, studentNim, shift, location,
  photoUrl, notes?, status, verified, syncedToDrive?
}
```

### 6.3 Kontrak Payload API

**POST** — dipakai form mahasiswa *dan* input manual admin:

```json
{
  "action": "submitManualAttendance",   // kosong / absen untuk mahasiswa
  "timestamp": "2026-10-05T09:05:00.000Z",
  "namaMahasiswa": "...",
  "nim": "J0409241045",
  "waktuPiket": "16.00",
  "lokasi": "Kandang Itik",
  "status": "Tepat Waktu",
  "catatan": "...",
  "fotoBase64": "data:image/jpeg;base64,..."
}
```

**GET** — respons `doGet`:

```json
{
  "status": "success",
  "data": [
    { "timestamp": "...", "tanggal": "07/10/2026", "waktu": "16:10:35",
      "nama": "...", "nim": "...", "shift": "16.00", "lokasi": "...",
      "status": "...", "catatan": "...", "urlFoto": "..." }
  ]
}
```

Baris diurutkan **terbaru di atas** (`rows.reverse()`).

---

## 7. Fungsi `Code.gs`

| Fungsi | Tugas |
| :--- | :--- |
| `doPost(e)` | Baca JSON → validasi → coba upload foto ke Drive → tulis 1 baris ke Sheets |
| `doGet()` | Baca semua baris, format tanggal/jam, kembalikan JSON (terbaru dulu) |
| `testDriveAuth()` | Dipakai sekali untuk memicu layar izin Drive dari editor |
| `jsonResponse_(obj)` | Helper output JSON |

**Konfigurasi wajib di baris atas:**

```js
var FOLDER_ID = '1TKNlED9BeDMprU_nbURm6CR17XfSW5AZ';  // tanpa ?hl atau parameter lain
var SHEET_NAME = 'DataAbsen';
```

### 7.1 Kenapa kolom URL Foto berisi `[FILE] ...`

Google memblokir `DriveApp` untuk web app yang bisa diakses anonim. Solusinya dipakai project ini: `doPost` mencoba upload, dan bila gagal tetap menulis baris dengan referensi nama file:

```
[FILE] Riswidaressi_Widyatanti_Namirah_Ramadhan_1791258229332.jpeg
```

Mahasiswa bisa mencari referensi ini untuk mencocokkan dengan foto di perangkatnya.

---

## 8. Setup Salinan Project

### 8.1 Kebutuhan
- Node.js 18+
- Akun Google (untuk Sheets + Apps Script + Drive)

### 8.2 Langkah

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
npm start
```

### 8.3 Wajib diganti saat menyalin

| Yang | Di mana | Ganti dengan |
| :--- | :--- | :--- |
| `FOLDER_ID` | `Code.gs` | ID folder Drive milik angkatan lu |
| `SHEET_NAME` | `Code.gs` | Nama tab sheet lu |
| `GAS_WEBHOOK_URL` | `app/page.tsx` | URL `/exec` dari **deployment terbaru** lu |
| `NEXT_PUBLIC_ADMIN_PIN` | `.env.local` | PIN pilihan lu |
| Nama angkatan | `app/layout.tsx`, `components/Navbar.tsx`, `metadata` | Official lu |

> 🔴 `GAS_WEBHOOK_URL` wajib memakai URL deployment **terakhir**. URL lama tetap hidup dan akan menulis ke sheet lama.

### 8.4 Publish ulang Apps Script

Setelah mengganti kode: **Deploy → Kelola deployment → pensil → New version → Deploy**. URL `/exec` tidak berubah.

---

## 9. Testing

Sudah ada pola tes browser yang dipakai selama pengembangan (Playwright, Chromium headless, viewport iPhone 14 390×844):

- Kamera menyala otomatis, `<video>` ada, tombol snapshot ada
- `input[type=file]` = 0 (galeri sudah dihapus)
- Isi form → snapshot → preview data URL → submit → kartu hasil muncul
- Shift terkunci tampil untuk shift di luar jendela
- Admin: password salah ditolak, password benar → tabel berisi data dari sheet
- 0 error di console, 0 request 404

**Untuk tes lokal di HP:** jalankan `npm run dev -- -H 0.0.0.0`, lalu buka `http://<IP-LAPTOP>:3000`. Catatan: `getUserMedia` butuh HTTPS atau `localhost`, jadi dari HP dalam jaringan lokal kamera **tidak akan aktif**. Tes kamera lewat Vercel (HTTPS).

---

## 10. Batasan yang Diketahui

1. **Foto tidak tersimpan di Drive.** Google memblokir `DriveApp` untuk web app anonim. Yang tersimpan hanya referensi nama file.
2. **PIN bisa dibaca dari source.** Autentikasi masih di sisi klien.
3. **Tidak ada hapus baris di spreadsheet.** `doPost` hanya menambah; tombol Hapus hanya membersihkan localStorage browser.
4. **localStorage punya kuota ±5 MB.** Foto base64 di browser bisa memakka.
5. **SheetTreat baris 1 sebagai header.**