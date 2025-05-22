import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { TonConnectButton } from '@tonconnect/ui-react'
import JettonMinter from './components/JettonMinter'
import './styles/App.css'
import './styles/JettonMinter.css'

export const App: FC = () => {
  return (
    <Router>
      <div className='app'>
        <nav className='app-nav'>
          <div className='nav-content'>
            <div className='nav-brand'>
              <div className='nav-logo'>
                ⚡ Tact Minter
              </div>
            </div>
            <div className='nav-links'>
              <TonConnectButton />
            </div>
          </div>
        </nav>
        <Routes>
          <Route
            path='/'
            element={
              <div className='home'>
                <h1>Deploy Your Jetton</h1>
                <p>
                  Create and deploy your own Jetton token on TON blockchain with our easy-to-use
                  interface.
                </p>
                <div className='cta-container'>
                  <Link
                    to='/minter'
                    className='nav-link'
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            }
          />
          <Route
            path='/minter'
            element={<JettonMinter />}
          />
        </Routes>
      </div>
    </Router>
  )
}
