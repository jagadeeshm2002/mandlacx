import Section from "@/components/incident";
import Timeline from "@/components/incident/Timeline";
import UseFetchCamaras from "@/lib/hooks/UseFetchCamaras";

export default function Home() {

  return (
    <main className="p-5">
      <Section  />
      <Timeline  />
    </main>
  );
}
