# Riwayat Perubahan Project — Absensi Piket TNK 62

Semua perubahan dari commit pertama sampai commit terakhir, dikelompokkan per tujuan.
16 commit total, dari `3476631` sampai `4d4544c`.

---

## Commit 1 — `3476631` "first commit"

Hanya `README.md` (berisi boilerplate AI Studio), sebagai inisialisasi repo.

---

## Commit 2 — `a1b0bc5` "Add full project source, exclude secrets via .gitignore"

Project Next.js pertama dimasukkan ke Git.

**Bersihkan:**
- `README.md` — ganti boilerplate "AI Studio" dengan deskripsi + setup project
- `package.json` — nama `ai-studio-applet` → `presensi-piket-tnk62`
- `next.config.ts` — buang remotePatterns picsum.photos & logika HMR AI Studio
- `next.config.ts` — hapus `eslint.ignoreDuringBuilds: true` agar lint ikut berjalan saat build

**Buang:**
- `hooks/use-mobile.ts`, `lib/utils.ts`, `metadata.json`
- Dep tidak terpakai: `@google/genai`, `@hookform/resolvers`, `class-variance-authority`, `clsx`, `motion`, `firebase-tools`, `@tailwindcss/typography`, `tailwind-merge`
- `.env.example` (berisi referensAI Studio)

**Bug & keamanan:**
- `app/layout.tsx` — `lang="en"` → `lang="id"`
- `components/AdminDashboard.tsx` — PIN `TNK61SVIPB` dipindah ke `process.env.NEXT_PUBLIC_ADMIN_PIN`, fallback `'TNK61SVIPB'`
- `components/AdminDashboard.tsx` — hapus import `Calendar`, `RefreshCw`, `ExternalLink` yang tak terpakai
- `components/Navbar.tsx` — logo dari `<div onClick>` jadi `<button>` (bisa diakses keyboard)
- `.gitignore` — tambahkan `tsconfig.tsbuildinfo`

**Anti-slop (kriteria tidak boleh generik / palsu):**
- `components/HeroBanner.tsx` — hapus headline gradien biru→orange, ganti solid
- 6 file komponen — ganti `bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900` jadi `bg-blue-800`
- `components/Navbar.tsx` — hapus gradien logo
- `components/GuidanceModal.tsx` — teks "Jaminan Privasi & Integritas Data" → "Catatan Keamanan Data" yang jujur
- `components/StudentForm.tsx` — teks "terverifikasi di sistem" → "terimpan di sistem"
- `components/HeroBanner.tsx` — "Privasi Aman" → "Lokal Dulu"
- `components/GasConfigModal.tsx` — dot hijau "online" jadi abu saat offline

**Perbaikan logika:**
- `lib/timeUtils.ts` — tambah `formatWIBDate()` (sebelumnya tanggal pakai zona perangkat)
- `app/page.tsx` — auto pilih shift pakai WIB, bukan jam lokal
- `app/page.tsx` — localStorage: terima array kosong (sebelnya data yang dihapus muncul lagi setelah reload)
- `components/StudentForm.tsx` — hapus NIM palsu random; `verified` default `false`; `syncedToDrive` hanya `true` setelah fetch berhasil; tambah `AbortController` timeout 15 detik; hapus header `Content-Type: application/json` (di-strip oleh `no-cors`)
- `components/AdminDashboard.tsx` — filter 7 hari pakai zona Jakarta & tolak tanggal masa depan; input manual pakai WIB; escape CSV semua kolom; label "Excel" → "CSV"; "Terakhir diperbarui: Realtime" → teks jujur
- `lib/sampleData.ts` — timestamp UTC diselaraskan ke jam WIB; status `Toleransi` fiktif → `Terlambat`

**Bug animasi/responsive:**
- `app/globals.css` — definisikan `--breakpoint-xs: 30rem` dan `--animate-fade-in` (sebelumnya kelas `xs:` dan `animate-fade-in` tidak Generates apa-apa)

---

## Commit 3 — `006f356` "Hardcode GAS webhook URL, remove Setup Sheets UI, hapus data dummy"

**Perubahan:**
- `app/page.tsx` — URL GAS dipindah dari `localStorage` jadi konstanta
- `components/GasConfigModal.tsx` — **dihapus**; tombol "Setup Google Sheets" di admin dihapus
- `lib/sampleData.ts` — `INITIAL_RECORDS` jadi array kosong, `INITIAL_STUDENT_NAMES` dihapus

