// Code.gs — Backend Google Apps Script
// Tempel ke: Sheets > Ekstensi > Apps Script
// Deploy: Deploy > Deployment baru > Jenis: Aplikasi Web
//   - Execute as: Saya
//   - Who has access: Siapa saja

var FOLDER_ID = '1TKNlED9BeDMprU_nbURm6CR17XfSW5AZ';
var SHEET_NAME = 'DataAbsen';

// Sheet harus punya header baris 1:
// Timestamp | Nama Mahasiswa | NIM | Waktu Piket | Lokasi | Status | Catatan | URL Foto
//
// Payload dari form mahasiswa dan dari panel admin memakai kunci yang sama,
// sehingga keduanya otomatis masuk ke sheet ini lewat fungsi yang sama.

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var isManual = String(data.action || '') === 'submitManualAttendance';

    var nama = String(data.namaMahasiswa || '').trim();
    var nim = String(data.nim || '').trim();
    var waktu = String(data.waktuPiket || '').trim();
    var lokasi = String(data.lokasi || '').trim();
    var status = String(data.status || '').trim();
    var catatan = String(data.catatan || '').trim();
    var fotoBase64 = String(data.fotoBase64 || '');

    if (!nama || !waktu) {
      return jsonResponse_({ status: 'error', message: 'Nama dan waktu piket wajib diisi.' });
    }

    // Data manual selalu diberi penanda agar mudah dibedakan dari absensi mahasiswa
    if (isManual) {
      catatan = (catatan ? catatan + ' ' : '') + '[INPUT MANUAL]';
      if (!status) status = 'Tepat Waktu';
    }

    var urlFoto = '';
    if (fotoBase64) {
      try {
        var match = fotoBase64.match(/^data:(image\/\w+);base64,/);
        var mime = match ? match[1] : 'image/jpeg';
        var ext = mime.split('/')[1] || 'jpg';
        if (ext === 'jpeg') ext = 'jpg';
        var cleaned = fotoBase64.replace(/^data:image\/\w+;base64,/, '');
        var blob = Utilities.newBlob(
          Utilities.base64Decode(cleaned),
          mime,
          nama.replace(/\s+/g, '_') + '_' + Date.now() + '.' + ext
        );
        var file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        urlFoto = file.getUrl();
      } catch (driveErr) {
        // DriveApp tidak tersedia untuk akses publik; simpan referensi file di Sheets saja
        console.log('Upload foto gagal: ' + driveErr.message);
        urlFoto = '[FILE] ' + nama.replace(/\s+/g, '_') + '_' + Date.now() + '.' + (match && match[1] ? match[1].split('/')[1] : 'jpg');
      }
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([new Date(), nama, nim, waktu, lokasi, status, catatan, urlFoto]);

    return jsonResponse_({ status: 'success', urlFoto: urlFoto });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.message });
  }
}

// Opsional: GET https://.../exec untuk ambil semua baris sebagai JSON
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var values = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var d = values[i][0] ? new Date(values[i][0]) : null;
    rows.push({
      timestamp: d ? d.toISOString() : '',
      tanggal: d ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy') : '',
      waktu: d ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'HH:mm:ss') : '',
      nama: values[i][1],
      nim: values[i][2],
      shift: values[i][3],
      lokasi: values[i][4],
      status: values[i][5],
      catatan: values[i][6],
      urlFoto: values[i][7]
    });
  }
  rows.reverse();
  return jsonResponse_({ status: 'success', data: rows });
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Jalankan ini sekali di editor (pilih fungsi testDriveAuth lalu Run)
// untuk memicu layar izin akses Google Drive.
function testDriveAuth() {
  var f = DriveApp.getFolderById(FOLDER_ID);
  Logger.log(f.getName());
}
