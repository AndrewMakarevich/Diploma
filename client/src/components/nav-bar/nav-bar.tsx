import navBarStyles from './nav-bar.module.css';
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Context } from "../..";
import { getParams, getParamsEnums } from "../../consts/popup-routes";
import { guestPaths, userPaths } from "../routes/paths";
import LogoutBtn from '../btns/logout-btn/logout-btn';

const NavBar = () => {
  const { userStore } = useContext(Context);
  const [searchParams] = useSearchParams();
  interface getParamObj {
    param: string,
    value: string
  }
  function createLinkWithGetParams(getParamObjs: getParamObj[]) {
    getParamObjs.forEach(getParamObj => {
      searchParams.set(getParamObj.param, getParamObj.value);
    });
    return "?" + searchParams.toString();
  }
  const authPopupLink = createLinkWithGetParams([
    { param: getParams.popup, value: getParamsEnums.popup.auth },
    { param: getParams.type, value: getParamsEnums.type.signup }
  ]);

  return (
    <nav className={navBarStyles["nav-bar"]}>
      <ul className={navBarStyles["nav-bar__list"]}>
        <li className={navBarStyles["nav-bar__list-item"]}>
          <ul className={navBarStyles["nav-bar__sub-list"]}>
            <li className={navBarStyles["nav-bar__sub-list-item"]}>
              {
                guestPaths.map(({ path, name }) => <Link className={navBarStyles['nav-bar__link']} to={path}>{name}</Link>)
              }
            </li>
            <li className={navBarStyles["nav-bar__sub-list-item"]}>
              {
                userStore.isAuth && userPaths.map(({ path, name }) => <Link className={navBarStyles['nav-bar__link']} to={path}>{name}</Link>)
              }
            </li>
            {/* <li className={navBarStyles["nav-bar__sub-list-item"]}>
              {
                userStore.isAuth && adminPaths.map(({ path, name }) => <Link className={navBarStyles['nav-bar__link']} to={path}>{name}</Link>)
              }
            </li> */}
          </ul>
        </li>
        <li className={navBarStyles["nav-bar__list-item"]}>
          {
            userStore.isAuth ?
              <LogoutBtn stylesById={navBarStyles['logout-btn']} />
              :
              <Link className={navBarStyles['nav-bar__link']} to={authPopupLink}>SignUp</Link>
          }
        </li>

      </ul>
    </nav>
  )
}
export default observer(NavBar);