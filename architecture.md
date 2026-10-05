# Technical Architecture: Web Absensi Piket Angkatan 62

## 1. Technology Stack
- **Frontend Framework:** Vue.js 3 (via CDN, tanpa bundler/Node.js lokal yang rumit agar mudah dideploy).
- **Styling:** Vanilla CSS murni dengan pendekatan *mobile-first layout*.
- **Backend & API:** Google Apps Script (GAS) menggunakan JavaScript modern (V8 Engine).
- **Database:** Google Sheets (Menyimpan timestamp, nama, waktu piket, dan URL foto).
- **File Storage:** Google Drive (Menyimpan file gambar dokumentasi piket).
- **Hosting Opsi:** GitHub Pages, Netlify, atau Vercel (untuk file frontend statis).

---

## 2. Data Structure & Schema

### A. Google Sheets Schema (`DataAbsen`)
| Kolom | Nama Field | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| A | Timestamp | DateTime | Waktu otomatis saat data masuk ke server |
| B | Nama Mahasiswa | String | Diinput manual oleh mahasiswa |
| C | Waktu Piket | String | Pilihan: `06.30`, `12.00`, atau `16.00` |
| D | URL Foto | String (URL) | Tautan langsung menuju file gambar di Google Drive |

### B. Google Drive Structure
- **Root Folder:** `Absensi_Piket_62_Storage`
- **Naming Convention File Foto:** `{NamaMahasiswa}_{EpochTimestamp}.jpg` (Contoh: `Budi_1775452800000.jpg`)

---

## 3. Communication Protocol
- Pengiriman data dari frontend ke backend menggunakan metode **HTTP POST** dengan format **JSON payload**.
- Respons balik server menggunakan format JSON dengan parameter status (`success` atau `error`) untuk memicu notifikasi atau pesan <i>error handling</i> di antarmuka web.