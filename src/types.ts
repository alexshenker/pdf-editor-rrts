import { ChangeEvent, InputHTMLAttributes } from 'react'

export interface FileStateType {
  pdf: FileList | null
  numPages: number
  width: number
  height: number
}

export interface ToolBtnProps {
  handleClick(): void
  text: string
  children: JSX.Element
}

export interface ToolInputProps {
  handleChange(e?: ChangeEvent<HTMLInputElement>): void
  value: string | number | readonly string[] | undefined
  suffix: string
  inputType: string
}
