import React from "react";
import SidebarItem from "components/atoms/sidebar/SidebarItem";
import { SidebarHeading, SidebarDivider } from "components/atoms/sidebar/SidebarElements";

const SidebarNavSection = ({ heading, items, isAdminOrOwner, userRole, onClick }) => {
  const filteredItems = items.filter(item => {
    if (!item.role) return true;
    return item.role.includes(userRole);
  });

  if (filteredItems.length === 0) return null;

  return (
    <>
      {heading && <SidebarHeading text={heading} />}
      {filteredItems.map((item, index) => (
        <SidebarItem
          key={index}
          to={item.to}
          icon={item.icon}
          label={item.label}
          onClick={onClick}
        />
      ))}
      <SidebarDivider />
    </>
  );
};

export default SidebarNavSection;
