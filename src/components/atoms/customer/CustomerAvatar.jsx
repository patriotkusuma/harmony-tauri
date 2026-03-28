/* ================================================================
   Customer Management — Atom: CustomerAvatar
   Avatar inisial nama customer dengan warna deterministik.
   ================================================================ */
import React, { useState, useEffect } from 'react';
import { whatsappInstance } from 'services/whatsapp-instance';
import { formatImageUrl } from 'utils/formatImageUrl';

const PALETTE = [
  ['#5e72e4','#eef0fd'], ['#2dce89','#e8f8f2'], ['#11cdef','#e3f9fd'],
  ['#fb6340','#fff0eb'], ['#f5365c','#fde8ec'], ['#8965e0','#f0ebfd'],
  ['#f4a261','#fff4ea'], ['#2196f3','#e3f2fd'],
];

const getColor = (name = '') => {
  const idx = (name.charCodeAt(0) || 0) % PALETTE.length;
  return PALETTE[idx];
};

const CustomerAvatar = ({ customer, size = 38 }) => {
  const name = customer?.nama || '';
  const initialUrl = customer?.avatar_url || null;
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);

  const initials = name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  const [fg, bg] = getColor(name);

  useEffect(() => {
    setAvatarUrl(customer?.avatar_url);
  }, [customer?.id, customer?.avatar_url]);

  useEffect(() => {
    let isMounted = true;
    const fetchAvatar = async () => {
      if (!avatarUrl && customer?.telpon) {
        try {
          let jid = customer.telpon.replace(/\D/g, '');
          if (jid.startsWith('08')) jid = '62' + jid.substring(1);
          else if (jid.startsWith('8')) jid = '62' + jid;
          jid = jid + "@s.whatsapp.net";

          const response = await whatsappInstance.get('/user/avatar', {
            params: { phone: jid, is_preview: true },
            headers: { 'X-Device-Id': 'harmony-gebang' }
          });

          if (isMounted && response.data?.results?.url) {
            setAvatarUrl(response.data.results.url);
          }
        } catch (error) {
          // Ignore errors
        }
      }
    };

    fetchAvatar();
    return () => { isMounted = false; };
  }, [customer?.telpon, avatarUrl]);

  if (avatarUrl) {
    return (
      <img
        src={formatImageUrl(avatarUrl)}
        alt={name}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.38,
      flexShrink: 0, userSelect: 'none', letterSpacing: '-0.5px',
    }}>
      {initials || '?'}
    </div>
  );
};

export default CustomerAvatar;
