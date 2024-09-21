
import './App.css';
import Main from './component/main';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main/>} />
        </Routes>


      </BrowserRouter>

    </div>
  );
}

export default App;
