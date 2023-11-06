import { Head } from "next/document";
import  Header  from "../components/atoms/Header";
import HeroSection from "@/components/molecules/HeroSection";
import CardsSection from "@/components/molecules/CardsSection";
import OffersSection from "@/components/molecules/OffersSection";
import Footer from "@/components/atoms/Footer";




export default function Home() {
  return (
    <div>
      {/* <Head>
        <title>Comwell Hotels</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content='Generated by bla bla bla' />
        <link rel='icon' href='/favicon.ico' />
      </Head> */}
      <div>
        <Header />
        <main>
          <HeroSection />
          <CardsSection />
          <OffersSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
