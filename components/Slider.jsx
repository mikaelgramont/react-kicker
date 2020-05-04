import React from 'react';

const Slider = ({ className, id, label, max, min, name, onChange, step, value, }) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{`${label}: ${value}`}</label>
      <input id={id} name={name} type="range" min={min} max={max} step={step} value={value} onChange={onChange}/>
    </div>
  );
};

export default Slider;