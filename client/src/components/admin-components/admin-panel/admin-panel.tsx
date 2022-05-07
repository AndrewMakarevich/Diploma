import { Outlet } from "react-router-dom";
import AdminNavBar from "../admin-nav-bar/admin-nav-bar";

import panelStyles from "./admin-panel.module.css";

const AdminPanel = () => {
  return (
    <article className={panelStyles["main-wrapper"]}>
      <AdminNavBar />
      <Outlet />
    </article>
  )
};

export default AdminPanel;