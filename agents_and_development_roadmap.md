# Agents & Development Roadmap: Web Absensi Piket

Dokumen ini mendefinisikan peran sistem agen (Development Agents) serta panduan langkah demi langkah implementasi teknis untuk developer dan client.

---

## 1. Peran Agen (Agent Roles in Workflow)
- **Product Manager Agent:** Memastikan seluruh kebutuhan fungsional (PRD) terpenuhi sesuai ekspektasi client (Mahasiswa IPB 62 & Admin).
- **Architect Agent:** Merancang sistem integrasi antara Frontend Vue.js, Google Apps Script, Google Drive, dan Google Sheets secara efisien.
- **Coding / Implementation Agent:** Menulis kode program lengkap (Single-file HTML/JS/CSS) yang bersih, modular, dan ramah pengguna tingkat dasar.

---

## 2. Step-by-Step Implementation Roadmap

### Tahap 1: Persiapan Backend (Google Apps Script & Drive)
1. Buat folder di Google Drive khusus penyimpanan foto, catat **Folder ID**.
2. Buat Google Spreadsheet baru, beri nama sheet dengan identifikasi `DataAbsen`.
3. Masuk ke menu **Ekstensi > Apps Script**, lalu masukkan kode handler `doPost(e)` untuk manajemen upload file dan penulisan baris sheet.
4. Lakukan deploy sebagai **Aplikasi Web**, setel hak akses ke **"Siapa saja" (Anyone)**, dan salin URL Web App endpoint.

### Tahap 2: Pembuatan Frontend Mahasiswa (`index.html`)
1. Buat file HTML tunggal yang memuat CDN Vue.js 3.
2. Rancang struktur form input nama, pilihan jadwal piket, dan elemen file upload.
3. Tanamkan logika pengunci waktu (*computed properties*) berdasarkan jam sistem perangkat pengguna.
4. Tanamkan fungsi pembacaan file gambar via `FileReader` ke Base64 serta fungsi pengiriman `fetch` ke URL Web App Apps Script.

### Tahap 3: Pembuatan Frontend Admin (`admin.html`)
1. Buat file HTML admin terpisah dengan proteksi autentikasi PIN sederhana (`TNK61SVIPB`).
2. Rancang tabel rekapitulasi data dengan kolom Tanggal, Nama, Waktu Piket, dan tautan aksi foto.
3. Tambahkan fungsi *filter* tanggal interaktif untuk mempermudah rekapitulasi harian oleh admin.

### Tahap 4: Pengujian & Peluncuran (Deployment)
1. Uji coba pengiriman absensi langsung dari perangkat seluler (HP).
2. Verifikasi masuknya baris data ke Google Sheets dan file gambar ke Google Drive.
3. Unggah file HTML ke platform hosting statis gratis (seperti GitHub Pages) agar siap diakses oleh seluruh anggota angkatan 62.