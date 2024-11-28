import React from 'react';
import styles from './Input.module.css';

interface props extends React.HTMLAttributes<HTMLInputElement> {
  suffix?: string;
  value?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({onChange, suffix, value, placeholder, className}: props) {
  const [hasFocus, setHasFocus] = React.useState(false);
  const inputFieldRef = React.useRef(null);

  return <div className={`${styles.input} ${className} ${hasFocus && 'hasFocus'}`}>
    <input ref={inputFieldRef} onFocus={() => setHasFocus(true)} onBlur={() => setHasFocus(false)} className={styles.input__input} onChange={onChange} value={value} placeholder={placeholder} />
    {suffix && <span className={styles.input__suffix} onClick={() => inputFieldRef.current.focus()}>{suffix}</span>}
    </div>
}