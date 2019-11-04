import React from 'react';

export default function RadioGroup({ name, options, selected, handleChange, theme }) {
  const buttons = options.map((opt) => (
    <label
      className={`radio-group__item ${selected === opt.value ? 'active' : ''}`}
      key={`${name}_${opt.value}`}
    >
      <input
        type="radio"
        name={name}
        value={opt.value}
        autoComplete="off"
        onChange={() => handleChange(opt.value)}
      />
      {opt.title}
    </label>
  ));

  return <div className={`radio-group ${theme || ''}`}>{buttons}</div>;
}