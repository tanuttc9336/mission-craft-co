import { LenisProvider } from '@/lib/lenis-provider';
import Chapter00_TheVoid from '@/components/chapters/Chapter00_TheVoid';
import Chapter01_ListenFirst from '@/components/chapters/Chapter01_ListenFirst';
import Chapter02_PointTheDirection from '@/components/chapters/Chapter02_PointTheDirection';
import Chapter03_MakeIt from '@/components/chapters/Chapter03_MakeIt';
import Chapter04_MakeItRight from '@/components/chapters/Chapter04_MakeItRight';
import Chapter05_MakeItWork from '@/components/chapters/Chapter05_MakeItWork';

function ChapterStub({ id, label, height = '100vh' }: { id: string; label: string; height?: string }) {
  return (
    <section id={id} style={{ height }} className="relative w-full flex items-center justify-center bg-black text-white/40 border-b border-white/5">
      <span className="text-xs tracking-widest uppercase">{label}</span>
    </section>
  );
}

export default function Home() {
  return (
    <LenisProvider>
      <main className="bg-black text-white">
        <Chapter00_TheVoid />
        <Chapter01_ListenFirst />
        <Chapter02_PointTheDirection />
        <Chapter03_MakeIt />
        <Chapter04_MakeItRight />
        <Chapter05_MakeItWork />
        <ChapterStub id="06-the-work-audi" label="06 · The Work — Audi" height="500vh" />
        <ChapterStub id="07-the-work-greenline" label="07 · The Work — Greenline" height="500vh" />
        <ChapterStub id="08-the-standard" label="08 · The Standard" height="600vh" />
        <ChapterStub id="09-the-pass" label="09 · The Pass" height="300vh" />
      </main>
    </LenisProvider>
  );
}
