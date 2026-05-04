import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Map, ArrowLeft, RefreshCw, Crosshair, Users, MapPin, Activity, Play, Square, Lock, Unlock, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserLocations, UserLocation, trackLocation } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { LiveText } from "@/components/ui/live-text";

// Coordinates for Makassar (center)
const CENTER_LAT = -5.147665;
const CENTER_LNG = 119.432731;

export default function AdminTracking() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [simulationActive, setSimulationActive] = useState(true);
  
  // Security Overlay State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "999999") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const fetchLocations = () => {
    setLocations(getUserLocations());
  };

  useEffect(() => {
    fetchLocations();
    // Auto refresh every 2 seconds for live smooth tracking
    const interval = setInterval(fetchLocations, 2000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Driving Simulation Logic
  const velocitiesRef = useRef<Record<string, { lat: number, lng: number }>>({});

  useEffect(() => {
    if (!simulationActive) return;

    // The 3 targets we want to simulate driving continuously
    const drivingTargets = ["Tim Alpha (Resmob)", "Tim Bravo (Jatanras)", "Aipda Rahmat"];

    // Initialize random initial driving directions (velocities)
    drivingTargets.forEach(target => {
      if (!velocitiesRef.current[target]) {
        velocitiesRef.current[target] = {
          lat: (Math.random() > 0.5 ? 1 : -1) * (0.0003 + Math.random() * 0.0004),
          lng: (Math.random() > 0.5 ? 1 : -1) * (0.0003 + Math.random() * 0.0004)
        };
      }
    });

    const interval = setInterval(() => {
      const currentLocs = getUserLocations();
      currentLocs.forEach(loc => {
        if (drivingTargets.includes(loc.user)) {
          // Driving Vehicles
          let v = velocitiesRef.current[loc.user];
          
          // 15% chance to "turn" at an intersection (change direction)
          if (Math.random() < 0.15) {
            v = {
              lat: (Math.random() > 0.5 ? 1 : -1) * (0.0003 + Math.random() * 0.0004),
              lng: (Math.random() > 0.5 ? 1 : -1) * (0.0003 + Math.random() * 0.0004)
            };
            velocitiesRef.current[loc.user] = v;
          }

          let newLat = loc.lat + v.lat;
          let newLng = loc.lng + v.lng;

          // Bounce off the Makassar expanded bounding box to keep them on map
          if (newLat > -5.00 || newLat < -5.30) { v.lat *= -1; newLat = loc.lat + v.lat; }
          if (newLng > 119.65 || newLng < 119.20) { v.lng *= -1; newLng = loc.lng + v.lng; }

          // Generate dynamic speed based on velocity magnitude
          const speed = Math.floor(Math.sqrt(v.lat*v.lat + v.lng*v.lng) * 100000) + " km/h";

          trackLocation(loc.user, loc.role, newLat, newLng, "Patroli Bergerak Aktif", loc.area, speed, loc.device);
        } else if (loc.id.startsWith("loc-")) {
          // Idle Users (Citizens / Standing still)
          const latStep = (Math.random() - 0.5) * 0.00005; // tiny jitter (GPS inaccuracy)
          const lngStep = (Math.random() - 0.5) * 0.00005;
          trackLocation(loc.user, loc.role, loc.lat + latStep, loc.lng + lngStep, loc.action, loc.area, loc.speed, loc.device);
        }
      });
    }, 2000); // Drives every 2 seconds
    return () => clearInterval(interval);
  }, [simulationActive]);

  // Convert lat/lng to percentage positions matching the OSM bounding box
  const getPosition = (lat: number, lng: number) => {
    // EXPANDED OSM Bounding Box for Full Makassar Region
    const minLng = 119.20;
    const maxLng = 119.65;
    const minLat = -5.30;
    const maxLat = -5.00;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100; // Invert because web Y goes down
    
    return {
      left: `${Math.max(1, Math.min(99, x))}%`,
      top: `${Math.max(1, Math.min(99, y))}%`
    };
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-[#02050A] text-white overflow-hidden relative">
      
      {/* Security PIN Overlay */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, scale: 1.1, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#02050A]/80 p-6"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="surface-glass p-8 rounded-[2.5rem] border border-emerald-500/30 w-full max-w-sm text-center shadow-[0_0_100px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
              
              <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
                {pinError ? <ShieldAlert className="w-10 h-10 text-red-500" /> : <Lock className="w-10 h-10 text-emerald-400" />}
              </div>
              
              <h2 className="text-xl font-bold uppercase tracking-widest mb-2 text-white">OTORISASI RADAR</h2>
              <p className="text-emerald-400/70 text-xs tracking-wider mb-8 uppercase font-mono">Masukan Kode Akses 6 Digit</p>

              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div className="relative">
                  <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="• • • • • •"
                    className={`w-full bg-[#02050A]/50 border ${pinError ? 'border-red-500/50 text-red-500 focus:border-red-500' : 'border-emerald-500/30 text-emerald-400 focus:border-emerald-500'} rounded-2xl px-6 py-4 text-center text-2xl font-mono tracking-[1em] outline-none transition-colors placeholder:text-white/20`}
                    autoFocus
                  />
                  {pinError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs font-mono"
                    >
                      AKSES DITOLAK
                    </motion.p>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={pin.length < 6}
                  className="w-full bg-emerald-500 text-[#02050A] font-bold py-4 rounded-2xl uppercase tracking-widest text-sm hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Buka Enkripsi
                </button>
                <Link to="/admin" className="block text-white/30 hover:text-white/60 text-xs uppercase tracking-widest mt-6 transition-colors">
                  Batalkan
                </Link>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02050A]/80 to-[#02050A]" />
      </div>

      <header
        className="px-6 pb-4 relative z-10 flex items-center justify-between"
        style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top, 0px) + 1rem))" }}
      >
        <Link to="/admin" aria-label="Kembali">
          <span className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Link>
        <div className="text-center">
          <p className="eyebrow text-emerald-500/80 tracking-widest"><LiveText as="span" id="admin-track-label" defaultText="LIVE TRACKING" /></p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mt-0.5 text-white flex items-center justify-center gap-1">
            <LiveText as="span" id="admin-track-title" defaultText="Radar Operasional" />
            {simulationActive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />}
          </p>
        </div>
        <button 
          onClick={() => setSimulationActive(!simulationActive)} 
          className={`w-11 h-11 surface-glass rounded-2xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-105 ${simulationActive ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/50" : "text-primary hover:bg-primary/20"}`}
          title="Toggle Simulasi Bergerak"
        >
          {simulationActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </header>

      <div className="flex-1 flex flex-col px-6 relative z-10 space-y-6">
        
        {/* Statistics Row */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="surface-glass rounded-[1.5rem] p-4 border border-white/5 flex flex-col">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Users className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Aktivitas</span>
            </div>
            <p className="text-3xl font-light font-mono">{locations.length}</p>
          </div>
          <div className="surface-glass rounded-[1.5rem] p-4 border border-white/5 flex flex-col">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Status</span>
            </div>
            <p className="text-sm font-bold text-emerald-400 mt-2">ONLINE</p>
          </div>
        </div>

        {/* Map Container */}
        <div ref={mapRef} className="relative w-full aspect-square rounded-[2.5rem] surface-glass border border-emerald-500/20 overflow-hidden bg-[#02050A] shadow-[0_0_80px_rgba(16,185,129,0.15)] group">
          
          {/* Draggable Map Layer */}
          <motion.div 
            drag
            dragConstraints={mapRef}
            dragElastic={0.05}
            whileDrag={{ scale: 1.01 }}
            className="absolute inset-0 w-[300%] h-[300%] left-[-100%] top-[-100%] cursor-grab active:cursor-grabbing"
          >
            {/* Real Map Background of Makassar */}
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=119.20,-5.30,119.65,-5.00&layer=mapnik" 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen transition-opacity duration-1000"
              style={{ filter: 'invert(1) hue-rotate(160deg) saturate(3) brightness(0.9) contrast(1.5)' }}
              title="Makassar Tactical Map"
              loading="lazy"
            />

            {/* Location Markers */}
            {locations.map((loc) => {
              const pos = getPosition(loc.lat, loc.lng);
              const isPolri = loc.role === 'polri' || loc.role === 'admin';
              return (
                <motion.div
                  key={loc.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={pos}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(loc);
                  }}
                  whileHover={{ scale: 1.5 }}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${isPolri ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`}>
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${isPolri ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                    <MapPin className={`w-4 h-4 ${isPolri ? 'text-blue-400' : 'text-emerald-400'}`} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scanning Radar Animation (Fixed Overlay) */}
          <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-[2.5rem] mix-blend-screen pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(16,185,129,0.15) 100%)', animation: 'spin 4s linear infinite' }} />
          <div className="absolute left-1/2 top-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 border border-emerald-500/20 rounded-full pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 w-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2 border border-emerald-500/20 rounded-full pointer-events-none" />
          
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/30 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/30 pointer-events-none" />

          {/* Crosshair Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500/50 pointer-events-none">
            <Crosshair className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Selected User Details */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="surface-glass rounded-[2rem] p-5 border border-primary/30 relative"
            >
              <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                &times;
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedUser.role === 'polri' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight">{selectedUser.user}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{selectedUser.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {selectedUser.area && (
                  <div className="bg-white/5 p-3 rounded-xl col-span-2">
                    <p className="text-white/50 mb-1 font-mono text-[9px]">LOKASI / AREA</p>
                    <p className="font-bold text-emerald-400">{selectedUser.area}</p>
                  </div>
                )}
                <div className="bg-white/5 p-3 rounded-xl">
                  <p className="text-white/50 mb-1 font-mono text-[9px]">LATITUDE</p>
                  <p className="font-mono text-white/90">{selectedUser.lat.toFixed(6)}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <p className="text-white/50 mb-1 font-mono text-[9px]">LONGITUDE</p>
                  <p className="font-mono text-white/90">{selectedUser.lng.toFixed(6)}</p>
                </div>
                {selectedUser.speed && (
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-white/50 mb-1 font-mono text-[9px]">KECEPATAN</p>
                    <p className="font-mono text-primary font-bold">{selectedUser.speed}</p>
                  </div>
                )}
                {selectedUser.device && (
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-white/50 mb-1 font-mono text-[9px]">PERANGKAT</p>
                    <p className="font-mono">{selectedUser.device}</p>
                  </div>
                )}
                <div className="bg-white/5 p-3 rounded-xl col-span-2">
                  <p className="text-white/50 mb-1 font-mono text-[9px]">AKSI TERAKHIR</p>
                  <p className="font-medium">{selectedUser.action}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl col-span-2 flex justify-between items-center">
                  <div>
                    <p className="text-white/50 mb-1 font-mono text-[9px]">PEMBARUAN TERAKHIR</p>
                    <p>{new Date(selectedUser.timestamp).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {locations.length === 0 && (
          <div className="text-center p-6 text-white/50">
            <p className="text-sm">Belum ada aktivitas lokasi terekam.</p>
          </div>
        )}

      </div>
    </div>
  );
}
