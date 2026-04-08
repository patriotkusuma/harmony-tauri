import React, { useState } from 'react';
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, Badge, Button } from 'reactstrap';
import NotifInput from '../../atoms/notif/NotifInput';
import NotifSectionHeader from '../../molecules/notif/NotifSectionHeader';

// ==============================================================
// DEFAULT TEMPLATES — mirroring backend hardcoded messages
// ==============================================================
const DEFAULT_TEMPLATES = {
  template_order_created: `{{.Greeting}} {{.CustomerName}} 👋

Pesanan laundry Anda telah kami terima. Berikut detailnya:

📄 *Kode Pesanan:* {{.OrderCode}}
💳 *Pembayaran:* {{.PaymentStatus}}
💲 *Total:* Rp *{{.Total}}*

-------------------------
⏳ Estimasi Selesai: *{{.Estimate}}*

🔗 Informasi Selengkapnya:
{{.Link}}

🙏 Terima kasih telah menggunakan layanan kami 🙏
*Harmony Laundry*`,

  template_order_created_en: `Hello *{{.CustomerName}}* 👋

Your laundry order has been received. Here are the details:

📄 *Order Code:* {{.OrderCode}}
💳 *Payment Status:* {{.PaymentStatus}}
💲 *Total:* Rp {{.Total}}

-------------------------
⏳ *All items ready by:* {{.Estimate}}

🔗 Track your order:
{{.Link}}

Thank you for choosing
*Harmony Laundry* 🙏`,

  template_order_done: `{{.Greeting}} *{{.CustomerName}}* 😊

Laundry dengan kode pesanan *{{.OrderCode}}* sudah *selesai dikerjakan* dan sudah dapat diambil.

Terima kasih sudah mempercayakan cucian kepada kami. Kami selalu berusaha memberikan layanan terbaik! 🙏

*Harmony Laundry*`,

  template_order_done_en: `{{.Greeting}} *{{.CustomerName}}* 😊

Your laundry with order code *{{.OrderCode}}* is now *ready* and available for pickup anytime.

Thank you for using our laundry service. We truly appreciate your trust! 🙏

*Harmony Laundry*`,

  template_unpaid_reminder: `{{.Greeting}} *{{.CustomerName}}* 🙏

Kami ingin mengingatkan bahwa masih ada tagihan laundry yang belum diselesaikan:

📄 *Kode Pesanan:* {{.OrderCode}}
💲 *Total Tagihan:* Rp {{.Total}}

Mohon segera lakukan pembayaran agar pesanan dapat diproses kembali.

Terima kasih atas kepercayaan Anda 🙏
*Harmony Laundry*`,

  template_unpaid_reminder_en: `{{.Greeting}} *{{.CustomerName}}* 🙏

This is a friendly reminder that you have an outstanding laundry bill:

📄 *Order Code:* {{.OrderCode}}
💲 *Total Amount:* Rp {{.Total}}

Please complete your payment so we can continue processing your order.

Thank you for your trust 🙏
*Harmony Laundry*`,
};

// ==============================================================
// PREVIEW HELPER — replace {{.Var}} with sample data
// ==============================================================
const SAMPLE_DATA = {
  '{{.CustomerName}}': 'Ibu Sari Dewi',
  '{{.OrderCode}}': 'HMY-240407',
  '{{.Total}}': '45.000',
  '{{.Estimate}}': '08 April 2026',
  '{{.PaymentStatus}}': 'Belum Lunas',
  '{{.Greeting}}': 'Selamat Malam',
  '{{.Link}}': 'https://harmonylaundrys.com/HMY-240407',
};

const SAMPLE_DATA_EN = {
  '{{.CustomerName}}': 'Mrs. Sarah Dewi',
  '{{.OrderCode}}': 'HMY-240407',
  '{{.Total}}': '45.000',
  '{{.Estimate}}': 'April 8, 2026',
  '{{.PaymentStatus}}': 'Unpaid',
  '{{.Greeting}}': 'Good Evening',
  '{{.Link}}': 'https://harmonylaundrys.com/HMY-240407',
};

const renderPreview = (template, isEN) => {
  if (!template) return '';
  const sample = isEN ? SAMPLE_DATA_EN : SAMPLE_DATA;
  let result = template;
  Object.entries(sample).forEach(([key, val]) => {
    result = result.replaceAll(key, val);
  });
  return result;
};

// Bold *text* → <strong>
const formatWhatsApp = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*([^*]+)\*/g);
    return (
      <div key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </div>
    );
  });
};

