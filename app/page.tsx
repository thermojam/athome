import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Map } from '@/components/sections/Map';
import { Transformation } from '@/components/sections/Transformation';

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Map />
      <Transformation />
    </>
  );
}
