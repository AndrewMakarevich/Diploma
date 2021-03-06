import navBarStyles from './nav-bar.module.css';
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Context } from "../..";
import { getParams, getParamsEnums } from "../../consts/popup-routes";
import { routePaths } from "../routes/paths";
import LogoutBtn from '../btns/logout-btn/logout-btn';
import BellIcon from '../../assets/img/icons/bell-icon/bell-icon';
import InvisibleButton from '../../UI/invisible-button/invisible-button';
import NotificationIcon from '../notifications-components/notification-icon/notification-icon';

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

  const [burgerState, setBurgerState] = useState(false);

  return (
    <nav className={navBarStyles["nav-bar"]}>

      <button className={`${navBarStyles["nav-bar__burger-btn"]} ${burgerState ? navBarStyles["burger-btn__active"] : ''}`}
        onClick={() => setBurgerState(!burgerState)}>
        <span className={navBarStyles["burger-btn__line"]}></span>
        <span className={navBarStyles["burger-btn__line"]}></span>
        <span className={navBarStyles["burger-btn__line"]}></span>
      </button>
      <span
        className={`${navBarStyles["burger-menu__background"]} ${burgerState ? navBarStyles["burger-menu__background-active"] : ''}`}
        onClick={() => setBurgerState(false)}>
      </span>

      <ul className={
        `
        ${navBarStyles["nav-bar__list"]} 
        ${navBarStyles["nav-bar__main-links-list"]}
        ${burgerState ? "" : navBarStyles["nav-bar__list-unactive"]}`
      }>
        <li className={navBarStyles["nav-bar__list-item"]}>
          <Link className={navBarStyles['nav-bar__link']} to={routePaths.mainPage}>Home</Link>
        </li>
        {
          userStore.isAuth ?
            <li className={navBarStyles["nav-bar__list-item"]}>
              <Link className={navBarStyles['nav-bar__link']} to={routePaths.personalCabinet.main}>Personal cabinet</Link>
            </li>
            :
            null
        }
      </ul>
      <ul className={navBarStyles["nav-bar__list"]}>
        {
          userStore.isAuth && <li className={navBarStyles["nav-bar__list-item"]}>
            <NotificationIcon />
          </li>
        }
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