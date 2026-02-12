# APEX GPT - Ultimate Clean Version

AI Chatbot dengan Email Verification & Bug Report

## ⚡ QUICK START (5 MENIT)

1. Upload 4 file ke GitHub
2. Setup EmailJS (lihat di bawah)
3. Edit `script.js` baris 11-15
4. Done!

---

## 📧 SETUP EMAILJS (WAJIB!)

### Langkah 1: Daftar EmailJS (2 menit)

1. Buka https://www.emailjs.com/
2. Klik **Sign Up**
3. Isi email & password
4. **Verify email** (cek inbox)
5. Login

### Langkah 2: Tambah Email Service (1 menit)

1. Di Dashboard, klik **Email Services**
2. Klik **Add New Service**
3. Pilih **Gmail** (recommended)
4. Klik **Connect Account**
5. Login dengan Gmail kamu
6. Authorize EmailJS
7. **COPY Service ID** → contoh: `service_abc123`

### Langkah 3: Buat Email Template (2 menit)

1. Di Dashboard, klik **Email Templates**
2. Klik **Create New Template**
3. Isi seperti ini:

**Template Name:** `apex_verification`

**Subject:**
```
Kode Verifikasi Apex GPT
```

**Content:**
```
Halo {{to_name}},

Kode verifikasi Apex GPT kamu adalah:

{{verification_code}}

Masukkan kode ini di halaman signup.

Jangan share kode ini ke siapapun!

- Tim Apex GPT by Rafi
```

**To Email:**
```
{{to_email}}
```

4. Klik **Save**
5. **COPY Template ID** → contoh: `template_xyz789`

### Langkah 4: Copy Public Key (30 detik)

1. Di Dashboard, klik **Account**
2. Tab **General**
3. Lihat **Public Key**
4. **COPY Public Key** → contoh: `a1b2c3d4e5f6`

### Langkah 5: Edit script.js (1 menit)

1. Buka file `script.js`
2. Cari baris 11-15 (paling atas file)
3. Ganti 3 nilai ini:

```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'a1b2c3d4e5f6',           // ← Paste Public Key
    SERVICE_ID: 'service_abc123',         // ← Paste Service ID  
    TEMPLATE_ID: 'template_xyz789'        // ← Paste Template ID
};
```

4. Save file
5. Upload ke GitHub

### ✅ Test Email

1. Buka website
2. Klik **Sign Up**
3. Isi form dengan **EMAIL KAMU SENDIRI**
4. Klik Sign Up
5. **CEK EMAIL** (inbox atau spam)
6. Copy kode 6 digit
7. Paste di modal verification
8. Done!

---

## 📱 DEPLOY KE GITHUB PAGES

### Cara 1: Upload via Web (Termudah)

1. Buka https://github.com/new
2. Nama: `apex-gpt`
3. Public
4. **JANGAN** centang "Add README"
5. Klik **Create repository**
6. Klik **uploading an existing file**
7. Drag 4 file sekaligus:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
8. Klik **Commit changes**

### Cara 2: Buat File Satu-Satu (iPad)

1. Buka repository
2. Klik **Add file** → **Create new file**
3. Nama: `index.html`
4. Copy paste isi file
5. Klik **Commit new file**
6. Ulangi untuk 3 file lainnya

### Aktifkan GitHub Pages

1. Klik **Settings** (tab atas)
2. Klik **Pages** (menu kiri)
3. Source: **main** branch
4. Folder: **/ (root)**
5. Klik **Save**
6. **Tunggu 2-3 menit**
7. Refresh halaman
8. Website live: `https://USERNAME.github.io/apex-gpt/`

---

## 🎯 FITUR LENGKAP

### ✅ Authentication
- Login/Signup dengan email
- Email verification real (6 digit code)
- Akun Pro (bypass verification)

### ✅ Free Plan
- 50 pesan per 5 jam
- Timer countdown auto
- Usage bar progress
- Popup upgrade saat habis

### ✅ Pro Account (Built-in)
```
Username: pro3333
Password: kalomauprobelisamarafi
```
- Unlimited messages
- No timer
- No limit

### ✅ AI Chat
- Powered by Puter.js
- Personality: Blak-blakan, penyuka film
- Owner: Rafi yang pinter
- Context memory (10 messages)
- Markdown support
- Code highlighting

### ✅ Bug Report System
- **Telepon**: Direct call ke 085267718086
- **WhatsApp**: Template message otomatis
- Menu di sidebar

### ✅ Export Chat
- Download as .txt file
- Full conversation history

### ✅ UI Features
- Dark theme futuristik
- Gradient animations
- Touch-friendly (48px+ buttons)
- Responsive 100%
- Smooth transitions
- No bugs

---

## 🔧 CUSTOMIZE

