use chrono::{DateTime, Datelike, Local, NaiveDateTime, Timelike};
use image::imageops::FilterType;
use image::{DynamicImage, GenericImageView};
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::Write;
use std::sync::{Mutex, OnceLock};

const PRINTER_DEV: &str = "/dev/usb/pos-58";
const COLS: usize = 32;

const ESC: u8 = 0x1b;
const GS: u8 = 0x1d;

static LOGO_CACHE: OnceLock<Mutex<HashMap<u32, Vec<u8>>>> = OnceLock::new();

#[derive(Serialize)]
pub struct PrintResult {
  success: bool,
  bytes_written: usize,
}

#[derive(Clone, Copy)]
enum TicketKind {
  Order,
  LastOrder,
  Name,
}

#[tauri::command]
pub fn print_order(order: Value) -> Result<PrintResult, String> {
  print_ticket(order, TicketKind::Order)
}

#[tauri::command]
pub fn print_raw(order: Value) -> Result<PrintResult, String> {
  print_ticket(order, TicketKind::Order)
}

#[tauri::command]
pub fn print_last_order(order: Value) -> Result<PrintResult, String> {
  print_ticket(order, TicketKind::LastOrder)
}

#[tauri::command]
pub fn print_name(order: Value) -> Result<PrintResult, String> {
  print_ticket(order, TicketKind::Name)
}

fn print_ticket(order: Value, kind: TicketKind) -> Result<PrintResult, String> {
  let payload = match kind {
    TicketKind::Order => build_order_buffer(&order),
    TicketKind::LastOrder => build_last_order_buffer(&order),
    TicketKind::Name => build_name_buffer(&order),
  };
  write_to_printer(&payload)?;
  Ok(PrintResult {
    success: true,
    bytes_written: payload.len(),
  })
}

fn write_to_printer(payload: &[u8]) -> Result<(), String> {
  let mut file = OpenOptions::new()
    .write(true)
    .open(PRINTER_DEV)
    .map_err(|err| format!("Gagal membuka {}: {}", PRINTER_DEV, err))?;
  file
    .write_all(payload)
    .map_err(|err| format!("Gagal menulis payload printer: {}", err))?;
  file
    .flush()
    .map_err(|err| format!("Gagal flush payload printer: {}", err))
}

fn cmd_init() -> [u8; 2] {
  [ESC, 0x40]
}

fn cmd_align_left() -> [u8; 3] {
  [ESC, 0x61, 0x00]
}

fn cmd_align_center() -> [u8; 3] {
  [ESC, 0x61, 0x01]
}

fn cmd_align_right() -> [u8; 3] {
  [ESC, 0x61, 0x02]
}

fn cmd_bold_on() -> [u8; 3] {
  [ESC, 0x45, 0x01]
}

fn cmd_bold_off() -> [u8; 3] {
  [ESC, 0x45, 0x00]
}

fn cmd_double_size() -> [u8; 3] {
  [GS, 0x21, 0x11]
}

fn cmd_normal_size() -> [u8; 3] {
  [GS, 0x21, 0x00]
}

fn cmd_size(w: u8, h: u8) -> [u8; 3] {
  [GS, 0x21, (w.saturating_sub(1) * 16) + h.saturating_sub(1)]
}

fn cmd_feed_lines(n: u8) -> [u8; 3] {
  [ESC, 0x64, n]
}

fn push_text(out: &mut Vec<u8>, text: &str) {
  out.extend_from_slice(text.as_bytes());
  out.push(b'\n');
}

fn push_line(out: &mut Vec<u8>, chr: char) {
  let divider = std::iter::repeat_n(chr, COLS).collect::<String>();
  push_text(out, &divider);
}

fn pad_cols(label: &str, value: &str) -> String {
  let label_len = label.chars().count();
  let value_len = value.chars().count();
  let gap = COLS.saturating_sub(label_len + value_len).max(1);
  format!("{}{}{}", label, " ".repeat(gap), value)
}

