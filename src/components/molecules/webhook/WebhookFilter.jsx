import React from 'react';
import { Input, Button } from 'reactstrap';

const WebhookFilter = ({ filters, setFilters, onSearch }) => {
  return (
    <div className="d-flex gap-2">
      <Input
        type="select"
        className="custom-input shadow-sm rounded-pill w-auto"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
      >
        <option value="">Semua Status</option>
        <option value="success">Sukses</option>
        <option value="failed">Gagal</option>
        <option value="processing">Processing</option>
      </Input>

      <Input
        type="text"
        placeholder="Cari Tipe Event..."
        className="custom-input shadow-sm rounded-pill"
        value={filters.event}
        onChange={(e) => setFilters({ ...filters, event: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <Button color="primary" className="rounded-pill px-3 shadow-sm" onClick={onSearch}>
        <i className="fas fa-search"></i>
      </Button>
    </div>
  );
};

export default WebhookFilter;
