import Header from "@/components/Header";
import Section from "@/components/incident";
import Timeline from "@/components/incident/Timeline";
import UseFetchCamaras from "@/lib/hooks/UseFetchCamaras";

export default function Home() {
  return (
    <div className="font-sans bg-gradient-to-b to-[#000000] from-[#151515] min-h-screen relative ">
      <div className="w-[800px] h-[100px] absolute bg-yellow-500 -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-[500px]" />
      <Header />
      <main className=" p-5">
        <Section />
        <Timeline />
      </main>
    </div>
  );
}
