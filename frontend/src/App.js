import './App.css';
import Reviews from './components/Reviews';
import MyNavbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <MyNavbar />
      <h1>Niche Item Reviews</h1>
      <Reviews />
    </div>
  );
}

export default App;
