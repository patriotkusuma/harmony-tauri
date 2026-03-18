import React from 'react';
import { Card, CardHeader, Button } from 'reactstrap';

const AntarJemputCard = ({ antarActive, updateAntarJemput, pesanan }) => {
  return (
    <Card className="bg-secondary shadow mb-2">
      <CardHeader>
        <h3 className="mb-0 font-weight-light">
          Apakah Antar Jemput ?
        </h3>
        <Button
          color={antarActive === 1 ? "default" : "secondary"}
          size="sm"
          onClick={() => updateAntarJemput(1, pesanan)}
        >
          Ya
        </Button>
        <Button
          color={antarActive === 0 ? "default" : "secondary"}
          size="sm"
          onClick={() => updateAntarJemput(0, pesanan)}
        >
          Tidak
        </Button>
      </CardHeader>
    </Card>
  );
};

export default AntarJemputCard;