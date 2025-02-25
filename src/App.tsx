import Canvas from "./components/CanvasWrapper";
import "./App.css";
import Menu from "./components/Menu";
import ContextProvider from "./context/Context";
import Header from "./components/Header";
import Setting from "./components/Setting";

function App() {
  return (
    <ContextProvider>
      <div className="flex h-screen">
        <div>
          <Menu />
        </div>
        <div>
          <Header />
          <Canvas />
        </div>
        <div>
          <Setting />
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