**Alasan:** data tidak masuk ke spreadsheet karena URL GAS tidak pernah tersimpan di browser yang dipakai submit. Mempercicodekan URL menghilangkan masalah itu.

---

## Commit 4 — `4817af6` "PIN admin fallback ke default supaya login selalu jalan"

`CORRECT_PIN` di `AdminDashboard.tsx` dapat fallback `'TNK61SVIPB'`. Sebelumnya kalau `NEXT_PUBLIC_ADMIN_PIN` belum diset di Vercel, PIN selalu kosong → login mustahil.

---

## Commit 5 — `c0484bc` "Kunci shift per jendela waktu; lewat 10 menit jadi Terlambat"

**Aturan baru** (`lib/timeUtils.ts`): tiap shift punya jendela pengisian sendiri.

| Shift | Jendela |
| :--- | :--- |
| Pagi | 06.00 – 11.59 |
| Siang | 12.00 – 15.59 |
| Sore | 16.00 – 21.00 |

- `components/StudentForm.tsx` — shift terkunci tidak bisa diklik, tombol kirim nonaktif
- `components/HeroBanner.tsx` — ikon Lock → AlertTriangle untuk status Terlambat
- `app/page.tsx` — rentang auto pilih shift disesuaikan
- `components/GuidanceModal.tsx` — teks toleransi diperbarui

---

## Commit 6 — `fc3077d` "Lokasi jadi Kandang Itik & Puyuh, placeholder nama/NIM, perbaiki Kak Riswi"

- `types/attendance.ts` — `UnitLocation` disempit jadi `Kandang Itik` / `Kandang Puyuh`
- `components/StudentForm.tsx`, `components/AdminDashboard.tsx` — dropdown lokasi disesuaikan
- Placeholder nama → `Riswidaressi Widyatanti Namirah Ramadhan`, NIM → `J0409241045`
- `components/GuidanceModal.tsx` — "Kak Riwsi" → "Kak Riswi"; "SV / Fapet" → "SV IPB"
- `components/AdminDashboard.tsx`, `components/GuidanceModal.tsx` — "Teknologi Peternakan" → "Teknologi dan Manajemen Ternak SV IPB"

---

## Commit 7 — `9c4075b` "Hapus chip saran nama, hapus daftar nama dummy"

Chip "Saran: Ahmad, Siti, Budi" dihapus dari form, `INITIAL_STUDENT_NAMES` dihapus dari `lib/sampleData.ts`.

---

## Commit 8 — `3bb03ff` "Perbarui SOP: pakaian WP+boots, dokumentasi timestamp/map cam, toleransi 10 menit"

`components/GuidanceModal.tsx` ditulis ulang:
- Judul → "Jadwal Sesi Piket & Toleransi Waktu"
- Kartu shift menampilkan "Toleransi tepat waktu: maks 10 menit"
- Section 2 → "SOP Pakaian & APD": WP Praktikum + sepatu boots
- Section 3 → "SOP Dokumentasi Foto": timestamp/map cam

---

## Commit 9 — `e440b33` / Commit 11 — `11a5a12` "Update URL webhook GAS"

Penyesuaian `GAS_WEBHOOK_URL` di `app/page.tsx` setelah lu membuat deployment baru di Apps Script.

---

## Commit 10 — `d22238e` "Refresh local dev server, no source changes"

Commit kosong — hanya untuk memicu Vercel rebuild. Tidak ada perubahan kode.

---

## Commit 12 — `ba29bc8` "Matikan mode testing, kunci jam shift aktif kembali"

Selama troubleshoot, ada flag `NEXT_PUBLIC_UNLOCK_ALL` untuk melepas kunci waktu supaya bisa tes upload di luar jam shift. Flag ini dihapus dari `.env.local` dan dari `lib/timeUtils.ts`.

---

## Commit 13 — `468df65` "Kamera wajib untuk foto bukti, tambah favicon"

**Perubahan besar — foto wajib dari kamera:**
- `components/StudentForm.tsx`
  - Hapus seluruh `handleFileUpload` (~55 baris)
  - Hapus input `<input type="file">` dan tampilan "Unggah File"
  - Hapus switcher mode Galeri vs Kamera
  - Kamera auto-start saat form dibuka
  - `startCamera` / `stopCamera` dibungkus `useCallback` agar cleanup stabil
  - `useCallback` masuk ke import React
  - Pesan validasi → "Foto dokumentasi wajib diambil langsung dari kamera."
- `app/icon.svg` — favicon baru (menghilangkan 404 `favicon.ico`)
- `app/layout.tsx` — `icons: { icon: '/icon.svg' }`

