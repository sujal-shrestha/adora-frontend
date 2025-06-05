import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>Fallback route works</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
