import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Fragment, MouseEvent } from 'react'
import styles from './Dropdown.module.css';

type DropdownProps = {
  selected: string | number
  onChange?: (value: string, e: MouseEvent) => void
  options: {
    [key: string]: string | number
  },
  disabled?: boolean
}

const ArrowDownIcon = () => {
  return (<svg width="24" height="24" className="ArrowDownIcon" fill="none" viewBox="0 0 24 24">
    <path fill="var(--figma-color-icon)" fillRule="evenodd" d="M9.646 11.146a.5.5 0 0 1 .708 0L12 12.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708" clipRule="evenodd"></path>
    </svg>)
}

const CheckIcon = () => {
  return (<svg className="CheckIcon" width="16" height="16" viewBox="0 0 16 16"><path fill="#ffffffe5" fillRule="nonzero" stroke="none" d="M13.207 5.207 7 11.414 3.292 7.707l1.415-1.414L7 8.586l4.793-4.793z"></path></svg>)
}

export const Dropdown = ({ selected, onChange = () => {}, options, disabled }: DropdownProps) => {
  const onChangeHandler = (event: MouseEvent) => {
    const selectedItem = event.target as HTMLElement
    const value = selectedItem.dataset.key!
    onChange(value, event)
  }

  return (
    <Menu>
      <MenuButton as={Fragment} disabled={disabled}>
      <button className={styles.dropdown__button}>{options[selected]}<ArrowDownIcon /></button>
      </MenuButton>
      <MenuItems anchor="top" className={styles.dropdown__list} onClick={(event) => onChangeHandler(event)}>
      {options && Object.entries(options).map(([key, value]) => {
        return <MenuItem key={key}>
          <button className={styles.dropdown__list_item} data-key={key}>{key === selected && <CheckIcon />}{value}</button>
        </MenuItem>
      })}
      </MenuItems>
    </Menu>)
}