fn build_order_buffer(order: &Value) -> Vec<u8> {
  let mut out = Vec::with_capacity(4096);

  out.extend_from_slice(&cmd_init());
  out.extend_from_slice(&cmd_align_center());
  out.extend_from_slice(&build_logo_buffer(350));
  out.extend_from_slice(&cmd_feed_lines(1));
  push_text(&mut out, "Jln. Candi Gebang");
  push_text(&mut out, "telp / wa : 0895363324517");
  out.extend_from_slice(&cmd_feed_lines(1));

  out.extend_from_slice(&cmd_align_left());
  push_text(
    &mut out,
    &format!(
      "Tanggal : {}",
      fmt_date_short(get_string(order, &["tanggal_pesan"]))
    ),
  );
  push_text(
    &mut out,
    &format!(
      "Selesai : {}",
      fmt_date_short(get_string(order, &["tanggal_selesai"]))
    ),
  );
  push_text(
    &mut out,
    &format!("No      : {}", get_string(order, &["kode_pesan"]).unwrap_or("-".into())),
  );
  push_text(
    &mut out,
    &format!(
      "Nama    : {}",
      get_string(order, &["customer", "nama"]).unwrap_or("-".into())
    ),
  );
  push_text(
    &mut out,
    &format!(
      "No Wa   : {}",
      get_string(order, &["customer", "telpon"]).unwrap_or("-".into())
    ),
  );
  out.extend_from_slice(&cmd_align_center());
  push_line(&mut out, '-');

  let (sub_total, items) = collect_items(order);
  for item in items {
    out.extend_from_slice(&cmd_align_left());
    push_text(&mut out, &item.name);
    out.extend_from_slice(&cmd_align_right());
    push_text(
      &mut out,
      &sprintf5(
        item.qty,
        &item.unit,
        item.harga / 1000.0,
        item.total_harga / 1000.0,
      ),
    );
  }

  let grand_total = get_number(order, &["total_harga"]);
  let pembulatan = grand_total - sub_total.round();
  out.extend_from_slice(&cmd_align_center());
  push_line(&mut out, '-');
  out.extend_from_slice(&cmd_align_right());
  push_text(
    &mut out,
    &pad_cols(
      "Sub Total :",
      &format!("Rp {}", fmt_rupiah(sub_total.round())),
    ),
  );
  push_text(
    &mut out,
    &pad_cols("Pembulatan :", &format!("Rp {}", fmt_rupiah(pembulatan))),
  );
  out.extend_from_slice(&cmd_bold_on());
  push_text(
    &mut out,
    &pad_cols("Total :", &format!("Rp {}", fmt_rupiah(grand_total))),
  );
  out.extend_from_slice(&cmd_bold_off());

  out.extend_from_slice(&cmd_feed_lines(1));
  out.extend_from_slice(&cmd_bold_on());
  out.extend_from_slice(&cmd_double_size());
  out.extend_from_slice(&cmd_align_center());
  push_text(&mut out, &get_string(order, &["customer", "nama"]).unwrap_or_default());
  out.extend_from_slice(&cmd_normal_size());
  out.extend_from_slice(&cmd_bold_off());

  out.extend_from_slice(&cmd_feed_lines(1));
  out.extend_from_slice(&cmd_align_center());
  push_text(&mut out, "Terima Kasih");
  push_text(&mut out, "Jangan lupa kembali lagi.");
  out.extend_from_slice(&cmd_feed_lines(11));
  out
}

