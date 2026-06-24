import { useState } from "react";
import Canvas from "./components/CanvasWrapper";
import "./App.css";
import Menu from "./components/Menu";
import ContextProvider from "./context/Context";
import Header from "./components/Header";
import Setting from "./components/Setting";
import LandingPage from "./components/LandingPage";

function App() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return <LandingPage onEnterApp={() => setShowApp(true)} />;
  }

  return (
    <ContextProvider>
      <div className="flex h-dvh">
        <div>
          <Menu />
        </div>
        <div>
          <Header />
          <Canvas />
        </div>
        <div className="flex-1">
          <Setting />
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
