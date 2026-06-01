import { useNavMenu } from '../../context/NavMenuContext';
import { useSiteAudio } from '../../context/SiteAudioContext';

function IconVolumeOn() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
    </svg>
  );
}

function IconVolumeOff() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path strokeLinecap="round" d="M16 9l5 6M21 9l-5 6" />
    </svg>
  );
}

export default function AudioToggle() {
  const { menuOpen } = useNavMenu();
  const { muted, ready, error, needsUnlock, toggle } = useSiteAudio();

  if (menuOpen) return null;

  const isAudible = !muted && !needsUnlock;

  const label = error
    ? 'Background audio unavailable'
    : needsUnlock
      ? 'Tap to turn on sound'
      : muted
        ? 'Turn on background audio'
        : 'Mute background audio';

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={error || !ready}
      aria-pressed={isAudible}
      aria-label={label}
      title={label}
      className={[
        'audio-toggle fixed bottom-5 left-5 z-[1990] flex h-14 w-14 items-center justify-center transition-[background-color,border-color,box-shadow,color] duration-300 sm:bottom-6 sm:left-6',
        error || !ready
          ? 'cursor-not-allowed border border-steel-200 bg-steel-100 text-steel-400 opacity-50'
          : isAudible
            ? 'border-2 border-red bg-red text-white shadow-[0_0_16px_rgba(255,55,47,0.4)]'
            : needsUnlock
              ? 'audio-toggle--attention border-2 border-red bg-ink text-white'
              : 'border-2 border-steel-300 bg-white text-ink shadow-md hover:border-red hover:text-red',
      ].join(' ')}
      style={{
        marginBottom: 'env(safe-area-inset-bottom, 0px)',
        marginLeft: 'env(safe-area-inset-left, 0px)',
      }}
    >
      {isAudible || needsUnlock ? <IconVolumeOn /> : <IconVolumeOff />}
    </button>
  );
}
