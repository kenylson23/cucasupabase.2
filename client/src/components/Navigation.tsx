import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-cuca-white shadow-lg" : "bg-cuca-white/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-montserrat font-bold text-cuca-yellow">
              CUCA
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-cuca-black hover:text-cuca-yellow transition-colors duration-300 font-medium"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="text-cuca-black hover:text-cuca-yellow transition-colors duration-300 font-medium"
              >
                Produtos
              </button>
              <button
                onClick={() => scrollToSection("heritage")}
                className="text-cuca-black hover:text-cuca-yellow transition-colors duration-300 font-medium"
              >
                Nossa História
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-cuca-black hover:text-cuca-yellow transition-colors duration-300 font-medium"
              >
                Contato
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-cuca-black hover:text-cuca-yellow"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-cuca-white border-t">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-3 py-2 text-cuca-black hover:text-cuca-yellow transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="block w-full text-left px-3 py-2 text-cuca-black hover:text-cuca-yellow transition-colors"
            >
              Produtos
            </button>
            <button
              onClick={() => scrollToSection("heritage")}
              className="block w-full text-left px-3 py-2 text-cuca-black hover:text-cuca-yellow transition-colors"
            >
              Nossa História
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-2 text-cuca-black hover:text-cuca-yellow transition-colors"
            >
              Contato
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
