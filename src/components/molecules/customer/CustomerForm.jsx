/* ================================================================
   Customer Management — Molecule: CustomerForm
   Form create/edit customer, state management manual (no extra lib).
   ================================================================ */
import React, { useEffect, useState } from 'react';
import { useCustomerStore } from 'store/customerStore';

/* ── Field wrapper atom ─────────────────────────────────────────── */
const Field = ({ label, error, children, colSpan = 1 }) => (
  <div className="cust-field" style={colSpan === 2 ? { gridColumn: '1 / -1' } : {}}>
    <label className="cust-field__label">{label}</label>
    {children}
    {error && (
      <span className="cust-field__error">
        <i className="fas fa-exclamation-circle" /> {error}
      </span>
    )}
  </div>
);

/* ── Form defaults ──────────────────────────────────────────────── */
const EMPTY = {
  nama: '', telpon: '', alamat: '', keterangan: '',
  latitude: '', longitude: '', id_affiliate: '',
  is_active_resident: true,
};

const CustomerForm = () => {
  const { selected, modalMode, createCustomer, updateCustomer, formLoading, formError } = useCustomerStore();
  const isEdit = modalMode === 'edit';

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Pre-fill saat mode edit
  useEffect(() => {
    if (isEdit && selected) {
      setForm({
        nama              : selected.nama           ?? '',
        telpon            : selected.telpon          ?? '',
        alamat            : selected.alamat          ?? '',
        keterangan        : selected.keterangan      ?? '',
        latitude          : selected.latitude        ?? '',
        longitude         : selected.longitude       ?? '',
        id_affiliate      : selected.id_affiliate    ?? '',
        is_active_resident: selected.is_active_resident ?? true,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [isEdit, selected?.id]);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nama.trim()) errs.nama = 'Nama wajib diisi';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      nama              : form.nama.trim(),
      telpon            : form.telpon.trim()       || undefined,
      alamat            : form.alamat.trim()        || undefined,
      keterangan        : form.keterangan.trim()    || undefined,
      latitude          : form.latitude  !== '' ? parseFloat(form.latitude)  : undefined,
      longitude         : form.longitude !== '' ? parseFloat(form.longitude) : undefined,
      id_affiliate      : form.id_affiliate !== '' ? parseInt(form.id_affiliate, 10) : undefined,
      is_active_resident: Boolean(form.is_active_resident),
    };

    isEdit
      ? await updateCustomer(selected.id, payload)
      : await createCustomer(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="cust-form" noValidate>
      {formError && (
        <div className="cust-form__alert">
          <i className="fas fa-times-circle" /> {formError}
        </div>
      )}

      <div className="cust-form__grid">
        <Field label="Nama Lengkap *" error={errors.nama} colSpan={2}>
          <input
            type="text"
            className={`cust-form__input${errors.nama ? ' error' : ''}`}
            placeholder="Contoh: Budi Santoso"
            value={form.nama}
            onChange={set('nama')}
            autoFocus
          />
        </Field>

        <Field label="Nomor Telepon">
          <input
            type="tel"
            className="cust-form__input"
            placeholder="0812xxxxxxxx"
            value={form.telpon}
            onChange={set('telpon')}
          />
        </Field>

        <Field label="ID Afiliasi">
          <input
            type="number"
            className="cust-form__input"
            placeholder="Kosongkan jika tidak ada"
            value={form.id_affiliate}
            onChange={set('id_affiliate')}
            min="1"
          />
        </Field>

        <Field label="Alamat" colSpan={2}>
          <input
            type="text"
            className="cust-form__input"
            placeholder="Jl. Merdeka No. 1"
            value={form.alamat}
            onChange={set('alamat')}
          />
        </Field>

        <Field label="Keterangan" colSpan={2}>
          <textarea
            className="cust-form__input cust-form__textarea"
            placeholder="Catatan tambahan..."
            rows={2}
            value={form.keterangan}
            onChange={set('keterangan')}
          />
        </Field>

        <Field label="Latitude">
          <input
            type="number"
            step="any"
            className="cust-form__input"
            placeholder="-6.2"
            value={form.latitude}
            onChange={set('latitude')}
          />
        </Field>

        <Field label="Longitude">
          <input
            type="number"
            step="any"
            className="cust-form__input"
            placeholder="106.8"
            value={form.longitude}
            onChange={set('longitude')}
          />
        </Field>
      </div>

      {/* Resident toggle */}
      <div className="cust-form__toggle">
        <label className="cust-toggle-label">
          <input
            type="checkbox"
            checked={form.is_active_resident}
            onChange={set('is_active_resident')}
          />
          <span className="cust-toggle-track" />
          <span className="cust-toggle-text">Residen Aktif</span>
        </label>
      </div>

      <div className="cust-form__footer">
        <button type="submit" className="cust-form__submit" disabled={formLoading}>
          {formLoading
            ? <><i className="fas fa-spinner fa-spin" /> Menyimpan...</>
            : <><i className={`fas ${isEdit ? 'fa-save' : 'fa-plus-circle'}`} />
                {isEdit ? 'Simpan Perubahan' : 'Buat Customer'}</>
          }
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
