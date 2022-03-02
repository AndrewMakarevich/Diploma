import './App.css';
import AuthModal from './components/modal-window/auth-modal/auth-modal';
import NavBar from './components/nav-bar/nav-bar';
import AppRouter from './components/routes/appRouter';

function App() {
  return (
    <div className="App">
      <NavBar />
      <AuthModal />
      <AppRouter />
    </div>
  );
}

export default App;