fn build_last_order_buffer(order: &Value) -> Vec<u8> {
  let mut out = Vec::with_capacity(4096);

  out.extend_from_slice(&cmd_init());
  out.extend_from_slice(&cmd_align_center());
  out.extend_from_slice(&build_logo_buffer(350));
  out.extend_from_slice(&cmd_feed_lines(1));
  push_text(&mut out, "Jln. Candi Gebang");
  push_text(&mut out, "WA: 0895363324517");
  push_line(&mut out, '=');

  out.extend_from_slice(&cmd_align_left());
  push_text(
    &mut out,
    &format!(
      "Tgl  : {}",
      fmt_date_short(get_string(order, &["tanggal_pesan"]))
    ),
  );
  push_text(
    &mut out,
    &format!("No   : {}", get_string(order, &["kode_pesan"]).unwrap_or("-".into())),
  );
  push_text(
    &mut out,
    &format!(
      "Nama : {}",
      get_string(order, &["customer", "nama"]).unwrap_or("-".into())
    ),
  );
  push_text(
    &mut out,
    &format!(
      "WA   : {}",
      get_string(order, &["customer", "telpon"]).unwrap_or("-".into())
    ),
  );
  push_line(&mut out, '-');

  let (sub_total, items) = collect_items(order);
  for item in items {
    out.extend_from_slice(&cmd_align_left());
    push_text(&mut out, &item.name);
    out.extend_from_slice(&cmd_align_right());
    push_text(
      &mut out,
      &sprintf5(
        item.qty,
        &item.unit,
        item.harga / 1000.0,
        item.total_harga / 1000.0,
      ),
    );
  }

  let grand_total = get_number(order, &["total_harga"]);
  let pembulatan = grand_total - sub_total.round();
  push_line(&mut out, '-');
  out.extend_from_slice(&cmd_align_right());
  push_text(
    &mut out,
    &pad_cols(
      "Sub Total :",
      &format!("Rp {}", fmt_rupiah(sub_total.round())),
    ),
  );
  if pembulatan.abs() > f64::EPSILON {
    push_text(
      &mut out,
      &pad_cols("Pembulatan :", &format!("Rp {}", fmt_rupiah(pembulatan))),
    );
  }
  out.extend_from_slice(&cmd_bold_on());
  push_text(
    &mut out,
    &pad_cols("TOTAL :", &format!("Rp {}", fmt_rupiah(grand_total))),
  );
  out.extend_from_slice(&cmd_bold_off());
  push_line(&mut out, '=');

  out.extend_from_slice(&cmd_feed_lines(1));
  out.extend_from_slice(&cmd_bold_on());
  out.extend_from_slice(&cmd_double_size());
  out.extend_from_slice(&cmd_align_center());
  push_text(
    &mut out,
    &get_string(order, &["status_pembayaran"]).unwrap_or_default(),
  );
  out.extend_from_slice(&cmd_normal_size());
  out.extend_from_slice(&cmd_bold_off());
  out.extend_from_slice(&cmd_feed_lines(1));

  out.extend_from_slice(&cmd_align_center());
  push_line(&mut out, '-');
  let est = get_string(order, &["tanggal_selesai"]);
  let hari = fmt_weekday_long(est.clone());
  let tgl_est = fmt_date_long(est.clone());
  let jam_est = fmt_time_only(est);
  push_text(&mut out, "Estimasi Selesai");
  out.extend_from_slice(&cmd_bold_on());
  push_text(&mut out, &format!("{}, {}", hari, tgl_est));
  push_text(&mut out, &format!("Pukul {} WIB", jam_est));
  out.extend_from_slice(&cmd_bold_off());

  push_line(&mut out, '-');
  out.extend_from_slice(&cmd_align_center());
  push_text(&mut out, "Terima kasih sudah percaya");
  push_text(&mut out, "kepada Harmony Laundry :)");
  out.extend_from_slice(&cmd_feed_lines(11));
  out
}

