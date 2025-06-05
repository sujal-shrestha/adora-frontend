import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <HeaderBar />
        <div className="p-6 bg-gray-50 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
