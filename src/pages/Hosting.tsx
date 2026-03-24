import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Hosting() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <h1 className="font-display font-bold text-4xl mb-4 text-text-primary">Hosting</h1>
        <p className="text-text-secondary">Managed production n8n hosting. Coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