fn build_name_buffer(order: &Value) -> Vec<u8> {
  let mut out = Vec::with_capacity(4096);
  out.extend_from_slice(&cmd_init());
  out.extend_from_slice(&cmd_align_center());

  let status_pembayaran = get_string(order, &["status_pembayaran"]).unwrap_or_default();
  let is_lunas = status_pembayaran == "Lunas";
  let tagihan = get_number(order, &["total_harga"]);
  let paid = get_number(order, &["paid"]);
  let sisa = tagihan - paid;

  out.extend_from_slice(&cmd_size(2, 2));
  out.extend_from_slice(&cmd_bold_on());
  if is_lunas {
    push_text(&mut out, "LUNAS");
  } else {
    push_text(&mut out, &fmt_rupiah(tagihan));
    out.extend_from_slice(&cmd_size(1, 1));
    push_text(&mut out, "BELUM LUNAS");
    if sisa > 0.0 && (sisa - tagihan).abs() > f64::EPSILON {
      push_text(
        &mut out,
        &format!("Sisa Tagihan : Rp {}", fmt_rupiah(sisa)),
      );
    }
  }
  out.extend_from_slice(&cmd_bold_off());
  out.extend_from_slice(&cmd_feed_lines(1));

  out.extend_from_slice(&cmd_bold_on());
  out.extend_from_slice(&cmd_size(3, 4));
  push_text(
    &mut out,
    &get_string(order, &["customer", "nama"]).unwrap_or("-".into()),
  );

  out.extend_from_slice(&cmd_size(2, 2));
  out.extend_from_slice(&cmd_bold_off());
  if let Some(ket) = get_string(order, &["customer", "keterangan"]) {
    if !ket.trim().is_empty() {
      push_text(&mut out, &ket);
    }
  }
  out.extend_from_slice(&cmd_feed_lines(1));

  out.extend_from_slice(&cmd_size(1, 1));
  if let Some(items) = order.get("detail_pesanans").and_then(Value::as_array) {
    for item in items {
      let item_name = get_string(item, &["jenis_cuci", "nama"]).unwrap_or("Item".into());
      let jnama = item_name.to_lowercase();
      let tag = if jnama.contains("setrika") && jnama.contains("lipat") {
        Some(" [SETRIKA/LIPAT]")
      } else if jnama.contains("setrika") {
        Some(" [SETRIKA]")
      } else if jnama.contains("lipat") {
        Some(" [LIPAT]")
      } else {
        None
      };

      push_text(&mut out, &format!("({})", item_name));
      if let Some(t) = tag {
        out.extend_from_slice(&cmd_bold_on());
        out.extend_from_slice(&cmd_size(2, 1));
        push_text(&mut out, t);
        out.extend_from_slice(&cmd_bold_off());
        out.extend_from_slice(&cmd_size(1, 1));
      }
    }
  }

  out.extend_from_slice(&cmd_feed_lines(1));
  let tanggal_pesan = get_string(order, &["tanggal_pesan"]);
  let tanggal_selesai = get_string(order, &["tanggal_selesai"]);
  if let (Some(t_in), Some(t_out)) = (tanggal_pesan.clone(), tanggal_selesai.clone()) {
    if let (Some(in_dt), Some(out_dt)) = (parse_datetime(&t_in), parse_datetime(&t_out)) {
      let diff_secs = (out_dt.timestamp() - in_dt.timestamp()).max(0);
      let mut diff_days = (diff_secs as f64 / 86_400.0).ceil() as i64;
      if diff_days < 0 {
        diff_days = 0;
      }
      out.extend_from_slice(&cmd_size(2, 2));
      out.extend_from_slice(&cmd_bold_on());
      push_text(&mut out, &format!("{} Hari", diff_days));
      out.extend_from_slice(&cmd_bold_off());
      out.extend_from_slice(&cmd_size(1, 1));
      push_text(&mut out, &fmt_date_short(Some(t_out)));
    }
  }

  out.extend_from_slice(&cmd_feed_lines(10));
  out
}

#[derive(Clone)]
struct ItemLine {
  name: String,
  qty: f64,
  unit: String,
  harga: f64,
  total_harga: f64,
}

fn collect_items(order: &Value) -> (f64, Vec<ItemLine>) {
  let mut items = Vec::new();
  let mut subtotal = 0.0;
  if let Some(arr) = order.get("detail_pesanans").and_then(Value::as_array) {
    for item in arr {
      let total = get_number_obj(item, &["total_harga"]);
      subtotal += total;
      let (qty, unit) = resolve_qty_unit(item);
      items.push(ItemLine {
        name: get_string_obj(item, &["jenis_cuci", "nama"]).unwrap_or("-".into()),
        qty,
        unit,
        harga: get_number_obj(item, &["harga"]),
        total_harga: total,
      });
    }
  }
  (subtotal, items)
}

fn resolve_qty_unit(item: &Value) -> (f64, String) {
  let tipe = get_string_obj(item, &["jenis_cuci", "tipe"]).unwrap_or_default();
  let raw = get_number_obj(item, &["qty"]);
  match tipe.as_str() {
    "per_kilo" => (raw / 1000.0, "kg".into()),
    "satuan" => (raw, "pcs".into()),
    "kilo_meter" => (raw / 1000.0, "km".into()),
    _ => (raw / 1000.0, "meter".into()),
  }
}

