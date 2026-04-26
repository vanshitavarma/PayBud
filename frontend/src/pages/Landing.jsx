import { Link } from 'react-router-dom';
import { Button, Card, Badge, Avatar } from '@/components';
import { formatCurrency } from '@/utils';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface font-sans overflow-x-hidden selection:bg-primary-100 selection:text-primary-700">
      
      {/* Navigation */}
      <header className="px-6 py-5 sm:px-12 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-surface/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-[20px] shadow-lg shadow-primary-200 transition-transform group-hover:scale-110">
            B
          </div>
          <span className="text-[22px] font-bold text-gray-900 tracking-tight">PayBud</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-8">
          <Link to="/login" className="text-[15px] font-semibold text-gray-600 hover:text-primary-600 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link to="/register">
            <Button className="rounded-full px-6 py-2.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto">
        
        {/* Animated Hero Section */}
        <section className="px-6 sm:px-12 pt-12 pb-20 sm:pt-24 sm:pb-32 flex flex-col lg:flex-row gap-16 lg:gap-12 items-center justify-between relative">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-primary-100/50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl opacity-30" />

          {/* Left: Copy */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-[13px] font-semibold text-primary-700 tracking-wide uppercase">New: Smart UPI Detection</span>
            </div>
            
            <h1 className="text-[44px] sm:text-[56px] lg:text-[72px] font-extrabold text-gray-900 leading-[0.95] tracking-tight mb-8">
              Split bills, <br />
              <span className="text-primary-600 relative inline-block">
                Stay buddies.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.5 2.33333 239.5 2.33333 355 9" stroke="#0066FF" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-[18px] sm:text-[21px] text-gray-600 leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0">
              The simplest way to track shared expenses, monthly bills, and group adventures. No spreadsheeting required.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary-200 hover:-translate-y-1 transition-all">
                  Get Started for Free
                </Button>
              </Link>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-gray-100 flex items-center justify-center text-[12px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="pl-4 text-[14px] font-medium text-gray-500 flex items-center">
                  Trusted by 10k+ friends
                </div>
              </div>
            </div>
          </div>

          {/* Right: Modern Key Benefits Section */}
          <div className="flex-1 w-full max-w-lg lg:pl-10">
            <div className="space-y-6">
              {[
                {
                  title: "Smart Groups",
                  desc: "Create groups for trips, roommates, or events and track every penny.",
                  icon: "👥",
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  title: "UPI Ready",
                  desc: "Settle debts instantly. No more sharing bank details manually.",
                  icon: "📲",
                  color: "bg-purple-50 text-purple-600"
                },
                {
                  title: "Debt Simplification",
                  desc: "We calculate the math to minimize the number of payments needed.",
                  icon: "⚖️",
                  color: "bg-green-50 text-green-600"
                },
                {
                  title: "Real-time Sync",
                  desc: "Everyone in the group sees updates immediately on their own devices.",
                  icon: "🔄",
                  color: "bg-orange-50 text-orange-600"
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="px-6 sm:px-12 py-24 border-t border-gray-100">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Smart Splitting", desc: "Split equally, by percentage, or exact shares. We handle the math.", icon: "📊" },
              { title: "One-Tap Settle", desc: "Integration with major UPI apps for instant debt clearance.", icon: "⚡" },
              { title: "Live Activity", desc: "Get real-time updates when expenses are added or settled.", icon: "�" }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-[2rem] hover:bg-gray-50 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-white">B</div>
              <span className="text-xl font-bold">PayBud</span>
            </div>
            <p className="text-gray-400 max-w-sm">Making group finances stress-free and simple.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <span className="font-bold">Product</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold">Company</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