// ==============================================================
// A single template editor section (ID + EN + preview tabs)
// ==============================================================
const TemplateEditor = ({ title, nameID, nameEN, settings, onChange }) => {
  const [previewLang, setPreviewLang] = useState('id');

  const valueID = settings[nameID] || DEFAULT_TEMPLATES[nameID] || '';
  const valueEN = settings[nameEN] || DEFAULT_TEMPLATES[nameEN] || '';
  const previewText = renderPreview(previewLang === 'id' ? valueID : valueEN, previewLang === 'en');

  return (
    <div className="template-editor-block mb-4">
      <div className="te-label mb-2 d-flex align-items-center gap-2">
        <span className="te-title">{title}</span>
      </div>
      <div className="te-grid">
        {/* Left: Editors */}
        <div className="te-inputs">
          <div className="te-lang-label">
            <span className="badge-lang id">🇮🇩 Bahasa Indonesia</span>
          </div>
          <NotifInput
            type="textarea"
            rows="5"
            name={nameID}
            value={settings[nameID] !== undefined ? settings[nameID] : DEFAULT_TEMPLATES[nameID] || ''}
            onChange={onChange}
            placeholder={DEFAULT_TEMPLATES[nameID]}
          />

          <div className="te-lang-label mt-2">
            <span className="badge-lang en">🇬🇧 English</span>
          </div>
          <NotifInput
            type="textarea"
            rows="5"
            name={nameEN}
            value={settings[nameEN] !== undefined ? settings[nameEN] : DEFAULT_TEMPLATES[nameEN] || ''}
            onChange={onChange}
            placeholder={DEFAULT_TEMPLATES[nameEN]}
          />

          <div className="te-hint mt-1">
            <code>{'{{.CustomerName}}'}</code> <code>{'{{.OrderCode}}'}</code> <code>{'{{.Total}}'}</code>{' '}
            <code>{'{{.Estimate}}'}</code> <code>{'{{.Greeting}}'}</code> <code>{'{{.Link}}'}</code>{' '}
            <code>{'{{.PaymentStatus}}'}</code>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="te-preview">
          <div className="te-preview-header">
            <span>📱 Preview</span>
            <div className="te-lang-toggle">
              <button
                className={`te-toggle-btn ${previewLang === 'id' ? 'active' : ''}`}
                onClick={() => setPreviewLang('id')}
                type="button"
              >ID</button>
              <button
                className={`te-toggle-btn ${previewLang === 'en' ? 'active' : ''}`}
                onClick={() => setPreviewLang('en')}
                type="button"
              >EN</button>
            </div>
          </div>
          <div className="te-wa-bubble">
            <div className="te-bubble-text">
              {formatWhatsApp(previewText) || <span className="te-empty">Belum ada template...</span>}
            </div>
            <div className="te-bubble-time">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================================
// MAIN COMPONENT
// ==============================================================
const TemplateSettings = ({ settings, onChange }) => {
  if (!settings) return null;

  return (
    <Card className="border-0 card-inner-notification">
      <CardBody>
        <NotifSectionHeader title="Template Pesan WhatsApp" showDivider={false} />
        <p className="text-muted small mb-4">
          Kosongkan field untuk menggunakan template default Harmony. Setiap outlet bisa punya template berbeda, mendukung Bahasa Indonesia dan Inggris otomatis.
        </p>

        <TemplateEditor
          title="📥 Pesanan Masuk / Dibuat"
          nameID="template_order_created"
          nameEN="template_order_created_en"
          settings={settings}
          onChange={onChange}
        />

        <TemplateEditor
          title="✅ Pesanan Selesai / Siap Diambil"
          nameID="template_order_done"
          nameEN="template_order_done_en"
          settings={settings}
          onChange={onChange}
        />

        <TemplateEditor
          title="🔔 Pengingat Tagihan Belum Dibayar"
          nameID="template_unpaid_reminder"
          nameEN="template_unpaid_reminder_en"
          settings={settings}
          onChange={onChange}
        />

        <NotifSectionHeader title="Pesan Tambahan Khusus Outlet" />
        <NotifInput
          label="Custom Message Selesai (Per-Outlet)"
          type="textarea"
          rows="3"
          name="custom_notif_selesai"
          value={settings.custom_notif_selesai || ""}
          onChange={onChange}
          placeholder="Misal: Titik jemput di depan lobi atau info parkir gratis."
        />
      </CardBody>

      <style>{`
        .template-editor-block {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }

        .te-label {
          background: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 16px;
        }

        .te-title {
          font-weight: 700;
          font-size: 0.9rem;
          color: #2d3748;
        }

        .te-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        @media (max-width: 768px) {
          .te-grid {
            grid-template-columns: 1fr;
          }
        }

        .te-inputs {
          padding: 16px;
          border-right: 1px solid #e2e8f0;
        }

        .te-lang-label {
          margin-bottom: 4px;
        }

        .badge-lang {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .badge-lang.id {
          background: #ebf8ff;
          color: #2b6cb0;
        }

        .badge-lang.en {
          background: #f0fff4;
          color: #276749;
        }

        .te-hint {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .te-hint code {
          font-size: 0.7rem;
          background: #edf2f7;
          color: #5e72e4;
          padding: 1px 5px;
          border-radius: 4px;
        }

        .te-preview {
          background: #f0f2f5;
          display: flex;
          flex-direction: column;
        }

        .te-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #128C7E;
          color: white;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .te-lang-toggle {
          display: flex;
          gap: 4px;
        }

        .te-toggle-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .te-toggle-btn.active {
          background: rgba(255,255,255,0.9);
          color: #128C7E;
        }

        .te-wa-bubble {
          margin: 12px;
          background: #dcf8c6;
          border-radius: 8px 8px 8px 0;
          padding: 10px 12px;
          font-size: 0.83rem;
          line-height: 1.5;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          white-space: pre-wrap;
          flex: 1;
        }

        .te-bubble-text {
          min-height: 60px;
          color: #262626;
        }

        .te-empty {
          color: #999;
          font-style: italic;
        }

        .te-bubble-time {
          text-align: right;
          font-size: 0.68rem;
          color: #7a9e7a;
          margin-top: 6px;
        }

        /* dark mode */
        .dark-mode .template-editor-block {
          border-color: #4a5568;
        }
        .dark-mode .te-label {
          background: #2d3748;
          border-color: #4a5568;
        }
        .dark-mode .te-title { color: #edf2f7; }
        .dark-mode .te-inputs { border-color: #4a5568; }
        .dark-mode .te-hint code { background: #4a5568; color: #90cdf4; }
      `}</style>
    </Card>
  );
};

export default TemplateSettings;
