import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Context } from "../..";
import { guestPaths, userPaths } from "./paths";
import appRouterStyles from "./appRouter.module.css";

const AppRouter = () => {
  const { userStore } = useContext(Context);
  return (
    <div className={appRouterStyles["app-router-wrapper"]}>
      <Routes>
        <Route path='/*' element={<Navigate to='/' />} />
        {
          userStore.isAuth && userPaths.map(({ id, path, component: Component, subPaths }) => {
            return (
              <Route key={id} path={path} element={<Component />}>
                {
                  subPaths.length && subPaths.map(({ id, path, component: Component }) => <Route key={id} path={path} element={<Component />} />)
                }
              </Route>
            )
          })
        }
        {
          guestPaths.map(({ id, path, component: Component }) => <Route key={id} path={path} element={<Component />} />)
        }
      </Routes>
    </div>

  )
}
export default observer(AppRouter);