import styles from './Button.module.css';

interface props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary';
}

export default function Button({children, variant = "primary", onClick}: props) {
  return <button className={`${styles.button} ${variant}`} onClick={onClick}>{children}</button>;
}