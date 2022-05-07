import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../..";
import { routePaths } from "../../routes/paths";

import navStyles from "./admin-nav-bar.module.css";

const AdminNavBar = () => {
  const { userStore } = useContext(Context);
  return (
    <ul>
      <li>
        {
          userStore.userData.role?.moderatePictureType ?
            <Link to={routePaths.personalCabinet.adminPanel.pictureType}>Picture types moderation</Link>
            :
            <p className={navStyles["no-permission"]}> Picture types moderation</p>
        }
      </li>
      <li>
        {
          userStore.userData.role?.moderatePictureTag ?
            <Link to={routePaths.personalCabinet.adminPanel.pictureTag}>Picture tags moderation</Link>
            :
            <p className={navStyles["no-permission"]}> Picture tags moderation</p>
        }
      </li>
    </ul>
  )
};

export default AdminNavBar;