fn sprintf5(qty: f64, unit: &str, harga: f64, total: f64) -> String {
  let q = format!("{:>5}", format!("{:.2}", qty));
  let u = format!("{:<3}", unit);
  let h = format!("{:>7}", format!("{:.3}", harga));
  let t = format!("{:>8}", format!("{:.3}", total));
  format!("{} {}  x  {} {}", q, u, h, t)
}

fn get_string(data: &Value, path: &[&str]) -> Option<String> {
  get_string_obj(data, path)
}

fn get_string_obj(data: &Value, path: &[&str]) -> Option<String> {
  let mut current = data;
  for key in path {
    current = current.get(*key)?;
  }
  if let Some(text) = current.as_str() {
    return Some(text.to_string());
  }
  if current.is_number() || current.is_boolean() {
    return Some(current.to_string());
  }
  None
}

fn get_number(data: &Value, path: &[&str]) -> f64 {
  get_number_obj(data, path)
}

fn get_number_obj(data: &Value, path: &[&str]) -> f64 {
  let mut current = data;
  for key in path {
    match current.get(*key) {
      Some(next) => current = next,
      None => return 0.0,
    }
  }
  if let Some(v) = current.as_f64() {
    return v;
  }
  if let Some(v) = current.as_i64() {
    return v as f64;
  }
  if let Some(v) = current.as_u64() {
    return v as f64;
  }
  if let Some(text) = current.as_str() {
    return text.parse::<f64>().unwrap_or(0.0);
  }
  0.0
}

fn fmt_rupiah(n: f64) -> String {
  let v = n.round() as i64;
  let neg = v < 0;
  let digits = v.abs().to_string();
  let mut grouped_rev = String::new();
  for (idx, c) in digits.chars().rev().enumerate() {
    if idx > 0 && idx % 3 == 0 {
      grouped_rev.push('.');
    }
    grouped_rev.push(c);
  }
  let grouped = grouped_rev.chars().rev().collect::<String>();
  if neg {
    format!("-{}", grouped)
  } else {
    grouped
  }
}

fn parse_datetime(raw: &str) -> Option<DateTime<Local>> {
  if let Ok(dt) = DateTime::parse_from_rfc3339(raw) {
    return Some(dt.with_timezone(&Local));
  }

  let candidates = [
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%d %H:%M",
    "%Y-%m-%dT%H:%M:%S",
    "%Y-%m-%dT%H:%M",
    "%Y-%m-%d",
  ];
  for fmt in candidates {
    if let Ok(naive) = NaiveDateTime::parse_from_str(raw, fmt) {
      return naive.and_local_timezone(Local).single();
    }
  }
  None
}

fn month_short_id(month: u32) -> &'static str {
  match month {
    1 => "Jan",
    2 => "Feb",
    3 => "Mar",
    4 => "Apr",
    5 => "Mei",
    6 => "Jun",
    7 => "Jul",
    8 => "Agu",
    9 => "Sep",
    10 => "Okt",
    11 => "Nov",
    12 => "Des",
    _ => "-",
  }
}

fn month_long_id(month: u32) -> &'static str {
  match month {
    1 => "Januari",
    2 => "Februari",
    3 => "Maret",
    4 => "April",
    5 => "Mei",
    6 => "Juni",
    7 => "Juli",
    8 => "Agustus",
    9 => "September",
    10 => "Oktober",
    11 => "November",
    12 => "Desember",
    _ => "-",
  }
}

fn weekday_long_id(w: chrono::Weekday) -> &'static str {
  match w {
    chrono::Weekday::Mon => "Senin",
    chrono::Weekday::Tue => "Selasa",
    chrono::Weekday::Wed => "Rabu",
    chrono::Weekday::Thu => "Kamis",
    chrono::Weekday::Fri => "Jumat",
    chrono::Weekday::Sat => "Sabtu",
    chrono::Weekday::Sun => "Minggu",
  }
}

