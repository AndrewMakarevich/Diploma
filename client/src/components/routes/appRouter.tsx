import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Context } from "../..";
import { guestPaths, routePaths, userPaths } from "./paths";
import appRouterStyles from "./appRouter.module.css";
import HomePage from "../../pages/home-page/home-page";
import UserPage from "../../pages/user-page/user-page";
import MyGallery from "../my-gallery/my-gallery";
import AdminCabinet from "../../pages/admin-cabinet/admin-cabinet";
import UserCabinet from "../../pages/user-cabinet/user-cabinet";
import useFetching from "../../hooks/useFetching";

// interface subPaths {
//   id: number;
//   name: string;
//   path: string;
//   component: () => JSX.Element;
//   subPaths?: subPaths[]
// }

const AppRouter = () => {
  const { userStore } = useContext(Context);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    console.log(authLoading)
  }, [authLoading])

  useEffect(() => {
    userStore.autoAuth().then(() => { setAuthLoading(false) }, () => { setAuthLoading(false) });
  }, []);

  if (authLoading) {
    return null;
  }

  return (
    <div className={appRouterStyles["app-router-wrapper"]}>
      <Routes>
        <Route path='/*' element={<Navigate to='/' />} />
        <Route path={routePaths.mainPage} element={<HomePage />} />
        <Route path={routePaths.userPage} element={<UserPage />} />
        {
          userStore.isAuth ?
            <Route path={routePaths.personalCabinet.main} element={<UserCabinet />}>
              <Route index element={<MyGallery />} />
              {
                userStore.isAdmin ?
                  <Route path={routePaths.personalCabinet.adminPanel} element={<AdminCabinet />} />
                  :
                  null
              }

            </Route>
            :
            null
        }

      </Routes>
    </div>

  )
}
export default observer(AppRouter);