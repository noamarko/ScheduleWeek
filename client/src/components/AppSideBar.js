import React from "react";
import { Link } from "react-router-dom";
import {
  ProSidebar,
  SidebarHeader,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";

const sideBarStyle = {
  position: "fixed",
  color: "white"
};


function AppSideBar() {
  return (
    <ProSidebar width="14%" style={sideBarStyle}>
      <SidebarHeader style={{backgroundColor:'cadetblue '}}>Menu</SidebarHeader>
      <SidebarContent style={{backgroundColor:'cadetblue '}}>
        <Menu popperArrow={true}>
          <MenuItem>
            <Link to="/" />
            Input Student Details
          </MenuItem>
          <MenuItem>
            <Link to="/Schedule" />
            Schedule
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
}
export default AppSideBar;
