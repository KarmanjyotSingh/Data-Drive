import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
export default function SideBar({ collapsed, setCollapsed, setTab }) {
  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<KeyboardDoubleArrowRightIcon />}
              onClick={() => setCollapsed(!collapsed)}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<KeyboardDoubleArrowLeftIcon />}
              onClick={() => setCollapsed(!collapsed)}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px",
                }}
              >
                Data Drive
              </div>
            </MenuItem>
          )}
        </Menu>
        <Menu>
          <MenuItem
            icon={<HomeIcon />}
            onClick={() => {
              setTab("myfiles");
            }}
          >
            {" "}
            My Files{" "}
          </MenuItem>
          <SubMenu icon={<FolderSharedIcon />} label="Shared Files">
            <MenuItem onClick={() => setTab("sharedfiles")}>
              Shared With Me
            </MenuItem>
            <MenuItem onClick={() => setTab("sharedfolders")}>
              Shared By Me
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </>
  );
}