### Ubah Nomor WA/Telepon
File: `script.js` - Baris 24-28

```javascript
const CONTACT = {
    whatsapp: '6285267718086',              // Ganti nomor WA
    phone: 'tel:+6285267718086',            // Ganti nomor telepon
    upgradeMessage: 'Pesan custom kamu'     // Ganti template pesan
};
```

### Ubah Prompt AI
File: `script.js` - Baris 18

```javascript
const SYSTEM_PROMPT = "Tulis personality AI kamu di sini...";
```

### Ubah Akun Pro
File: `script.js` - Baris 20-23

```javascript
const PRO_ACCOUNT = {
    username: 'username_baru',
    password: 'password_baru'
};
```

### Ubah Warna Tema
File: `style.css` - Baris 10-11

```css
--blue: #00d4ff;     /* Warna biru */
--purple: #a855f7;   /* Warna ungu */
```

### Ubah Limit Free
File: `script.js` - Cari `50` (jumlah pesan)
File: `script.js` - Cari `5 * 60 * 60 * 1000` (5 jam dalam milidetik)

---

## 🐛 TROUBLESHOOTING

### Email Tidak Terkirim

**Penyebab:**
- EmailJS config salah
- Service ID / Template ID salah
- Public Key salah
- Gmail tidak authorize

**Solusi:**
1. Cek `script.js` baris 11-15
2. Pastikan sudah ganti `YOUR_PUBLIC_KEY` dll
3. Cek EmailJS Dashboard → Logs
4. Test kirim email dari EmailJS dashboard
5. Cek quota (free = 200 email/bulan)

### Tombol Tidak Bisa Diklik

**Solusi:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
2. Clear cache browser
3. Coba browser lain
4. Cek Console (F12) untuk error

### AI Tidak Respon

**Solusi:**
1. Cek koneksi internet
2. Buka Console (F12) → lihat error
3. Cek Puter.js API status
4. Refresh halaman
5. Clear localStorage:
```javascript
localStorage.clear()
```

### Website Tidak Muncul

**Solusi:**
1. Tunggu 5 menit setelah first deploy
2. Cek Settings → Pages → Source = main
3. Force refresh GitHub Pages:
   - Edit file apa saja
   - Commit
   - Tunggu 2 menit
4. Cek link: `https://USERNAME.github.io/apex-gpt/`

### Kode Verifikasi Tidak Masuk

**Solusi:**
1. **Cek spam folder**
2. Cek EmailJS Dashboard → Logs
3. Pastikan email benar
4. Tunggu 1-2 menit
5. Klik "Skip" → Login manual

---

## 📊 EMAILJS LIMITS

### Free Plan
- ✅ 200 email/bulan
- ✅ 1 email service
- ✅ Unlimited templates
- ✅ Basic support

### Paid Plan ($15/bulan)
- ✅ 10,000 email/bulan
- ✅ Multiple services
- ✅ Custom domain
- ✅ Priority support

---

## 📖 CARA PAKAI

### Signup Baru
1. Buka website
2. Tab **Sign Up**
3. Isi:
   - Username (min 3 karakter)
   - Email (email kamu yang aktif)
   - Password (min 6 karakter)
   - Confirm Password
4. Klik **SIGN UP**
5. Cek email
6. Copy kode 6 digit
7. Paste di modal
8. Klik **Verifikasi**
9. Otomatis login

### Login
1. Tab **Login**
2. Isi username & password
3. Klik **LOGIN**

### Login Pro
1. Username: `pro3333`
2. Password: `kalomauprobelisamarafi`
3. Unlimited access!

### Chat
1. Ketik pesan di box bawah
2. Enter atau klik icon kirim
3. AI akan jawab dengan personality blak-blakan

### Export Chat
1. Buka menu (icon hamburger)
2. Klik **Export Chat**
3. File .txt otomatis download

### Lapor Bug
1. Buka menu
2. Klik **Lapor Bug**
3. Pilih:
   - **Telepon**: Direct call
   - **WhatsApp**: Kirim pesan

---

## 🎬 CREDITS

**Developer:** Rafi  
**Contact:**
- Phone: 085267718086
- WhatsApp: wa.me/6285267718086

**Tech Stack:**
- Puter.js v2 (AI Engine)
- EmailJS (Email Service)
- Marked.js (Markdown)
- Vanilla JavaScript
- GitHub Pages (Hosting)

---

## 📝 NOTES

- **Jangan share akun Pro** ke banyak orang
- **Backup chat** pakai Export feature
- **Clear history** kalau storage penuh
- **Report bug** kalau ada masalah
- **EmailJS quota** reset tiap bulan (tanggal 1)

---

**Made with ⚡ by Rafi**

🎬 *AI Blak-blakan yang Helpful!*
