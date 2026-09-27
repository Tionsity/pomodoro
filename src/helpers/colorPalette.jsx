export function colorPalette(setChosenColor) {
  let colorArray = [
    "white",
    "blue",
    "red",
    "yellow",
    "green",
    "purple",
    "orange",
    "gray",
    "black",
  ];

  let colorChoise = "";
  return (
    <div id="colorDisplay">
      {colorArray.map((color) => (
        <div
          key={color}
          className="color"
          id={color}
          style={{ backgroundColor: `${color}` }}
          onClick={() => {
            setChosenColor(color);
            let i = 0;
            do {
              document.getElementsByClassName("color")[i].style.borderWidth =
                "2px";
              i++;
            } while (i < colorArray.length);
            document.getElementById(color).style.borderWidth = "4px";
          }}></div>
      ))}
    </div>
  );
}
