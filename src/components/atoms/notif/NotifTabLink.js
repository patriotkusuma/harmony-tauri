import React from 'react';
import { NavLink } from 'reactstrap';
import classnames from 'classnames';

const NotifTabLink = ({ active, onClick, icon, children }) => {
  return (
    <NavLink
      className={classnames("mb-sm-3 mb-md-0", {
        active: active,
      })}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {icon && <i className={`${icon} mr-2`} />}
      {children}
    </NavLink>
  );
};

export default NotifTabLink;
