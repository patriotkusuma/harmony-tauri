import React from 'react';
import { Nav, NavItem, TabContent, TabPane } from 'reactstrap';
import NotifTabLink from '../../atoms/notif/NotifTabLink';

const NotifSettingsTemplate = ({ 
  activeTab, 
  onTabChange, 
  generalContent, 
  reminderContent, 
  templateContent,
  globalContent 
}) => {
  return (
    <>
      <Nav tabs className="nav-fill flex-column flex-md-row nav-tabs-notification">
        <NavItem>
          <NotifTabLink
            active={activeTab === "1"}
            onClick={() => onTabChange("1")}
            icon="fas fa-cog"
          >
            Umum
          </NotifTabLink>
        </NavItem>
        <NavItem>
          <NotifTabLink
            active={activeTab === "2"}
            onClick={() => onTabChange("2")}
            icon="fas fa-clock"
          >
            Jam Tenang & Reminder
          </NotifTabLink>
        </NavItem>
        <NavItem>
          <NotifTabLink
            active={activeTab === "3"}
            onClick={() => onTabChange("3")}
            icon="fas fa-envelope"
          >
            Template Pesan
          </NotifTabLink>
        </NavItem>
        <NavItem>
          <NotifTabLink
            active={activeTab === "4"}
            onClick={() => onTabChange("4")}
            icon="fas fa-globe"
          >
            Pengumuman Global
          </NotifTabLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab} className="mt-4">
        <TabPane tabId="1">{generalContent}</TabPane>
        <TabPane tabId="2">{reminderContent}</TabPane>
        <TabPane tabId="3">{templateContent}</TabPane>
        <TabPane tabId="4">{globalContent}</TabPane>
      </TabContent>
    </>
  );
};

export default NotifSettingsTemplate;
