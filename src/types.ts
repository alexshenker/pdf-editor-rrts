import { ChangeEvent, InputHTMLAttributes, RefObject } from 'react'

export interface FileStateType {
  pdf: File | null
  numPages: number
  byteSize: number
  width: number
  height: number
  wByHRatio: number | null
}

export interface ToolBtnProps {
  handleClick(): void
  description: string
  children: JSX.Element
}

export interface ToolInputProps {
  handleChange(e?: ChangeEvent<HTMLInputElement>): void
  value: string | number | readonly string[] | undefined
  suffix: string
  inputType: string
}

export interface InputProps {
  handleChange(...args: any[]): void
  value: string | number | readonly string[] | undefined
  inputType: string
  labelFor?: string
  labelText?: string
  suffix?: string | null
  placeholder?: string
  inputWidth?: string
}

export interface RadioInputProps {
  handleChange(...args: any[]): void
  labelFor: string
  labelText?: string
  checked: boolean
  name: string
}

export interface ToolMenuProps {
  children: JSX.Element
}

export interface ButtonProps {
  handleClick(): void
  text?: string
  children?: JSX.Element
}

export type DivRef = RefObject<HTMLDivElement>

export interface ModalProps {
  open: boolean
  handleClose(): void
  titleElement?: JSX.Element
  titleText?: string
  children?: JSX.Element
  modalRef?: DivRef
}
