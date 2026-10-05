'use client';

import React, { useState } from 'react';
import { X, Cloud, Copy, Check, FileSpreadsheet, HardDrive, Sparkles, ExternalLink } from 'lucide-react';

interface GasConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasWebhookUrl: string;
  setGasWebhookUrl: (url: string) => void;
}

const GAS_CODE = `/**
 * Google Apps Script Backend: Web Absensi Piket TNK 62 IPB
 * Pasang skrip ini di: Google Spreadsheet -> Ekstensi -> Apps Script
 */

const FOLDER_ID = "GANTI_DENGAN_GOOGLE_DRIVE_FOLDER_ID_ANDA";
const SHEET_NAME = "DataAbsen";

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Buat sheet baru jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Nama Mahasiswa", "NIM", "Waktu Piket", "Lokasi", "Status", "Catatan", "URL Foto Drive"]);
    }
    
    // 1. Simpan Foto ke Google Drive
    let photoUrl = "-";
    if (postData.fotoBase64 && postData.fotoBase64.startsWith("data:image")) {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const splitData = postData.fotoBase64.split(",");
      const contentType = splitData[0].match(/:(.*?);/)[1];
      const bytes = Utilities.base64Decode(splitData[1]);
      const blob = Utilities.newBlob(bytes, contentType, postData.namaMahasiswa + "_" + Date.now() + ".jpg");
      
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      photoUrl = file.getUrl();
    }
    
    // 2. Tulis Data ke Google Sheets
    sheet.appendRow([
      postData.timestamp || new Date().toISOString(),
      postData.namaMahasiswa || "",
      postData.nim || "",
      postData.waktuPiket || "",
      postData.lokasi || "",
      postData.status || "Tepat Waktu",
      postData.catatan || "",
      photoUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", photoUrl: photoUrl }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const GasConfigModal: React.FC<GasConfigModalProps> = ({
  isOpen,
  onClose,
  gasWebhookUrl,
  setGasWebhookUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [urlInput, setUrlInput] = useState(gasWebhookUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setGasWebhookUrl(urlInput.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem('tnk62_gas_webhook_url', urlInput.trim());
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl animate-fade-in border border-slate-200">
        
        {/* Header DiSekolahKu style */}
        <div className="p-6 bg-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/90 text-white flex items-center justify-center shadow-md">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Integrasi Google Drive & Spreadsheet</h3>
              <p className="text-xs text-blue-100">
                Penyimpanan Otomatis Tanpa Server (Google Apps Script)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
          
          {/* Status info */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${gasWebhookUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>
                Status: {gasWebhookUrl ? 'Terkoneksi ke Webhook Apps Script' : 'Mode Offline / Penyimpanan Lokal Aktif'}
              </span>
            </div>
          </div>

          {/* Webhook Input Form */}
          <form onSubmit={handleSaveUrl} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              URL Web App Google Apps Script (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
              >
                Simpan URL
              </button>
            </div>
            {savedSuccess && (
              <p className="text-xs text-emerald-600 font-semibold">
                âœ“ URL Google Apps Script berhasil disimpan!
              </p>
            )}
            <p className="text-[11px] text-slate-500">
              *Jika dikosongkan, seluruh data dan foto tetap tersimpan aman di browser penyimpanan lokal (localStorage).
            </p>
          </form>

          {/* Step by Step Guide */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Panduan Setup Google Apps Script (4 Langkah Cepat):</span>
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 pl-1 leading-relaxed">
              <li>
                <strong>Buat Folder di Google Drive:</strong> Beri nama <code>Absensi_Piket_62_Storage</code>, buka folder tersebut dan salin <strong>Folder ID</strong> dari tautan URL browser.
              </li>
              <li>
                <strong>Buat Google Spreadsheet:</strong> Buka Google Spreadsheet baru, beri nama lembar kerja dengan nama <code>DataAbsen</code>.
              </li>
              <li>
                <strong>Buka Apps Script:</strong> Di menu atas Spreadsheet, klik <strong>Ekstensi &gt; Apps Script</strong>. Hapus semua kode default dan tempelkan kode di bawah ini. Ganti <code>FOLDER_ID</code> dengan Folder ID Anda.
              </li>
              <li>
                <strong>Deploy Web App:</strong> Klik tombol <strong>Deploy &gt; New deployment</strong>, pilih jenis <strong>Web app</strong>, atur <em>Who has access</em> ke <strong>Anyone (Siapa saja)</strong>, lalu klik <strong>Deploy</strong> dan salin Web App URL ke form di atas.
              </li>
            </ol>
          </div>

          {/* Script Code Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700">
                Code.gs (Google Apps Script)
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-56">
              {GAS_CODE}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

