import './style/main.css'
import { BrowserRouter as MainRouter } from 'react-router-dom'
import { AppRoutes } from './routes/routes'

function App() {

  return (
    <>
      <MainRouter>
        <div className="container">
          <AppRoutes />
        </div>
      </MainRouter>
    </>
  )
}

export default App
