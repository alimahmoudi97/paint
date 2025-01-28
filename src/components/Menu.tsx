import { useContextCanvas } from "../context/Context";

function Menu() {
  const { setContentState } = useContextCanvas();

  const handleShapeBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    setContentState((prev) => ({
      ...prev,
      type: (event.target as HTMLElement).id,
    }));
  };

  return (
    <div>
      <div className="flex">
        <div className="flex flex-col gap-2" onClick={handleShapeBtn}>
          <button className="cursor-pointer" id="rectangle">
            Reactangle
          </button>
          <button className="cursor-pointer" id="cirle">
            Circle
          </button>
          <button className="cursor-pointer" id="triangle">
            Triangle
          </button>
        </div>
      </div>
    </div>
  );
}
export default Menu;
