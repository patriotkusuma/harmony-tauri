import React from 'react';

const NotifSectionHeader = ({ title, showDivider = true }) => {
  return (
    <>
      {showDivider && <hr className="my-4 divider-notification" />}
      <h5 className="h4 text-muted mb-4 section-title-notification">{title}</h5>
    </>
  );
};

export default NotifSectionHeader;
