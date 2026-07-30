import React from 'react'
import './custom.css'

const CustomStyles: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export default CustomStyles