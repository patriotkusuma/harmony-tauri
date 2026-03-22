import React, { useState, useEffect } from 'react';
import { whatsappInstance } from 'services/whatsapp-instance';
import userRobot from 'assets/img/user/robot23d.png';
import { formatImageUrl } from 'utils/formatImageUrl';

export const getInitials = (name) => {
  if (!name) return "US";
  const words = name.split(" ");
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const CustomerAvatar = ({ customer, fallbackType = 'initials' }) => {
  const [avatarUrl, setAvatarUrl] = useState(customer?.avatar_url);

  // Sinkronkan state jika 'customer' di props berubah (terutama id atau telponnya berubah)
  useEffect(() => {
    setAvatarUrl(customer?.avatar_url);
  }, [customer?.id, customer?.avatar_url]);

  useEffect(() => {
    let isMounted = true;
    const fetchAvatar = async () => {
      // Hanya fetch jika avatar_url masih kosong dan nomor telepon tersedia
      if (!avatarUrl && customer?.telpon) {
        try {
          // Bersihkan karakter non-digit
          let jid = customer.telpon.replace(/\D/g, '');
          // Format ke kode negara 62
          if (jid.startsWith('08')) {
            jid = '62' + jid.substring(1);
          } else if (jid.startsWith('8')) {
            jid = '62' + jid;
          }
          jid = jid + "@s.whatsapp.net";

          // Fetch ke layanan WA kita
          const response = await whatsappInstance.get('/user/avatar', {
            params: { phone: jid, is_preview: true },
            headers: { 'X-Device-Id': 'harmony-gebang' }
          });

          // Set URL jika tersedia
          if (isMounted && response.data?.results?.url) {
            setAvatarUrl(response.data.results.url);
          }
        } catch (error) {
          // Abaikan error misal wa number tidak valid atau tidak memiliki avatar
        }
      }
    };

    fetchAvatar();

    return () => {
      isMounted = false;
    };
  }, [customer?.telpon, avatarUrl]);

  if (avatarUrl) {
    return <img src={formatImageUrl(avatarUrl)} alt={customer?.nama || 'Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  }
  
  if (fallbackType === 'robot') {
    return <img src={userRobot} alt={customer?.nama || 'Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  }

  return <>{getInitials(customer?.nama)}</>;
};

export default CustomerAvatar;
