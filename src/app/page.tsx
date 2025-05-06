import { Background } from '@/components/Background';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="fixed h-screen w-screen">
      <Background />
      <HeroSection />
    </div>
  );
} 