import styles from './Note.module.css';

interface props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: 'info';
}

export default function Button({children, variant = "info"}: props) {
  return <div className={`${styles.note} ${variant}`}>{children}</div>;
}