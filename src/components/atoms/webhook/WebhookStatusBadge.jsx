import React from 'react';
import { Badge } from 'reactstrap';

const WebhookStatusBadge = ({ status }) => {
  switch (status) {
    case 'success': 
      return <Badge color="success" pill>Sukses</Badge>;
    case 'processing': 
      return <Badge color="warning" pill>Processing</Badge>;
    case 'failed': 
      return <Badge color="danger" pill>Gagal</Badge>;
    default: 
      return <Badge color="secondary" pill>{status}</Badge>;
  }
};

export default WebhookStatusBadge;
