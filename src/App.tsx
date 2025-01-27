import Canvas from "./components/CanvasWrapper";
import "./App.css";
import Menu from "./components/Menu";

function App() {
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-1 bg-amber-200">
        <Menu />
      </div>
      <div className="col-span-11 bg-gray-100">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
