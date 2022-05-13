import { Outlet } from "react-router-dom";
import SideBar from "../../side-bar/side-bar";
import AdminNavBar from "../admin-nav-bar/admin-nav-bar";

import panelStyles from "./admin-panel.module.css";

const AdminPanel = () => {
  return (
    <article className={panelStyles["main-wrapper"]}>
      <Outlet />
      <SideBar>
        <AdminNavBar />
      </SideBar>
    </article>
  )
};

export default AdminPanel;