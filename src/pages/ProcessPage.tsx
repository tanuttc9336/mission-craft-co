import { LenisProvider } from '@/lib/lenis-provider';
import { CursorProvider } from '@/contexts/CursorContext';
import { LivingGrain, TwitchEngine, SoundOfLooking, PastTrace } from '@/components/effects';
import Chapter00_TheVoid from '@/components/chapters/Chapter00_TheVoid';
import Chapter01_ListenFirst from '@/components/chapters/Chapter01_ListenFirst';
import Chapter02_PointTheDirection from '@/components/chapters/Chapter02_PointTheDirection';
import Chapter03_MakeIt from '@/components/chapters/Chapter03_MakeIt';
import Chapter04_MakeItRight from '@/components/chapters/Chapter04_MakeItRight';
import Chapter05_MakeItWork from '@/components/chapters/Chapter05_MakeItWork';
import Chapter06_AudiCaseStudy from '@/components/chapters/Chapter06_AudiCaseStudy';
import Chapter07_GreenlineCaseStudy from '@/components/chapters/Chapter07_GreenlineCaseStudy';
import Chapter08_TheStandard from '@/components/chapters/Chapter08_TheStandard';
import Chapter09_ThePass from '@/components/chapters/Chapter09_ThePass';
import FloatingLogo from '@/components/chrome/FloatingLogo';
import SkipLink from '@/components/chrome/SkipLink';
import MagneticCursor from '@/components/chrome/MagneticCursor';

export default function ProcessPage() {
  return (
    <CursorProvider>
      <LenisProvider>
        {/* ── Ambient effects ── */}
        <LivingGrain />
        <TwitchEngine />
        <SoundOfLooking />
        <PastTrace />

        <SkipLink />
        <FloatingLogo />
        <MagneticCursor />
        <main id="main" className="bg-black text-white">
          <Chapter00_TheVoid />
          <Chapter01_ListenFirst />
          <Chapter02_PointTheDirection />
          <Chapter03_MakeIt />
          <Chapter04_MakeItRight />
          <Chapter05_MakeItWork />
          <Chapter06_AudiCaseStudy />
          <Chapter07_GreenlineCaseStudy />
          <Chapter08_TheStandard />
          <Chapter09_ThePass />
        </main>
      </LenisProvider>
    </CursorProvider>
  );
}
