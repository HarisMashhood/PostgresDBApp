import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from './store/useThemeStore';
function App() {
  const { theme } = useThemeStore();
  console.log(theme);
  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300' data-theme="dark">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  )
}

export default App
