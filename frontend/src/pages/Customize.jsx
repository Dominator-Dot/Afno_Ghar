import { useState } from "react";

function Customize() {
  const [material, setMaterial] = useState("Sal Wood");
  const [color, setColor] = useState("Natural Brown");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [instructions, setInstructions] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  const customization = {
    id: Date.now(),
    productId: 5,
    productName: "Wooden Chair",
    basePrice: 7500,
    material,
    color,
    length,
    width,
    height,
    instructions,
    quantity: 1,
  };

  const oldCart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  oldCart.push(customization);

  localStorage.setItem(
    "cart",
    JSON.stringify(oldCart)
  );

  alert("Customized furniture added to cart!");
};

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>Customize Wooden Chair</h1>

      <p>
        <strong>Base Price:</strong> Rs. 7,500
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Material</label>
          <br />

          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option>Sal Wood</option>
            <option>Sisau Wood</option>
            <option>Plywood</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Color</label>
          <br />

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option>Natural Brown</option>
            <option>Dark Walnut</option>
            <option>Black</option>
            <option>White</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Length (cm)</label>
          <br />

          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Example: 120"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Width (cm)</label>
          <br />

          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Example: 60"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Height (cm)</label>
          <br />

          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Example: 90"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Special Instructions</label>
          <br />

          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Example: Make the armrest wider"
            rows="4"
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">
          Save Customization
        </button>
      </form>
    </div>
  );
}

export default Customize;