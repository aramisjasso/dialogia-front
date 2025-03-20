import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppDialogia from './AppDialogia.jsx'
import './share/css/Dialogia.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppDialogia />
  </StrictMode>,
)
