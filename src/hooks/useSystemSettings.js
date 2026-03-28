import { useState, useEffect, useCallback } from "react";
import { systemSettingsService } from "../services/api/systemSettings";
import { toast } from "react-toastify";

export const useSystemSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null); // Key being saved

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await systemSettingsService.fetchAllSettings();
            setSettings(data || {});
        } catch (err) {
            toast.error("Gagal memuat pengaturan sistem");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSetting = async (key, value) => {
        setSaving(key);
        try {
            await systemSettingsService.updateSetting(key, String(value));
            setSettings(prev => ({ ...prev, [key]: String(value) }));
            toast.success(`Pengaturan ${key} berhasil diperbarui`);
            return true;
        } catch (err) {
            toast.error(`Gagal merubah ${key}`);
            return false;
        } finally {
            setSaving(null);
        }
    };

    const resetSetting = async (key) => {
        setSaving(key);
        try {
            await systemSettingsService.deleteSetting(key);
            // Re-fetch to get default value from .env/backend
            await fetchSettings();
            toast.success(`Pengaturan ${key} di-reset ke standar`);
            return true;
        } catch (err) {
            toast.error(`Gagal mereset ${key}`);
            return false;
        } finally {
            setSaving(null);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        saving,
        updateSetting,
        resetSetting,
        fetchSettings
    };
};
