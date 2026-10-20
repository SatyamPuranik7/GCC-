import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Plan from './pages/Plan'
import Recommendations from './pages/Recommendations'
import Compare from './pages/Compare'
import LocationDetail from './pages/LocationDetail'
import Sources from './pages/Sources'
import AskAtlas from './pages/AskAtlas'
import CostScenario from './pages/CostScenario'
import Deck from './pages/Deck'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="deck" element={<Deck />} />
        <Route path="plan" element={<Plan />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="compare" element={<Compare />} />
        <Route path="location/:slug" element={<LocationDetail />} />
        <Route path="sources" element={<Sources />} />
        <Route path="ask" element={<AskAtlas />} />
        <Route path="cost-scenario" element={<CostScenario />} />
      </Route>
    </Routes>
  )
}