**Diverifikasi dengan Playwright + Chromium headless (viewport iPhone 14 390×844, kamera sintetis):** kamera live, `<video>` ada, snapshot menghasilkan data URL 29 KB, `input[type=file]` = 0, submit sukses, 0 error console.

---

## Commit 14 — `dade333` "Dashboard admin ambil data dari spreadsheet, perbaiki render foto non-URL"

**Bug:** dashboard admin hanya membaca `localStorage` browser sendiri, jadi data dari mahasiswa lain / HP lain tidak pernah terlihat — padahal spreadsheet sudah berisi.

**Perubahan (`components/AdminDashboard.tsx`):**
- `loadFromSheet()` memanggil GAS `doGet` begitu admin login
- Mapping JSON sheet → `AttendanceRecord`
- `rows` dipakai sebagai sumber utama; `records` (localStorage) jadi cadangan
- Indikator sumber data + tombol **Segarkan**
- Filter tanggal default → "Semua" (data sheet sudah berformat `dd/MM/yyyy`)
- Filter 7 hari tetap memakai zona Jakarta
- `isViewablePhoto()` — hanya render `<img>` untuk `data:image/` atau `http(s)`. Nilai `[FILE] Nama_Timestamp` ditampilkan sebagai ikon kamera
- Modal preview menampilkan referensi foto sebagai teks kalau bukan URL

**Verifikasi:** dashboard menampilkan 3 baris dari spreadsheet (Azkya Suci Pertiwi, Himmah Aliyah, Riswidaressi Widyatanti), pencarian berfungsi, tombol Segarkan mempertahankan data, 0 error.

---

## Commit 15 — `c83ba95` "Input manual admin kirim ke spreadsheet, pilih status, upload foto, badge Manual"

**Bug:** input manual admin hanya tersimpan di localStorage, tidak pernah masuk spreadsheet. Status terkunci jadi teks "Tepat Waktu".

**Perubahan (`components/AdminDashboard.tsx`):**
- `handleCreateManual` jadi `async`, POST ke GAS dengan `action: 'submitManualAttendance'`
- Field Status jadi dropdown: Tepat Waktu / Terlambat / Toleransi
- Upload foto opsional + pratinjau + tombol hapus
- State baru: `manualStatus`, `manualPhoto`, `manualPhotoPreview`, `isSavingManual`, `manualError`
- Badge abu "Manual" muncul di baris tabel bila Catatan memuat `manual`
- `verified` untuk baris sheet dideteksi dari isi Catatan

**Perubahan (`Code.gs`):**
- Deteksi `action === 'submitManualAttendance'`
- Tambahkan akhiran `[INPUT MANUAL]` ke kolom Catatan
- Default status bila kosong

**Verifikasi:** baris manual muncul di spreadsheet dengan `Terlambat` dan `[INPUT MANUAL]` di Catatan.

---

## Commit 16 — `4d4544c` "Update URL webhook GAS ke deployment terbaru"

Penyesuaian `GAS_WEBHOOK_URL` setelah deployment dengan `[INPUT MANUAL]` aktif — sudah diuji POST dan GET.

---

## Ringkasan Masalah Besar yang Pernah Muncul

| Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| Data tidak masuk spreadsheet | URL GAS tidak tersimpan di browser pengaju | URL di-hardcode di `app/page.tsx` |
| Data tidak muncul di admin | Admin hanya baca localStorage | Admin baca `doGet` dari Apps Script |
| `Akses ditolak: DriveApp` | Google blokir `DriveApp` untuk web app anonim | Fallback: tulis referensi `[FILE] Nama_Timestamp` |
| `ID file atau folder tidak valid: ...?hl` | `FOLDER_ID` ikut berisi `?hl` | Perbaiki hanya ID-nya |
| `Akses ditolak: DriveApp` setelah `?hl` diperbaiki | Otorisasi Drive belum di-deploy dengan versi baru | Jalankan `testDriveAuth()` di editor, lalu deploy versi baru |
| Login PIN selalu gagal di Vercel | `NEXT_PUBLIC_ADMIN_PIN` belum diset di Vercel | PIN dapat fallback hardcoded |
| `animate-fade-in` & `xs:` tidak berfungsi | Token belum didefinisikan di Tailwind v4 | Definisi `@theme` di `globals.css` |
| 404 `favicon.ico` | Tidak ada favicon | `app/icon.svg` |
| Chip Distribusi Sesi melenceng | Flex container tanpa wrap | `flex-wrap` |
| Kelas `Upload` tak terpakai | Sisa upload galeri | Import dibersihkan |