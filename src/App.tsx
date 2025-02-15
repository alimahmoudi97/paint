import Canvas from "./components/CanvasWrapper";
import "./App.css";
import Menu from "./components/Menu";
import ContextProvider from "./context/Context";
import Header from "./components/Header";
import Setting from "./components/Setting";

function App() {
  return (
    <ContextProvider>
      <div className="grid grid-cols-12 h-screen">
        <div className="col-span-1">
          <Menu />
        </div>
        <div className="col-span-9">
          <Header />
          <Canvas />
        </div>
        <div className="col-span-2">
          <Setting />
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
