import React from "react";

interface ToolbarProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ top, left, width, height }) => {
  const toolbarStyle: React.CSSProperties = {
    position: "absolute",
    top: top - 40, // Position the toolbar above the object
    left: left + width / 2 - 50, // Center the toolbar horizontally
    transform: "translateX(-50%)",
    backgroundColor: "white",
    padding: "5px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: 1000000,
    background: "red",
  };

  return (
    <div style={toolbarStyle}>
      <button className="toolbar-button">Delete</button>
      <button className="toolbar-button">Duplicate</button>
      <button className="toolbar-button">Edit</button>
    </div>
  );
};

export default Toolbar;
