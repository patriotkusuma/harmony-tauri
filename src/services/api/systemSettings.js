import axios from '../axios-instance';

const fetchAllSettings = async () => {
    const res = await axios.get('api/v2/system-settings');
    return res.data.data;
};

const fetchSetting = async (key) => {
    const res = await axios.get(`api/v2/system-settings/${key}`);
    return res.data.data;
};

const updateSetting = async (key, value) => {
    const res = await axios.put(`api/v2/system-settings/${key}`, { setting_value: value });
    return res.data;
};

const deleteSetting = async (key) => {
    const res = await axios.delete(`api/v2/system-settings/${key}`);
    return res.data;
};

export const systemSettingsService = {
    fetchAllSettings,
    fetchSetting,
    updateSetting,
    deleteSetting
};
