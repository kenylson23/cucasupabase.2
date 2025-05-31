import Navigation from '@/components/Navigation';
import PontosVendaSection from '@/components/PontosVendaSection';
import Footer from '@/components/Footer';

export default function PontosVenda() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <PontosVendaSection />
      </main>
      <Footer />
    </>
  );
}