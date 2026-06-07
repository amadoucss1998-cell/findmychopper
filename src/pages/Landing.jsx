import { Link } from 'react-router-dom';
import { Bike, MapPin, Shield, Star, Clock, Phone, ChevronRight, Zap, Users, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-xl p-1.5"><Bike className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-gray-900 text-lg">FindMyChopper</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5">Sign In</Link>
            <Link to="/auth/login?role=admin" className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 font-medium">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" /> Now available in Monrovia, Liberia
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">Your ride,<br />one tap away</h1>
            <p className="text-xl text-orange-100 mb-10 max-w-xl leading-relaxed">
              FindMyChopper connects you with trusted motorcycle riders across Liberia. Fast, affordable, and safe.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth/login" className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 flex items-center gap-2 shadow-lg">
                Book a Ride <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/auth/login?role=rider" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10">
                Become a Rider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why FindMyChopper?</h2>
          <p className="text-gray-500 text-lg">Built for Liberia, designed for everyone</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Zap,     color: 'bg-orange-50 text-orange-500', title: 'Fast Matching',    desc: 'Get matched with a nearby rider in under 2 minutes.' },
            { icon: Shield,  color: 'bg-blue-50 text-blue-500',     title: 'Verified Riders',  desc: 'Every rider is ID-verified and licensed. Your safety matters.' },
            { icon: MapPin,  color: 'bg-green-50 text-green-500',   title: 'Real-Time Tracking',desc: 'See your rider\'s location and ETA from the moment they accept.' },
            { icon: Star,    color: 'bg-yellow-50 text-yellow-500', title: 'Rate Every Ride',  desc: 'Rate your experience and help build a trusted community.' },
            { icon: Clock,   color: 'bg-purple-50 text-purple-500', title: 'Available 24/7',   desc: 'Our riders are available morning to night across Monrovia.' },
            { icon: Phone,   color: 'bg-red-50 text-red-500',       title: 'SOS Safety',       desc: 'One tap shares your location with emergency contacts.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}><Icon className="w-6 h-6" /></div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How it works</h2>
              <p className="text-gray-500 mb-10">Book your chopper in 3 simple steps</p>
              <div className="space-y-8">
                {[
                  { n:'1', title:'Enter your destination', desc:'Type where you\'re going and confirm your pickup on the map.' },
                  { n:'2', title:'Get matched instantly',   desc:'We find the nearest available rider and show you the fare.' },
                  { n:'3', title:'Ride & pay cash',         desc:'Your rider arrives, you ride, and pay with cash on arrival.' },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="flex gap-4">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{n}</div>
                    <div><h4 className="font-semibold text-gray-900 mb-1">{title}</h4><p className="text-gray-500 text-sm">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-10 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-72">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><Bike className="w-5 h-5 text-orange-500" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">James K.</p>
                    <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs text-gray-500">4.8 · Honda CB150</span></div>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">3 min</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-500">Sinkor, Monrovia</span></div>
                  <div className="w-px h-5 bg-gray-200 ml-1"></div>
                  <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><span className="text-gray-500">Waterside Market</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Fare estimate</span>
                  <span className="font-bold text-gray-900">$2.30</span>
                </div>
                <div className="w-full mt-4 bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm text-center">Confirm Ride</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rider CTA */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold mb-4">Earn on your schedule</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">Join riders already earning with FindMyChopper. Keep 80% of every fare.</p>
          <Link to="/auth/login?role=rider" className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-orange-600 shadow-lg">
            Start Earning Today <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-xl p-1.5"><Bike className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-gray-900">FindMyChopper</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 FindMyChopper · Made for Liberia 🇱🇷</p>
        </div>
      </footer>
    </div>
  );
}
