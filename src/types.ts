import { ChangeEvent, InputHTMLAttributes } from 'react'

export interface FileStateType {
  pdf: FileList | null
  numPages: number
  byteSize: number
  width: number
  height: number
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

export interface ToolMenuProps {
  children: JSX.Element
}

export interface ButtonProps {
  text?: string
  children?: JSX.Element
}

export interface WarningProps {
  text: string
}

export interface ErrorProps {
  text: string
}
