import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Contact, Experience, Events, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Events3DPage, ScrollToTop } from "./components";

const MainLayout = () => {
  return (
    <div className='relative z-0 bg-primary'>
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Works />
      <Events />
      <Feedbacks />
      <div className='relative z-0'>
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  );
};

const App = () => {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/events" element={<Events3DPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
