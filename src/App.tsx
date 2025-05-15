import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { TonConnectButton } from '@tonconnect/ui-react'
import JettonMinter from './components/JettonMinter'
import './styles/App.css'
import './styles/JettonMinter.css'

export const App: FC = () => {
  return (
    <Router>
      <div className="app">
        <nav className="app-nav">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              ⚡ Tact Minter
            </Link>
            <div className="nav-links">
              <Link to="/minter" className="nav-link">
                Create Jetton
              </Link>
              <TonConnectButton />
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home">
              <h1>⚡ Welcome to Tact Minter</h1>
              <p>Create and deploy your Jetton smart contracts on TON blockchain using Tact language</p>
              <div className="cta-container">
                <Link to="/minter" className="cta-button">
                  Deploy New Jetton
                </Link>
                <a 
                  href="https://docs.tact-lang.org/cookbook/fungible-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="docs-link"
                >
                  Read Tact Docs
                </a>
              </div>
            </div>
          } />
          <Route path="/minter" element={<JettonMinter />} />
        </Routes>
      </div>
    </Router>
  )
}
