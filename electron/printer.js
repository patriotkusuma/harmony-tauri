"use strict";

const { nativeImage, BrowserWindow } = require("electron");
const path = require("path");
const fs   = require("fs");

// =============================================
// 🧾 HTML RECEIPT (fallback via webContents)
// =============================================
function buildReceiptHTML(order) {
  const fmt = (n) => Number(n || 0).toLocaleString("id-ID");
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("id-ID", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "-";

  const items = (order.detail_pesanans || [])
    .map(
      (item) => `
      <div class="row">
        <span class="item-name">${item.jenis_cuci?.nama || "-"}</span>
        <span>${item.qty} x Rp ${fmt(item.harga)}</span>
        <span class="right">Rp ${fmt(item.total_harga)}</span>
      </div>`
    )
    .join("");

  const isPaid = order.status_pembayaran === "Lunas";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 0; size: 58mm auto; }
    * { box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 11px; width: 54mm; margin: 2mm; padding: 0; color: #000; }
    .center { text-align: center; }
    .right  { text-align: right; }
    .bold   { font-weight: bold; }
    .big    { font-size: 14px; font-weight: bold; }
    .divider { border-top: 1px dashed #000; margin: 4px 0; }
    .row { display: flex; justify-content: space-between; margin: 2px 0; gap: 4px; }
    .row .item-name { flex: 1; }
    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; margin-top: 4px; }
    .badge { display: inline-block; border: 1px solid #000; padding: 1px 6px; font-weight: bold; font-size: 12px; }
    .footer { margin-top: 6px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="center big">Harmony Laundry</div>
  <div class="center">Struk Pesanan</div>
  <div class="divider"></div>
  <div class="row"><span>No. Order</span><span class="bold">${order.kode_pesan}</span></div>
  <div class="row"><span>Pelanggan</span><span class="bold">${order.customer?.nama || "-"}</span></div>
  <div class="row"><span>Tanggal</span><span>${fmtDate(order.tanggal_pesan)}</span></div>
  ${order.tanggal_selesai ? `<div class="row"><span>Est. Selesai</span><span>${fmtDate(order.tanggal_selesai)}</span></div>` : ""}
  <div class="divider"></div>
  <div class="bold" style="margin-bottom:3px">Item Pesanan:</div>
  ${items}
  <div class="divider"></div>
  <div class="total-row"><span>TOTAL</span><span>Rp ${fmt(order.total_harga)}</span></div>
  <div class="divider"></div>
  <div class="row"><span>Pembayaran</span><span class="badge">${order.status_pembayaran || "-"}</span></div>
  ${!isPaid ? `<div class="row"><span>Status</span><span style="font-weight:bold">BELUM LUNAS</span></div>` : ""}
  <div class="divider"></div>
  <div class="center footer">Terima kasih telah mempercayakan</div>
  <div class="center footer">cucian Anda kepada kami 🙏</div>
  <br><br><br>
</body>
</html>`;
}

// =============================================
// 🖨️ ESC/POS CONSTANTS & HELPERS
// =============================================
const ESC  = 0x1b;
const GS   = 0x1d;
const COLS = 32; // lebar 58mm ≈ 32 karakter

const CMD = {
  INIT        : Buffer.from([ESC, 0x40]),
  ALIGN_LEFT  : Buffer.from([ESC, 0x61, 0x00]),
  ALIGN_CENTER: Buffer.from([ESC, 0x61, 0x01]),
  ALIGN_RIGHT : Buffer.from([ESC, 0x61, 0x02]),
  BOLD_ON     : Buffer.from([ESC, 0x45, 0x01]),
  BOLD_OFF    : Buffer.from([ESC, 0x45, 0x00]),
  DOUBLE_SIZE : Buffer.from([GS,  0x21, 0x11]),
  NORMAL_SIZE : Buffer.from([GS,  0x21, 0x00]),
  FEED_CUT    : Buffer.from([GS,  0x56, 0x42, 0x05]),
  FEED_LINES  : (n) => Buffer.from([ESC, 0x64, n]),
};

const txt  = (str)        => Buffer.from(str + "\n", "utf8");
const line = (char = "-") => txt(char.repeat(COLS));

function padCols(label, value) {
  const gap = COLS - label.length - value.length;
  return label + " ".repeat(Math.max(1, gap)) + value;
}

function fmtDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", {
    hour: "2-digit", minute: "2-digit",
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtRupiah(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

function resolveQtyUnit(item) {
  const tipe = item.jenis_cuci?.tipe ?? "";
  const raw  = parseFloat(item.qty ?? 0);
  switch (tipe) {
    case "per_kilo":   return [raw / 1000, "kg"];
    case "satuan":     return [raw,        "pcs"];
    case "kilo_meter": return [raw / 1000, "km"];
    default:           return [raw / 1000, "meter"];
  }
}

function sprintf5(qty, unit, harga, total) {
  const q = qty.toFixed(2).padStart(5);
  const u = unit.padEnd(3);
  const h = harga.toFixed(3).padStart(7);
  const t = total.toFixed(3).padStart(8);
  return `${q} ${u}  x  ${h} ${t}`;
}

// ── LOGO (cached per ukuran) ─────────────────
const _logoCache = new Map();

function buildLogoBuffer(targetWidth = 350) {
  if (_logoCache.has(targetWidth)) return _logoCache.get(targetWidth);

  try {
    const logoPath = path.join(__dirname, "assets/icon.png");
    const ni       = nativeImage.createFromPath(logoPath);
    if (ni.isEmpty()) return Buffer.alloc(0);

    const orig    = ni.getSize();
    const resized = ni.resize({
      width : targetWidth,
      height: Math.round(orig.height * (targetWidth / orig.width)),
    });

    const { width, height } = resized.getSize();
    const bgra       = resized.toBitmap();
    const widthBytes = Math.ceil(width / 8);
    const imgData    = Buffer.alloc(widthBytes * height, 0);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px    = (y * width + x) * 4;
        const gray  = 0.299 * bgra[px + 2] + 0.587 * bgra[px + 1] + 0.114 * bgra[px];
        const alpha = bgra[px + 3];
        if (alpha > 30 && gray < 180) {
          imgData[y * widthBytes + Math.floor(x / 8)] |= (1 << (7 - (x % 8)));
        }
      }
    }

    // Auto-crop baris kosong atas & bawah
    let cropTop = 0, cropBottom = height - 1;
    outer_top: for (let y = 0; y < height; y++)
      for (let bx = 0; bx < widthBytes; bx++)
        if (imgData[y * widthBytes + bx] !== 0) { cropTop = y; break outer_top; }

    outer_bot: for (let y = height - 1; y >= 0; y--)
      for (let bx = 0; bx < widthBytes; bx++)
        if (imgData[y * widthBytes + bx] !== 0) { cropBottom = y; break outer_bot; }

    const croppedHeight = cropBottom - cropTop + 1;
    const croppedData   = imgData.slice(cropTop * widthBytes, (cropBottom + 1) * widthBytes);

    const header = Buffer.from([
      GS, 0x76, 0x30, 0x00,
      widthBytes    & 0xff, (widthBytes    >> 8) & 0xff,
      croppedHeight & 0xff, (croppedHeight >> 8) & 0xff,
    ]);

    const result = Buffer.concat([header, croppedData]);
    _logoCache.set(targetWidth, result);
    return result;
  } catch (err) {
    console.error("Logo build error:", err.message);
    const empty = Buffer.alloc(0);
    _logoCache.set(targetWidth, empty);
    return empty;
  }
}

// ══════════════════════════════════════════════
// 🧾 STRUK ORDER (dari halaman Orders)
// ══════════════════════════════════════════════
function buildEscPosBuffer(order) {
  const parts = [];
  const p = (...bufs) => parts.push(...bufs);

  // Header
  p(CMD.INIT, CMD.ALIGN_CENTER);
  p(buildLogoBuffer(350));
  p(CMD.FEED_LINES(1));
  p(txt("Jln. Candi Gebang"));
  p(txt("telp / wa : 0895363324517"));
  p(CMD.FEED_LINES(1));

  // Meta
  p(CMD.ALIGN_LEFT);
  p(txt("Tanggal : " + fmtDate(order.tanggal_pesan)));
  p(txt("Selesai : " + fmtDate(order.tanggal_selesai)));
  p(txt("No      : " + (order.kode_pesan || "-")));
  p(txt("Nama    : " + (order.customer?.nama || "-")));
  p(txt("No Wa   : " + (order.customer?.telpon || "-")));
  p(CMD.ALIGN_CENTER, line("-"));

  // Items
  let subTotal = 0;
  (order.detail_pesanans || []).forEach((item) => {
    subTotal += Number(item.total_harga || 0);
    const [qty, unit] = resolveQtyUnit(item);
    p(CMD.ALIGN_LEFT,  txt(item.jenis_cuci?.nama || "-"));
    p(CMD.ALIGN_RIGHT, txt(sprintf5(qty, unit, Number(item.harga || 0) / 1000, Number(item.total_harga || 0) / 1000)));
  });

  // Totals
  const grandTotal = Number(order.total_harga || 0);
  const pembulatan = grandTotal - Math.round(subTotal);
  p(CMD.ALIGN_CENTER, line("-"), CMD.ALIGN_RIGHT);
  p(txt(padCols("Sub Total :", "Rp " + fmtRupiah(Math.round(subTotal)))));
  p(txt(padCols("Pembulatan :", "Rp " + fmtRupiah(pembulatan))));
  p(CMD.BOLD_ON, txt(padCols("Total :", "Rp " + fmtRupiah(grandTotal))), CMD.BOLD_OFF);

  // Nama pelanggan besar
  p(CMD.FEED_LINES(1), CMD.BOLD_ON, CMD.DOUBLE_SIZE, CMD.ALIGN_CENTER);
  p(txt(order.customer?.nama || ""));
  p(CMD.NORMAL_SIZE, CMD.BOLD_OFF);

  // Footer
  p(CMD.FEED_LINES(1), CMD.ALIGN_CENTER);
  p(txt("Terima Kasih"));
  p(txt("Jangan lupa kembali lagi."));
  p(CMD.FEED_LINES(11));

  return Buffer.concat(parts);
}

// ══════════════════════════════════════════════
// 🧾 STRUK KASIR F3 (last order)
// ══════════════════════════════════════════════
function buildLastOrderBuffer(order) {
  const parts = [];
  const p = (...bufs) => parts.push(...bufs);

  // Header
  p(CMD.INIT, CMD.ALIGN_CENTER);
  p(buildLogoBuffer(350));
  p(CMD.FEED_LINES(1));
  p(txt("Jln. Candi Gebang"));
  p(txt("WA: 0895363324517"));
  p(line("="));

  // Meta
  p(CMD.ALIGN_LEFT);
  p(txt("Tgl  : " + fmtDate(order.tanggal_pesan)));
  p(txt("No   : " + (order.kode_pesan || "-")));
  p(txt("Nama : " + (order.customer?.nama || "-")));
  p(txt("WA   : " + (order.customer?.telpon || "-")));
  p(line("-"));

  // Items
  let subTotal = 0;
  (order.detail_pesanans || []).forEach((item) => {
    subTotal += Number(item.total_harga || 0);
    const [qty, unit] = resolveQtyUnit(item);
    p(CMD.ALIGN_LEFT,  txt(item.jenis_cuci?.nama || "-"));
    p(CMD.ALIGN_RIGHT, txt(sprintf5(qty, unit, Number(item.harga || 0) / 1000, Number(item.total_harga || 0) / 1000)));
  });

  // Totals
  const grandTotal = Number(order.total_harga || 0);
  const pembulatan = grandTotal - Math.round(subTotal);
  p(line("-"), CMD.ALIGN_RIGHT);
  p(txt(padCols("Sub Total :", "Rp " + fmtRupiah(Math.round(subTotal)))));
  if (pembulatan !== 0) p(txt(padCols("Pembulatan :", "Rp " + fmtRupiah(pembulatan))));
  p(CMD.BOLD_ON, txt(padCols("TOTAL :", "Rp " + fmtRupiah(grandTotal))), CMD.BOLD_OFF);
  p(line("="));

  // Status pembayaran 2x besar
  p(CMD.FEED_LINES(1), CMD.BOLD_ON, CMD.DOUBLE_SIZE, CMD.ALIGN_CENTER);
  p(txt(order.status_pembayaran || ""));
  p(CMD.NORMAL_SIZE, CMD.BOLD_OFF, CMD.FEED_LINES(1));

  // Estimasi selesai
  p(CMD.ALIGN_CENTER, line("-"));
  const est    = order.tanggal_selesai ? new Date(order.tanggal_selesai) : null;
  const hari   = est ? est.toLocaleString("id-ID", { weekday: "long" }) : "-";
  const tglEst = est ? est.toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
  const jamEst = est ? est.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
  p(txt("Estimasi Selesai"));
  p(CMD.BOLD_ON, txt(hari + ", " + tglEst), txt("Pukul " + jamEst + " WIB"), CMD.BOLD_OFF);

  // Footer
  p(line("-"), CMD.ALIGN_CENTER);
  p(txt("Terima kasih sudah percaya"));
  p(txt("kepada Harmony Laundry :)"));
  p(CMD.FEED_LINES(11));

  return Buffer.concat(parts);
}

// ══════════════════════════════════════════════
// 🧾 STRUK NAMA (Label Tempel)
// ══════════════════════════════════════════════
function buildNameBuffer(order) {
  const parts = [];
  const p = (...bufs) => parts.push(...bufs);

  const SIZE = (w, h) => Buffer.from([GS, 0x21, (w - 1) * 16 + (h - 1)]);

  p(CMD.INIT, CMD.ALIGN_CENTER);

  // Status Pembayaran & Tagihan
  const isLunas = order.status_pembayaran === "Lunas";
  const tagihan = typeof order.total_harga !== "undefined" ? Number(order.total_harga) : 0;
  // If paid data is available
  const paid = typeof order.paid !== "undefined" ? Number(order.paid) : 0;
  const sisa = tagihan - paid;
  
  p(SIZE(2, 2), CMD.BOLD_ON);
  if (isLunas) {
    p(txt("LUNAS"));
  } else {
    p(txt(fmtRupiah(tagihan)));
    p(SIZE(1, 1));
    p(txt("BELUM LUNAS"));
    if (sisa > 0 && sisa !== tagihan) {
      p(txt("Sisa Tagihan : Rp " + fmtRupiah(sisa)));
    }
  }
  p(CMD.BOLD_OFF, CMD.FEED_LINES(1));

  // Nama Customer besar
  p(CMD.BOLD_ON, SIZE(3, 4));
  p(txt(order.customer?.nama || "-"));
  
  // Keterangan
  p(SIZE(2, 2), CMD.BOLD_OFF);
  if (order.customer?.keterangan) {
    p(txt(order.customer.keterangan));
  }
  p(CMD.FEED_LINES(1));

  // Rincian Cucian dengan Tanda Setrika/Lipat
  p(SIZE(1, 1));
  (order.detail_pesanans || []).forEach((item) => {
    const itemName = item.jenis_cuci?.nama || "Item";
    const jnama = itemName.toLowerCase();

    let tag = "";
    if (jnama.includes("setrika") && jnama.includes("lipat")) tag = " [SETRIKA/LIPAT]";
    else if (jnama.includes("setrika")) tag = " [SETRIKA]";
    else if (jnama.includes("lipat")) tag = " [LIPAT]";

    // Kalau ada tag, kita print item name-nya dulu, dipisah agar tag bisa dibuat BOLD
    if (tag) {
      // Print the original item name without bold
      p(txt(`(${itemName})`));
      
      // Print the tag with bolder style & double width slightly beneath
      p(CMD.BOLD_ON, SIZE(2, 1));
      p(txt(tag));
      p(CMD.BOLD_OFF, SIZE(1, 1));
    } else {
      p(txt(`(${itemName})`));
    }
  });

  p(CMD.FEED_LINES(1));

  // Hari dan Tanggal Selesai
  if (order.tanggal_pesan && order.tanggal_selesai) {
    const inDate = new Date(order.tanggal_pesan);
    const outDate = new Date(order.tanggal_selesai);
    const diffTime = outDate.getTime() - inDate.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); 
    
    p(SIZE(2, 2), CMD.BOLD_ON);
    p(txt(diffDays + " Hari"));
    p(CMD.BOLD_OFF, SIZE(1, 1));
    p(txt(fmtDate(order.tanggal_selesai)));
  }

  p(CMD.FEED_LINES(10));
  return Buffer.concat(parts);
}

// ══════════════════════════════════════════════
// 🖨️ RAW PRINT ke /dev/usb/pos-58
// ══════════════════════════════════════════════
const PRINTER_DEV = "/dev/usb/pos-58";

function rawPrint(buffer) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(PRINTER_DEV, { flags: "w" });
    stream.on("error", reject);
    stream.end(buffer, () => resolve({ success: true }));
  });
}

// ══════════════════════════════════════════════
// 📡 REGISTER SEMUA IPC HANDLER PRINT
// ══════════════════════════════════════════════
function registerPrintIPC(ipcMain) {
  // HTML print via webContents (fallback)
  ipcMain.handle("print:order", async (event, orderData) => {
    return new Promise((resolve, reject) => {
      const printWin = new BrowserWindow({
        show: false, width: 400, height: 800,
        webPreferences: { nodeIntegration: false, contextIsolation: true },
      });
      const html = buildReceiptHTML(orderData);
      printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
      printWin.webContents.once("did-finish-load", () => {
        printWin.webContents.print(
          { silent: true, printBackground: true, deviceName: "pos-58",
            pageSize: { width: 58000, height: 200000 }, margins: { marginType: "none" } },
          (success, errorType) => {
            printWin.close();
            success ? resolve({ success: true }) : reject(new Error(errorType || "Print gagal"));
          }
        );
      });
    });
  });

  // Raw ESC/POS — struk Orders
  ipcMain.handle("print:raw", async (event, orderData) => {
    return await rawPrint(buildEscPosBuffer(orderData));
  });

  // Raw ESC/POS — struk kasir F3
  ipcMain.handle("print:last-order", async (event, orderData) => {
    return await rawPrint(buildLastOrderBuffer(orderData));
  });

  // Raw ESC/POS — struk nama
  ipcMain.handle("print:name", async (event, orderData) => {
    return await rawPrint(buildNameBuffer(orderData));
  });
}

module.exports = { registerPrintIPC };
