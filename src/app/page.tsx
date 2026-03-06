import Link from "next/link";

export default function SaaSPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">SportsEvents</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link>
          <Link href="#demo" className="hover:text-black transition-colors">Demo</Link>
          <Link 
            href="https://wa.me/584120000000" 
            className="bg-black text-white px-5 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium mb-10 text-gray-600 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Launching the Future of Sports Events
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter text-gray-900 leading-tight">
            Launch Your Sports Event <br />
            <span className="text-gray-400">in Minutes, Not Days.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-500 leading-relaxed font-light">
            High-performance, branded landing pages for sports clubs, marathons, and tournaments. 
            Focus on the race, we'll handle the digital presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="https://wa.me/584120000000"
              className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              Start My Event
            </Link>
            <Link 
              href="http://santarosa.localhost:3000"
              target="_blank"
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2"
            >
              View Demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="bg-gray-50 py-32 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Everything You Need</h2>
              <p className="text-gray-500 text-lg">Simple. Professional. Effective.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Branded Subdomains</h3>
                <p className="text-gray-500 leading-relaxed">Give your event a clear identity with its own subdomain: marathon.pricedineth.xyz</p>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Fast Setup</h3>
                <p className="text-gray-500 leading-relaxed">No coding required. Just provide your logo and event details, and your page is live in 5 minutes.</p>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Optimized Conversions</h3>
                <p className="text-gray-500 leading-relaxed">Designed based on proven athletic landing page patterns to maximize registrations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-black rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#333,_transparent)] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">Ready to Scale Your Event?</h2>
              <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-2xl mx-auto">
                Join our pilot program today and get your first event landing page for free.
              </p>
              <Link 
                href="https://wa.me/584120000000"
                className="inline-block bg-white text-black px-12 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">SportsEvents</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SportsEvents Platform. Built for excellence.
          </p>
          <div className="flex gap-8 text-gray-400 text-sm font-medium">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
