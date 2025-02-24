import { useContextCanvas } from "../hooks/useContextCanvas";
import Layers from "./Layers";
import ObjectSetting from "./ObjectSetting";
import TypographySetting from "./TypographySetting";

function Setting() {
  const { contentState } = useContextCanvas();

  // useEffect(() => {
  //   console.log("selected object:", contentState.selectedObject?.type);
  // }, [contentState]);

  return (
    <div className="h-screen bg-white w-full flex flex-col px-2 py-4 z-100 shadow-lg relative">
      <h2 className="text-base mb-4 font-semibold">Design</h2>
      <h2 className="border-b text-base font-semibold border-gray-300">
        {contentState.selectedObject?.type
          ? contentState.selectedObject.type.charAt(0).toUpperCase() +
            contentState.selectedObject.type.slice(1)
          : ""}
      </h2>
      {contentState.tool === "text" ||
      contentState.selectedObject?.type === "i-text" ? (
        <TypographySetting />
      ) : (
        <>
          <ObjectSetting />
          <Layers />
        </>
      )}
    </div>
  );
}

export default Setting;
