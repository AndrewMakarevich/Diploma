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
        userStore.isAuth && userPaths.map(({ path, component: Component }) => <Route path={path} element={<Component />} />)
      }
      {
        userStore.isAuth && adminPaths.map(({ path, component: Component }) => <Route path={path} element={<Component />} />)
      }
      {
        guestPaths.map(({ path, component: Component }) => <Route path={path} element={<Component />} />)
      }
    </Routes>
  )
}
export default observer(AppRouter);