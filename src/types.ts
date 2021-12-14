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
