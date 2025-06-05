export default function HeaderBar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div>Dashboard</div>
      <div className="flex items-center gap-4">
        <button className="text-sm text-blue-600 font-medium">Invite Team</button>
        <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">A</div>
      </div>
    </div>
  );
}
