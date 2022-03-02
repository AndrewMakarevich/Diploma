
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Context } from "../..";
import { getParams, getParamsEnums } from "../../consts/popup-routes";
import { guestPaths, userPaths, adminPaths } from "../routes/paths";
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
    <nav>
      <ul>
        <li>
          <ul>
            {
              guestPaths.map(({ path, name }) => <Link to={path}>{name}</Link>)
            }
            {
              userStore.isAuth && userPaths.map(({ path, name }) => <Link to={path}>{name}</Link>)
            }
            {
              userStore.isAuth && adminPaths.map(({ path, name }) => <Link to={path}>{name}</Link>)
            }
          </ul>
        </li>
        <li>
          <Link to={authPopupLink}>Auth</Link>
        </li>

      </ul>
    </nav>
  )
}
export default observer(NavBar);