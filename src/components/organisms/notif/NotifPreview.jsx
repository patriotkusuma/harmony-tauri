import React from 'react';
import { Card, CardBody } from 'reactstrap';

const NotifPreview = ({ settings, outletName }) => {
  const customerName = "Budi Sudarsono";
  const orderCode = "HMY-12345";

  return (
    <Card className="border-0 shadow-premium overflow-hidden" style={{ borderRadius: '15px', position: 'sticky', top: '20px' }}>
      <div className="bg-success py-2 px-3 text-white d-flex align-items-center">
        <i className="fab fa-whatsapp me-2 fa-lg" />
        <span className="font-weight-bold">Preview WhatsApp</span>
      </div>
      <CardBody className="bg-whatsapp-chat p-3" style={{ 
        backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
        backgroundSize: 'contain',
        minHeight: '400px'
      }}>
        <div className="whatsapp-bubble p-3 shadow-sm" style={{ 
          backgroundColor: '#dcf8c6', 
          borderRadius: '10px 10px 10px 0', 
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          position: 'relative'
        }}>
          <div>Halo Kak {customerName} 😊</div>
          <br />
          <div>Laundry dengan kode pesanan <strong>*{orderCode}*</strong> sudah <strong>*selesai dikerjakan*</strong> dan sudah dapat diambil.</div>
          <br />
          {settings.custom_notif_selesai && (
            <>
              <div>{settings.custom_notif_selesai}</div>
              <br />
            </>
          )}
          {settings.global_finish_announcement && (
            <>
              <div><strong>*Informasi Penting:*</strong></div>
              <div>{settings.global_finish_announcement}</div>
              <br />
            </>
          )}
          <div>Terima kasih sudah mempercayakan cucian kepada kami. Kami selalu berusaha memberikan layanan terbaik! 🙏</div>
          <br />
          <div><strong>*{outletName || 'Harmony Laundry'}*</strong></div>
          <div className="text-end mt-1" style={{ fontSize: '0.7rem', color: '#999' }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </CardBody>
      <style>{`
        .bg-whatsapp-chat {
          position: relative;
        }
        .whatsapp-bubble:after {
          content: "";
          position: absolute;
          left: -10px;
          bottom: 0;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid #dcf8c6;
          border-top: 10px solid #dcf8c6;
          border-bottom: 10px solid transparent;
        }
      `}</style>
    </Card>
  );
};

export default NotifPreview;
