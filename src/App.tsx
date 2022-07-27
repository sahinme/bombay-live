import { AnimatePresence } from "framer-motion";
import "./App.css";
import Backdrop from "./components/Backdrop";
import Header from "./components/Header";
import Container from "./containers";
import AppProvider from "./contexts/AppContext";

function App() {
  return (
    <AnimatePresence>
      <AppProvider>
        <Header />
        <Container />
        <Backdrop />
      </AppProvider>
    </AnimatePresence>
  );
}

export default App;
