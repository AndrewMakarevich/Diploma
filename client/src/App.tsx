import { observer } from 'mobx-react-lite';
import './App.css';
import AuthModal from './components/query-modal-window/auth-modal/auth-modal';
import NavBar from './components/nav-bar/nav-bar';
import AppRouter from './components/routes/appRouter';
import Footer from './components/footer/footer';

function App() {
  return (
    <div className="App">
      <NavBar />
      <AuthModal />
      <AppRouter />
      <Footer />
    </div>
  );
}

export default observer(App);
