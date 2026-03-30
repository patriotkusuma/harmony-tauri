# Blog API Documentation & Flow

Dokumen ini menjelaskan alur (flow) dan spesifikasi API untuk fitur Blog (Manajemen Artikel). Fitur ini dibangun menggunakan pendekatan **Clean Architecture** (v2) dan mendukung pengunggahan gambar (thumbnail utama dan gambar sisipan dari Rich Text Editor).

---

## 🏗️ Architecture Flow

Alur data untuk fitur Blog melewati beberapa layer berikut:

1. **Router (`internal/interface/http/router_clean.go`)**: Menerima request HTTP dan meneruskannya ke Handler yang sesuai. Terdapat pemisahan antara API publik (baca saja) dan API admin (CRUD, butuh otentikasi).
2. **Handler (`internal/interface/http/handler/blog_handler.go`)**: Memvalidasi input (baik berupa JSON maupun `multipart/form-data`), menangani proses penyimpanan file fisik (gambar), lalu memanggil UseCase.
3. **UseCase (`internal/usecase/blog/impl.go`)**: Berisi logika bisnis (aturan penulisan, misalnya *auto-generate* slug dari judul artikel bila kosong/berubah) dan mengomunikasikannya dengan antarmuka (interface) Repository.
4. **Repository (`internal/infrastructure/persistance/gorm/blog_repository.go`)**: Berinteraksi langsung dengan database MySQL menggunakan GORM (tabel `blogs`).
5. **Entity (`internal/domains/blog/entity.go`)**: Deklarasi struktur data baku dari sebuah `Blog`.

---

## 🚀 API Endpoints

Bagian ini membeberkan spesifikasi _request_ dan _response_ dari setiap endpoint.

### 🌐 Public Endpoints (Tanpa Auth)
Digunakan oleh bagian antarmuka Web Publik untuk membaca daftar artikel atau detail artikel. Base path: `/api/blogs`

#### 1. List Blogs
Mendapatkan daftar blog (artikel) terbaru. Mendukung paginasi sederhana.

- **URL:** `GET /api/blogs`
- **Query Params (Opsional):**
  - `limit` (default: 10)
  - `offset` (default: 0)
- **Response Success (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Cara Merawat Pakaian Berbahan Sutra",
        "slug": "cara-merawat-pakaian-berbahan-sutra",
        "meta_title": "Tips Merawat Sutra - Harmony Laundry",
        "meta_desc": "Panduan lengkap mencuci kain sutra...",
        "thumbnail": "/uploads/blog/blog_20260304150405_uuid.jpg",
        "content": "<p>Isi artikel...</p>",
        "status": "publish",
        "created_at": "2026-03-04T12:00:00Z",
        "updated_at": "2026-03-04T12:00:00Z"
      }
    ],
    "total": 1
  }
  ```

#### 2. Get Blog detail by ID
- **URL:** `GET /api/blogs/:id`
- **Response Success (200 OK):**
  ```json
  {
    "data": {
      "id": 1,
      "user_id": 1,
      "title": "Cara Merawat Pakaian Berbahan Sutra",
      ...
    }
  }
  ```
- **Response Error (404 Not Found):**
  ```json
  {
    "error": "blog not found"
  }
  ```

#### 3. Get Blog detail by Slug
Sangat berguna untuk pengoptimalan mesin pencari (SEO) pada URL artikel.
- **URL:** `GET /api/blogs/slug/:slug`
- **Response Success (200 OK):** Sama seperti respons dari `Get Blog detail by ID`.

---

### 🔒 Admin Endpoints (Butuh Auth)
Digunakan di Panel Admin / CMS untuk manajemen konten. Membutuhkan header `Authorization: Bearer <token>`.
Base path: `/api/v2/blogs`

#### 1. List, Get by ID, Get by Slug
Endpoint ini memiliki respon dan format yang persis sama dengan Public Endpoints terkait, tetapi di-_mount_ di bawah `/api/v2/blogs` dan melewati _middleware_ kelola pengguna (`userMW`).
- `GET /api/v2/blogs`
- `GET /api/v2/blogs/:id`
- `GET /api/v2/blogs/slug/:slug`

#### 2. Create Blog
Membuat artikel blog baru, sekaligus menangani pengunggahan file thumbnail utama.

- **URL:** `POST /api/v2/blogs`
- **Content-Type:** `multipart/form-data`
- **Form-Data Params:**
  - `user_id` (integer, wajib): ID user penulis.
  - `title` (string, wajib): Judul tulisan.
  - `meta_title` (string, opsional).
  - `meta_desc` (string, opsional).
  - `content` (string HTML text, opsional).
  - `status` (enum: `publish` atau `draft`, jika kosong otomatis `draft`).
  - `thumbnail` (file, opsional): Dikirim berupa _binary image_.
- **Response Success (201 Created):**
  ```json
  {
    "message": "blog berhasil dibuat",
    "data": {
      "id": 2,
      ...
      "slug": "judul-yang-dikonversi-jadi-slug",
      "thumbnail": "/uploads/blog/blog_....jpg"
    }
  }
  ```
- **Response Error (409 Conflict):** Jika slug hasil konversi sudah ada.

#### 3. Update Blog
Mengubah sebagian data blog, termasuk jika ingin mengganti thumbnail. Tidak perlu mengirimkan data yang tidak berubah.

- **URL:** `PUT /api/v2/blogs/:id`
- **Content-Type:** `multipart/form-data`
- **Form-Data Params:** (Semuanya opsional, kirim hanya yang mau diubah)
  - `title`, `meta_title`, `meta_desc`, `content`, `status`, `thumbnail`
  - *(Catatan: jika `title` diubah, `slug` akan diperbarui secara otomatis)*
- **Response Success (200 OK):**
  ```json
  {
    "message": "blog berhasil diperbarui"
  }
  ```

#### 4. Delete Blog
Menghapus _record_ blog dari database.

- **URL:** `DELETE /api/v2/blogs/:id`
- **Response Success (200 OK):**
  ```json
  {
    "message": "blog berhasil dihapus"
  }
  ```

---

### 🖼️ Image Upload Endpoint (Rich Text Editor)
Khusus dibuat untuk menangani _image upload handler_ dari pustaka Rich Text Editor (seperti Quill, CKEditor, TinyMCE) saat membuat konten HTML *inline*.

- **URL:** `POST /api/v2/blogs/upload`
- **Content-Type:** `multipart/form-data`
- **Form-Data Params:**
  - `image` (file, wajib): Dokumen gambar yang disisipkan.
- **Response Success (200 OK):** Editor Rich Text modern umumnya membutuhkan balasan JSON berisi `url` absolut/relatif dari foto tersebut agar bisa memasukkannya ke tag `<img>`.
  ```json
  {
    "url": "/uploads/blog/blog_20260304153022_uuid-123.jpg"
  }
  ```

---

## 🛠️ Catatan Teknis (Penanganan Image)
1. **Penyimpanan:** Gambar disimpan di media fisik pada server, lebih tepatnya di _folder_ direktori `./uploads/blog`.  
2. **URL Routing:** Pada file `main.go`, `gin.Engine` telah melakukan serving folder statik: `r.Static("/uploads", "./uploads")` sehingga tautan URL (misal: `/uploads/blog/file.jpg`) dari respons API dapat diakses / dimuat langsung di peramban web.
3. **Format Filename:** Agar tidak terjadi bentrok penamaan foto, sistem menyematkan pola unik timestamp & UUID: `blog_YYYYMMDDHHMMSS_UUID.ekstensi`.
