# Product Requirements Document (PRD): Web Absensi Piket Mahasiswa Teknologi Peternakan IPB Angkatan 62

## 1. Overview
Aplikasi web absensi piket harian untuk mahasiswa program studi Teknologi Peternakan IPB Angkatan 62. Proyek ini dirancang agar ringan, mudah diakses melalui perangkat seluler (HP), dan menggunakan ekosistem Google (Google Sheets dan Google Drive) sebagai backend dan penyimpanan data tanpa memerlukan server berbayar terpisah.

---

## 2. Target Pengguna & Role
- **Mahasiswa (Angkatan 62):** Pengguna yang mengisi formulir kehadiran piket harian.
- **Admin (Client):** Pengelola tunggal yang memiliki hak akses penuh untuk memantau, memverifikasi, dan merekap data absensi. Password akses admin: `TNK61SVIPB`.

---

## 3. Fitur Utama

### A. Halaman Mahasiswa (Client-Facing)
1. **Formulir Absensi (Mobile-Friendly):** Antarmuka web sederhana yang dioptimalkan untuk perangkat seluler.
2. **Input Nama Manual:** Kolom teks bebas bagi mahasiswa untuk memasukkan nama lengkap mereka.
3. **Pengunci Waktu Otomatis (Time Locking):** 
   - Pilihan waktu piket (06.30, 12.00, dan 16.00) dikunci secara dinamis oleh sistem berdasarkan jam perangkat/browser.
   - Tombol pilihan dan pengiriman hanya aktif pada rentang waktu spesifik jadwal piket untuk menghindari kecurangan atau absen di luar jadwal.
4. **Upload Foto Dokumentasi:** Fitur wajib untuk mengambil gambar langsung dari kamera HP atau memilih dari galeri sebagai bukti dokumentasi piket.
5. **Privasi & Keamanan Dasar:** Setelah tombol kirim ditekan dan sukses, data langsung dikirim ke backend dan mahasiswa tidak memiliki akses untuk melihat riwayat atau data absen rekan mahasiswa lainnya.

### B. Halaman Admin (Protected Dashboard)
1. **Autentikasi PIN Rahasia:** Halaman login khusus yang membutuhkan kode PIN (`TNK61SVIPB`) untuk membuka panel kontrol.
2. **Tabel Laporan Rekapitulasi:** Tabel interaktif yang menampilkan seluruh data masuk secara real-time, meliputi:
   - Tanggal & Waktu Pengiriman
   - Nama Mahasiswa
   - Waktu Piket Terpilih
   - Tautan/Tombol langsung untuk melihat foto bukti dokumentasi.
3. **Filter Data Berdasarkan Tanggal:** Fitur pencarian/penyaringan data absensi secara spesifik berdasarkan tanggal pilihan admin.
4. **Penyimpanan Terpusat:** Data teks tersimpan otomatis ke Google Sheets milik admin, sementara file gambar dokumentasi tersimpan rapi di Google Drive admin.