fn fmt_date_short(raw: Option<String>) -> String {
  let Some(source) = raw else {
    return "-".into();
  };
  let Some(dt) = parse_datetime(&source) else {
    return source;
  };
  format!(
    "{:02}:{:02}, {:02} {} {}",
    dt.hour(),
    dt.minute(),
    dt.day(),
    month_short_id(dt.month()),
    dt.year()
  )
}

fn fmt_date_long(raw: Option<String>) -> String {
  let Some(source) = raw else {
    return "-".into();
  };
  let Some(dt) = parse_datetime(&source) else {
    return source;
  };
  format!("{:02} {} {}", dt.day(), month_long_id(dt.month()), dt.year())
}

fn fmt_weekday_long(raw: Option<String>) -> String {
  let Some(source) = raw else {
    return "-".into();
  };
  let Some(dt) = parse_datetime(&source) else {
    return "-".into();
  };
  weekday_long_id(dt.weekday()).into()
}

fn fmt_time_only(raw: Option<String>) -> String {
  let Some(source) = raw else {
    return "-".into();
  };
  let Some(dt) = parse_datetime(&source) else {
    return "-".into();
  };
  format!("{:02}:{:02}", dt.hour(), dt.minute())
}

fn build_logo_buffer(target_width: u32) -> Vec<u8> {
  let cache = LOGO_CACHE.get_or_init(|| Mutex::new(HashMap::new()));
  if let Ok(guard) = cache.lock() {
    if let Some(cached) = guard.get(&target_width) {
      return cached.clone();
    }
  }

  let logo_bytes = include_bytes!("../icons/icon.png");
  let logo = match image::load_from_memory(logo_bytes) {
    Ok(img) => img,
    Err(_) => return Vec::new(),
    // Keep empty on failure to avoid print crash.
  };
  let raster = rasterize_logo(logo, target_width);

  if let Ok(mut guard) = cache.lock() {
    guard.insert(target_width, raster.clone());
  }
  raster
}

fn rasterize_logo(img: DynamicImage, target_width: u32) -> Vec<u8> {
  let (orig_w, orig_h) = img.dimensions();
  if orig_w == 0 || orig_h == 0 {
    return Vec::new();
  }
  let target_h = ((orig_h as f64) * (target_width as f64 / orig_w as f64)).round() as u32;
  let resized = img.resize(target_width, target_h.max(1), FilterType::CatmullRom);
  let rgba = resized.to_rgba8();
  let (width, height) = rgba.dimensions();
  let width_bytes = width.div_ceil(8) as usize;
  let mut img_data = vec![0u8; width_bytes * height as usize];

  for y in 0..height {
    for x in 0..width {
      let p = rgba.get_pixel(x, y).0;
      let r = p[0] as f64;
      let g = p[1] as f64;
      let b = p[2] as f64;
      let a = p[3] as u16;
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      if a > 30 && gray < 180.0 {
        let idx = y as usize * width_bytes + (x as usize / 8);
        img_data[idx] |= 1 << (7 - (x as usize % 8));
      }
    }
  }

  let mut crop_top = 0usize;
  let mut crop_bottom = height as usize - 1;
  let mut found = false;

  for y in 0..height as usize {
    if (0..width_bytes).any(|bx| img_data[y * width_bytes + bx] != 0) {
      crop_top = y;
      found = true;
      break;
    }
  }
  if !found {
    return Vec::new();
  }

  for y in (0..height as usize).rev() {
    if (0..width_bytes).any(|bx| img_data[y * width_bytes + bx] != 0) {
      crop_bottom = y;
      break;
    }
  }

  let cropped_height = crop_bottom.saturating_sub(crop_top) + 1;
  let data_start = crop_top * width_bytes;
  let data_end = (crop_bottom + 1) * width_bytes;
  let cropped_data = &img_data[data_start..data_end];

  let mut out = Vec::with_capacity(8 + cropped_data.len());
  out.extend_from_slice(&[
    GS,
    0x76,
    0x30,
    0x00,
    (width_bytes & 0xff) as u8,
    ((width_bytes >> 8) & 0xff) as u8,
    (cropped_height & 0xff) as u8,
    ((cropped_height >> 8) & 0xff) as u8,
  ]);
  out.extend_from_slice(cropped_data);
  out
}
