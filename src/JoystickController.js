import React, { useState } from "react";

function Joystick() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [visitedAreas, setVisitedAreas] = useState([]);
  const [path, setPath] = useState([]);

  const handleSave = () => {
    // Create a new image element to draw on a canvas.
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src =
      "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pY29ufHx8fGVufDB8fHx8fA%3D%3D";
  
    image.onload = () => {
      try {
        // Create a hidden canvas element and context.
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
  
        // Set the canvas size to match the image.
        canvas.width = image.width;
        canvas.height = image.height;
  
        // Draw the image on the canvas.
        context.drawImage(image, 0, 0, image.width, image.height);
  
        // Draw the cursor on the canvas.
        const cursorX = cursorPosition.x;
        const cursorY = cursorPosition.y;
        context.fillStyle = "red";
        context.beginPath();
        context.arc(cursorX, cursorY, 3, 0, 2 * Math.PI);
        context.fill();
  
        // Draw visited areas on the canvas.
        visitedAreas.forEach((area) => {
          context.fillStyle = "#829383";
          context.beginPath();
          context.arc(area.x, area.y, 3, 0, 2 * Math.PI);
          context.fill();
        });
  
        // Create a data URL for the canvas.
        const dataURL = canvas.toDataURL("image/png");
  
        // Create a link to the data URL for download.
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "updated_image.png";
        a.innerHTML = "Download Image"; // You can also provide a text for the link.
        document.body.appendChild(a);
  
        // Trigger a click event on the link to start the download.
        a.click();
  
        // Remove the link from the document.
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error during canvas operations:", error);
      }
    };
  };
  

  const handleButtonClick = (direction) => {
    // Define the movement for each button.
    let dx = 0;
    let dy = 0;

    switch (direction) {
      case "up":
        dy = -1;
        break;
      case "down":
        dy = 1;
        break;
      case "left":
        dx = -1;
        break;
      case "right":
        dx = 1;
        break;
      default:
        break;
    }

    // Calculate the new cursor position.
    const newCursorX = cursorPosition.x + dx;
    const newCursorY = cursorPosition.y + dy;

    // Track the path.
    const newPath = [...path, { ...cursorPosition }];
    setPath(newPath);

    // Check if the cursor is moving backward and unselect previously visited areas.
    if (isMovingBackward(newPath)) {
      const lastVisitedIndex = visitedAreas.findIndex(
        (area) =>
          area.x === newPath[newPath.length - 1].x &&
          area.y === newPath[newPath.length - 1].y,
      );
      if (lastVisitedIndex >= 0) {
        const updatedVisitedAreas = visitedAreas.slice(0, lastVisitedIndex);
        setVisitedAreas(updatedVisitedAreas);
      }
    } else {
      // Mark the previous area as visited (blue).
      setVisitedAreas([...visitedAreas, { ...cursorPosition }]);
    }

    // Update the cursor's position.
    setCursorPosition({ x: newCursorX, y: newCursorY });
  };

  // Function to check if the cursor is moving backward.
  const isMovingBackward = (newPath) => {
    if (newPath.length < 3) {
      return false;
    }
    const previousPosition = newPath[newPath.length - 2];
    const positionBeforePrevious = newPath[newPath.length - 3];
    return (
      cursorPosition.x === positionBeforePrevious.x &&
      cursorPosition.y === positionBeforePrevious.y
    );
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1541363111435-5c1b7d867904?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pY29ufHx8fGVufDB8fHx8fA%3D%3D"
          alt="Your Image"
          height={200}
          width={200}
        />
        <div
          className="cursor"
          style={{
            position: "absolute",
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
            width: "3px",
            height: "100%",
            backgroundColor: "red",
            borderRadius: "50%",
            zIndex: "500",
          }}
        />
        {visitedAreas.map((area, index) => (
          <div
            className="visited-area"
            key={index}
            style={{
              position: "absolute",
              top: `${area.y}px`,
              left: `${area.x}px`,
              width: "3px",
              height: "100%",
              backgroundColor: "#829383",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
      <div className="button-group">
        <button
          onClick={() => handleButtonClick("up")}
          className="rounded-button"
        >
          Up
        </button>
        <button
          onClick={() => handleButtonClick("down")}
          className="rounded-button"
        >
          Down
        </button>
        <button
          onClick={() => handleButtonClick("left")}
          className="rounded-button"
        >
          Left
        </button>
        <button
          onClick={() => handleButtonClick("right")}
          className="rounded-button"
        >
          Right
        </button>
        <button onClick={handleSave} className="rounded-button">
          Save
        </button>
      </div>
    </div>
  );
}

export default Joystick;
