import React from 'react';

const Slider = ({ className, id, label, max, min, name, onChange, value, }) => {
  return (
    <div className={className}>
      <label for={id}>{`${label} - ${value}`}</label>
      <input id={id} name={name} type="range" min={min} max={max} step="0.1" value={value} onChange={onChange}/>
    </div>
  );
};

export default Slider;