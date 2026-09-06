import { Hero } from "../components/home/Hero";
import { Benefits } from "../components/home/Benefits";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { Categories } from "../components/home/Categories";
import { Testimonials } from "../components/home/Testimonials";
import { CTA } from "../components/home/CTA";

export function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <CTA />
    </>
  );
}
