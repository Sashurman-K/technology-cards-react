
import './Settings.css'
import { useState } from 'react';

const Settings = () => {
  const [selectedColor, setSelectedColor] = useState('#667eea');

  const presetColors = [
    '#667eea', '#764ba2', '#f56565', '#ed8936',
    '#38a169', '#4299e1', '#9f7aea', '#e53e3e'
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    document.body.style.backgroundColor = color;
  };

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    document.body.style.backgroundColor = color;}

  return (
    <div>
        <h1>Настройки</h1>
    <div className="color-picker">
      <h4>Выберите цвет фона</h4>

      <div className="color-preview" style={{ backgroundColor: selectedColor }}>
        {selectedColor}
      </div>

      <div className="color-palette">
        {presetColors.map((color) => (
          <button
            key={color}
            className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            title={color}
          />
        ))}
      </div>

      <div className="custom-color">
        <label>Или выберите свой:</label>
        <input
          type="color"
          value={selectedColor}
          onChange={handleCustomColor}
        />
        <span className="color-value">{selectedColor}</span>
      </div>
    </div>
        </div>
  );
};



export default Settings;