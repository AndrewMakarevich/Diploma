import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '.';
import './App.css';
import AuthModal from './components/query-modal-window/auth-modal/auth-modal';
import NavBar from './components/nav-bar/nav-bar';
import AppRouter from './components/routes/appRouter';

function App() {
  const { userStore } = useContext(Context);
  useEffect(() => {
    userStore.autoAuth();
  }, []);
  return (
    <div className="App">
      <NavBar />
      <AuthModal />
      <AppRouter />
    </div>
  );
}

export default observer(App);
