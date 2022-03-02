import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Context } from "../..";
import { adminPaths, guestPaths, userPaths } from "./paths";

const AppRouter = () => {
  const { userStore } = useContext(Context);
  return (
    <Routes>
      <Route path='/*' element={<Navigate to='/' />} />
      {
        userStore.isAuth && userPaths.map(({ path, component }) => {
          return (
            <Route path={path} element={component()} />
          )

        })
      }
      {
        userStore.isAuth && adminPaths.map(({ path, component }) => {
          return (
            <Route path={path} element={component()} />
          )

        })
      }
      {
        guestPaths.map(({ path, component }) => <Route path={path} element={component()} />)
      }
    </Routes>
  )
}
export default observer(AppRouter);