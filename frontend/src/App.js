import './App.css';
import { Navbar, Footer } from './components'
import { Home, EventProfile, Item, Create, CreateEvent, ImportSBT, Login, Register } from './pages'
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path=":item/:id" element={<Item />} />
        <Route path="/create" element={<Create />} />
        <Route path="/createEvent" element={<CreateEvent />} />
        <Route path="/eventProfile/:id" element={<EventProfile />} />
        <Route path="/importSBT" element={<ImportSBT />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
