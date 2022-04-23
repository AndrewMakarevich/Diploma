import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Context } from "../..";
import { guestPaths, userPaths } from "./paths";
import appRouterStyles from "./appRouter.module.css";

interface subPaths {
  id: number;
  name: string;
  path: string;
  component: () => JSX.Element;
  subPaths?: subPaths[]
}

const AppRouter = () => {
  const { userStore } = useContext(Context);
  const createPaths = (id: number, path: string, Component: () => JSX.Element, subPathsArr?: subPaths[]) => {
    if (!subPathsArr || !subPathsArr.length) {
      return <Route key={id} path={path} element={<Component />}></Route>
    }

    return <Route key={id} path={path} element={<Component />}>
      {subPathsArr.map(pathObj =>
        createPaths(pathObj.id, pathObj.path, pathObj.component, pathObj.subPaths)
      )}</Route>
  }

  return (
    <div className={appRouterStyles["app-router-wrapper"]}>
      <Routes>
        <Route path='/*' element={<Navigate to='/' />} />
        {
          userStore.isAuth && userPaths.map(({ id, path, component: Component, subPaths }) => {
            return (
              createPaths(id, path, Component, subPaths)
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