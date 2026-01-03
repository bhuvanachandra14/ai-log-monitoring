import LogDashboard from './components/LogDashboard';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <div className="bg-[#0B1120] min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none translate-y-1/3"></div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none font-display">LogMonitor</h1>
              <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">Log Intelligence Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-slate-400">
              <span className="inline-block w-2 H-2 bg-green-500 rounded-full mr-2"></span>
              System Healthy
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-sm font-medium rounded-lg border border-white/5 transition-colors">
              Documentation
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] pb-10 relative z-10">
        <div className="grid grid-cols-1 gap-6 h-full">
          <LogDashboard />
        </div>
      </main>

      {/* Chat Bot */}
      <ChatAssistant />
    </div>
  );
}

export default App;
