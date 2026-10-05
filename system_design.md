# System Design: Web Absensi Piket Teknologi Peternakan IPB 62

## 1. Architecture & Data Flow Diagram
```
[ Mobile Browser (Mahasiswa) ] 
       │
       ├── (1) Input Form & Upload Foto (Base64)
       ▼
[ Frontend Vue.js (index.html) ] 
       │
       ├── (2) HTTP POST Request (JSON Payload)
       ▼
[ Google Apps Script (Backend API) ] 
       ├── (3) Decode Base64 & Simpan File ──► [ Google Drive (Folder Dokumentasi) ]
       └── (4) Append Row Data ─────────────► [ Google Sheets (DataAbsen Sheet) ]
```

---

## 2. Component Design

### A. Frontend Tier (HTML5 + CSS + Vue.js 3 CDN)
- **`index.html` (Form Mahasiswa):**
  - Mengelola state input formulir (`nama`, `waktu`, `foto`).
  - Mengimplementasikan `computed properties` untuk memvalidasi jam sistem secara real-time dan mengaktifkan/menonaktifkan pilihan waktu piket (`disabled` attribute).
  - Menggunakan API `FileReader` untuk mengonversi file gambar lokal ke format `Base64` string sebelum dikirim melalui `fetch`.
- **`admin.html` (Dashboard Admin):**
  - Mengelola state login (`isLoggedIn`, `inputPin`).
  - Mengambil data rekapitulasi dari backend (atau mensimulasikan data via state lokal terhubung API Sheet) dan menyediakan fungsi filter tanggal (`computed dataFiltered`).

### B. Backend Tier (Google Apps Script - GAS)
- Berjalan di atas serverless infrastructure Google.
- Mengekspos fungsi `doPost(e)` untuk menerima payload JSON berisi string Base64 dan parameter teks.
- Menangani konversi Base64 menjadi file Blob biner, mengunggahnya ke Google Drive spesifik folder ID, dan memberikan hak akses `ANYONE_WITH_LINK` agar link foto dapat diakses oleh admin.
- Menuliskan baris baru (`appendRow`) pada Google Spreadsheet target.

---

## 3. Security & Validation Design
- **Penguncian Jadwal (Time Lock Logic):**
  - Jadwal Pagi (06.30): Terbuka jam 06.00 s.d. 08.00.
  - Jadwal Siang (12.00): Terbuka jam 11.00 s.d. 13.00.
  - Jadwal Sore (16.00): Terbuka jam 15.00 s.d. 17.00.
- **Proteksi Admin:** Menggunakan string literal PIN rahasia `TNK61SVIPB` di tingkat antarmuka klien admin untuk menyaring akses tidak sah secara cepat.