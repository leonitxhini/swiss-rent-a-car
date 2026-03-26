import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car as CarType, useGetCars, useSubmitContact } from "@workspace/api-client-react";
import { Button, Input, Card, Label, cn } from "@/components/ui-core";
import { BookingModal } from "@/components/BookingModal";
import { 
  ShieldCheck, Star, MapPin, Calendar, Clock, ArrowRight,
  Menu, X, CarFront, CheckCircle2, ChevronDown, Facebook, Instagram, Twitter,
  Phone, Mail, Users
} from "lucide-react";
import { useForm } from "react-hook-form";

const FALLBACK_CARS: CarType[] = [
  { id: 1, name: "VW Golf", brand: "Volkswagen", model: "Golf", year: 2024, category: "economy", pricePerDay: 35, seats: 5, transmission: "manual", fuelType: "petrol", imageUrl: "/images/cars/vw-golf.jpg", available: true, licensePlate: "ZH-1001", color: "Silver", mileage: 5000, description: null },
  { id: 2, name: "Toyota Yaris", brand: "Toyota", model: "Yaris GR", year: 2024, category: "economy", pricePerDay: 40, seats: 5, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/toyota-yaris.jpg", available: true, licensePlate: "ZH-1002", color: "Red", mileage: 3000, description: null },
  { id: 3, name: "BMW 3 Series", brand: "BMW", model: "330i", year: 2024, category: "standard", pricePerDay: 75, seats: 5, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/bmw-3series.jpg", available: true, licensePlate: "ZH-1003", color: "White", mileage: 8000, description: null },
  { id: 4, name: "Mercedes C-Class", brand: "Mercedes", model: "C 300", year: 2024, category: "standard", pricePerDay: 90, seats: 5, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/mercedes-c.jpg", available: true, licensePlate: "ZH-1004", color: "Black", mileage: 6000, description: null },
  { id: 5, name: "BMW X5", brand: "BMW", model: "X5 40i", year: 2024, category: "suv", pricePerDay: 120, seats: 7, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/bmw-x5.jpg", available: true, licensePlate: "ZH-1005", color: "Grey", mileage: 10000, description: null },
  { id: 6, name: "Porsche Cayenne", brand: "Porsche", model: "Cayenne S", year: 2024, category: "suv", pricePerDay: 180, seats: 5, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/porsche-cayenne.jpg", available: true, licensePlate: "ZH-1006", color: "White", mileage: 4000, description: null },
  { id: 7, name: "Mercedes S-Class", brand: "Mercedes", model: "S 580", year: 2024, category: "luxury", pricePerDay: 250, seats: 5, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/mercedes-s.jpg", available: true, licensePlate: "ZH-1007", color: "Black", mileage: 3000, description: null },
  { id: 8, name: "Rolls-Royce Ghost", brand: "Rolls-Royce", model: "Ghost", year: 2024, category: "luxury", pricePerDay: 500, seats: 5, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/rolls-royce.jpg", available: true, licensePlate: "ZH-1008", color: "Silver", mileage: 2000, description: null },
  { id: 9, name: "Tesla Model 3", brand: "Tesla", model: "Model 3", year: 2024, category: "standard", pricePerDay: 80, seats: 5, transmission: "automatic", fuelType: "electric", imageUrl: "/images/cars/tesla-model3.jpg", available: true, licensePlate: "ZH-1009", color: "Silver", mileage: 7000, description: null },
  { id: 10, name: "Audi Q7", brand: "Audi", model: "Q7 55 TFSI", year: 2024, category: "suv", pricePerDay: 150, seats: 7, transmission: "automatic", fuelType: "petrol", imageUrl: "/images/cars/audi-q7.jpg", available: true, licensePlate: "ZH-1010", color: "White", mileage: 9000, description: null },
  { id: 11, name: "VW Transporter", brand: "Volkswagen", model: "Transporter T6", year: 2024, category: "van", pricePerDay: 95, seats: 9, transmission: "manual", fuelType: "diesel", imageUrl: "/images/cars/vw-transporter.jpg", available: true, licensePlate: "ZH-1011", color: "Silver", mileage: 15000, description: null },
  { id: 12, name: "SEAT Ibiza", brand: "SEAT", model: "Ibiza FR", year: 2024, category: "economy", pricePerDay: 32, seats: 5, transmission: "manual", fuelType: "petrol", imageUrl: "/images/cars/seat-ibiza.jpg", available: true, licensePlate: "ZH-1012", color: "Red", mileage: 4000, description: null },
];

export function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: apiCars, isLoading: isLoadingCars } = useGetCars({ 
    available: true 
  });

  const cars = (apiCars && apiCars.length > 0) ? apiCars : FALLBACK_CARS;

  const filteredCars = activeCategory === "all" 
    ? cars 
    : cars.filter(c => c.category === activeCategory);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAVIGATION */}
      <nav className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-sm py-3" : "bg-transparent py-5"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl">S</div>
            <div className="flex flex-col">
              <span className={cn("text-xl font-bold leading-none", isScrolled ? "text-foreground" : "text-white")}>SWISS</span>
              <span className={cn("text-[0.6rem] font-bold tracking-widest uppercase leading-none", isScrolled ? "text-primary" : "text-white/80")}>Rent a Car</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('hero')} className={cn("font-medium hover:text-primary transition-colors", isScrolled ? "text-foreground" : "text-white/90")}>Ballina</button>
            <button onClick={() => scrollTo('veturat')} className={cn("font-medium hover:text-primary transition-colors", isScrolled ? "text-foreground" : "text-white/90")}>Veturat</button>
            <button onClick={() => scrollTo('rreth')} className={cn("font-medium hover:text-primary transition-colors", isScrolled ? "text-foreground" : "text-white/90")}>Rreth Nesh</button>
            <button onClick={() => scrollTo('kontakt')} className={cn("font-medium hover:text-primary transition-colors", isScrolled ? "text-foreground" : "text-white/90")}>Kontakt</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant={isScrolled ? "outline" : "ghost"} className={!isScrolled ? "text-white hover:text-foreground" : ""}>Kyçu</Button>
            <Button>Regjistrohu</Button>
          </div>

          <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} color={isScrolled ? "#201F1D" : "white"} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background pt-24 px-6 flex flex-col gap-6"
          >
            <button onClick={() => scrollTo('hero')} className="text-2xl font-bold border-b pb-4 text-left">Ballina</button>
            <button onClick={() => scrollTo('veturat')} className="text-2xl font-bold border-b pb-4 text-left">Veturat</button>
            <button onClick={() => scrollTo('rreth')} className="text-2xl font-bold border-b pb-4 text-left">Rreth Nesh</button>
            <button onClick={() => scrollTo('kontakt')} className="text-2xl font-bold border-b pb-4 text-left">Kontakt</button>
            <div className="flex flex-col gap-4 mt-8">
              <Button variant="outline" className="w-full">Kyçu</Button>
              <Button className="w-full">Regjistrohu</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.jpg)` }}
        />
        {/* Dark + red tint overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Light blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/[0.02]" />
        {/* Subtle red glow bottom */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-1/4 bottom-0 w-2/3 h-1/2 bg-primary/15 blur-[100px] rounded-full" />
          <div className="absolute right-[10%] top-0 w-32 h-[150%] bg-primary transform rotate-45 translate-x-1/2 opacity-10" />
          <div className="absolute right-[20%] top-0 w-16 h-[150%] bg-primary transform rotate-45 translate-x-1/2 opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-start w-full pb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>100% e besueshme & e sigurt</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
              <span className="text-primary block mb-2">Zgjidhja Juaj</span>
              për Udhtime Komode!
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-lg">
              Eksploroni bukuritë e Zvicrës dhe më gjerë me flotën tonë të veturave premium dhe ekonomike. Siguri, rehati dhe çmimet më të mira në treg.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => scrollTo('veturat')} className="gap-2">
                Shiko Veturat <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white">
                Rezervo Tani
              </Button>
            </div>

            <div className="pt-8 flex items-center gap-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-white/60">Vetura</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-sm text-white/60">Klientë</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-white">4.9</p>
                <div className="flex flex-col">
                  <div className="flex text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-xs text-white/60">Rating</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SEARCH BAR (Overlapping) */}
      <section className="relative z-20 -mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-4 md:p-8 bg-white/90 backdrop-blur-xl shadow-2xl border-white/50">
          <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={(e) => { e.preventDefault(); scrollTo('veturat'); }}>
            <div className="space-y-2">
              <Label>Lloji i veturës</Label>
              <div className="relative">
                <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <select className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary appearance-none">
                  <option>Të gjitha</option>
                  <option>Ekonomike</option>
                  <option>SUV</option>
                  <option>Luksoze</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lokacioni</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input className="pl-10" placeholder="Zgjedh lokacionin..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data e pranimit</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="date" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data e dorëzimit</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="date" className="pl-10" />
              </div>
            </div>
            <Button size="lg" type="submit" className="w-full md:w-auto text-lg h-12">
              Kërko
            </Button>
          </form>
        </Card>
      </section>

      {/* FEATURES */}
      <section id="rreth" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Pse Ne?</h2>
          <h3 className="text-3xl md:text-4xl font-bold">Arsyet pse të zgjidhni Swiss Rent A Car</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Siguri Maksimale", desc: "Të gjitha veturat janë të siguruara 100% (Kasko)." },
            { icon: Clock, title: "Mbështetje 24/7", desc: "Jemi gjithmonë këtu për t'ju ndihmuar." },
            { icon: Star, title: "Çmimi më i mirë", desc: "Garantojmë çmimet më konkurruese në treg." },
            { icon: MapPin, title: "Lokacione të Shumta", desc: "Merrni dhe dorëzoni veturën kudo në Kosovë & Zvicër." },
          ].map((feature, i) => (
            <Card key={i} className="p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CAR FLEET */}
      <section id="veturat" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Flota Jonë</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Veturat më të kërkuara</h3>
            </div>
            
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 hide-scrollbar">
              {['all', 'economy', 'standard', 'suv', 'luxury'].map((cat) => (
                <Button 
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full capitalize whitespace-nowrap"
                >
                  {cat === 'all' ? 'Të gjitha' : cat}
                </Button>
              ))}
            </div>
          </div>

          {isLoadingCars ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <CarFront className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold">Nuk u gjetën vetura</h3>
              <p className="text-muted-foreground mt-2">Provoni të ndryshoni kategorinë ose filtrat.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.slice(0, 6).map((car) => (
                <Card key={car.id} className="group overflow-hidden bg-card flex flex-col">
                  <div className="relative h-56 bg-gradient-to-br from-muted to-muted/50 p-6 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                      €{car.pricePerDay} / ditë
                    </div>
                    {/* fallback to stock if API image fails, but use API image mostly */}
                    <img 
                      src={car.imageUrl || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop"} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{car.brand}</p>
                      <h4 className="text-2xl font-bold">{car.model}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-3 mb-6 flex-1 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" /> {car.seats} Ulëse
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center"><div className="w-1 h-1 bg-primary rounded-full" /></div>
                        {car.transmission === 'automatic' ? 'Automatik' : 'Manual'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" /> {/* icon placeholder */}
                        {car.fuelType === 'petrol' ? 'Benzinë' : car.fuelType === 'diesel' ? 'Naftë' : car.fuelType}
                      </div>
                    </div>

                    <Button onClick={() => setSelectedCar(car)} className="w-full">
                      Rezervo Tani
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">Shiko të gjitha veturat</Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Procesi</h2>
          <h3 className="text-3xl md:text-4xl font-bold">Si funksionon me 3 hapa të lehtë</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border border-dashed border-2 border-transparent border-t-border" />
          
          {[
            { step: 1, title: "Zgjedh Veturën", desc: "Zbuloni flotën tonë dhe gjeni veturën që i përshtatet nevojave tuaja." },
            { step: 2, title: "Cakto Datën & Vendin", desc: "Përcaktoni kohën dhe vendin ku dëshironi të merrni veturën." },
            { step: 3, title: "Merrni Çelësat", desc: "Përfundoni pagesën dhe shijoni udhëtimin tuaj pa brenga." }
          ].map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-card border-4 border-background shadow-xl rounded-full flex items-center justify-center text-3xl font-black text-primary mb-6">
                {item.step}
              </div>
              <h4 className="text-xl font-bold mb-3">{item.title}</h4>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-foreground text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Dëshmi</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Çfarë thonë klientët tanë</h3>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar">
            {[
              { name: "Alban Krasniqi", loc: "Prishtinë", text: "Shërbim i shkëlqyer! Vetura ishte në gjendje perfekte dhe procesi i marrjes ishte shumë i shpejtë. E rekomandoj!" },
              { name: "Elena Gashi", loc: "Zvicër", text: "Çmimet më të mira për vetura luksoze. Stafi shumë profesional dhe mikpritës. Do të rikthehem patjetër." },
              { name: "Besart Berisha", loc: "Tiranë", text: "Komunikim i lehtë dhe transparent. Nuk kishte asnjë kosto të fshehur dhe depozita u kthye menjëherë." }
            ].map((review, i) => (
              <Card key={i} className="min-w-[320px] md:min-w-[400px] snap-center p-8 bg-white/5 border-white/10 text-white backdrop-blur-md">
                <div className="flex text-primary mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg text-white/80 italic mb-8">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold">{review.name}</h5>
                    <p className="text-sm text-white/50">{review.loc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">FAQ</h2>
          <h3 className="text-3xl md:text-4xl font-bold">Pyetjet e Shpeshta</h3>
        </div>

        <div className="space-y-4">
          {[
            { q: "Cilat janë dokumentet e nevojshme për të marrë një veturë me qira?", a: "Për të marrë një veturë me qira ju nevojitet një patentë shoferi valide dhe një kartë identiteti ose pasaportë." },
            { q: "A mund ta dërgoj veturën në një shtet tjetër?", a: "Po, por duhet të na njoftoni paraprakisht në mënyrë që të përgatisim dokumentacionin e nevojshëm (Kartonin e Gjelbër)." },
            { q: "A përfshihet sigurimi Kasko në çmim?", a: "Po, të gjitha veturat tona vijnë me sigurim të plotë Kasko." },
            { q: "Si funksionon depozita e sigurisë?", a: "Një shumë e caktuar bllokohet si depozitë dhe lirohet plotësisht pas kthimit të veturës në gjendje të rregullt." },
          ].map((faq, i) => (
            <details key={i} className="group bg-card rounded-2xl border border-border/50 overflow-hidden">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 hover:text-primary transition-colors">
                {faq.q}
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <div className="text-muted-foreground p-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="kontakt" className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
        {/* unplash scenic road */}
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop" 
          alt="Road" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Gati për Aventurën Tuaj?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Rezervoni tani dhe përfitoni nga zbritjet tona speciale për rezervime online.
          </p>
          <Button size="lg" variant="outline" onClick={() => scrollTo('hero')} className="bg-white text-primary border-none hover:bg-white/90 px-12 h-16 text-xl">
            Rezervo Tani
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-white/70 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white leading-none">SWISS</span>
              <span className="text-xs font-bold tracking-widest text-primary uppercase leading-none">Rent a Car</span>
            </div>
            <p className="text-sm leading-relaxed">
              Zgjedhja juaj e parë për qira të veturave. Ne ofrojmë cilësi, siguri dhe komoditet për çdo udhëtim tuajin.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"><Facebook className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"><Instagram className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"><Twitter className="w-5 h-5" /></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Linqe të Shpejta</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => scrollTo('hero')} className="hover:text-primary transition-colors">Ballina</button></li>
              <li><button onClick={() => scrollTo('veturat')} className="hover:text-primary transition-colors">Veturat</button></li>
              <li><button onClick={() => scrollTo('rreth')} className="hover:text-primary transition-colors">Rreth Nesh</button></li>
              <li><button onClick={() => scrollTo('kontakt')} className="hover:text-primary transition-colors">Kontakt</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Kushtet</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Kushtet e Qirasë</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Politika e Privatësisë</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Kontakt</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Rruga e Aeroportit, Prishtinë, Kosovë</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+383 44 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@swissrentacar.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-sm text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Swiss Rent A Car. Të gjitha të drejtat e rezervuara.</p>
          <p>Krijuar me pasion për detaje.</p>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </div>
  );
}
