import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { media } from '../data/media';

const VOLUME = 0.4;
const AUTOPLAY_DELAY_MS = 2000;

const SiteAudioContext = createContext(null);

export function SiteAudioProvider({ children }) {
  const audioRef = useRef(null);
  const delayTimerRef = useRef(null);
  const userMutedRef = useRef(false);
  const startLockRef = useRef(false);

  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const clearDelayTimer = () => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
  };

  const playAudible = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return false;

    audio.loop = true;
    audio.volume = VOLUME;
    audio.muted = false;

    try {
      await audio.play();
      if (!audio.paused) {
        setMuted(false);
        setNeedsUnlock(false);
        return true;
      }
    } catch {
      /* autoplay blocked */
    }
    return false;
  }, []);

  const startAfterDelay = useCallback(() => {
    clearDelayTimer();
    startLockRef.current = false;

    delayTimerRef.current = setTimeout(async () => {
      delayTimerRef.current = null;
      if (startLockRef.current || userMutedRef.current) return;
      startLockRef.current = true;

      const audio = audioRef.current;
      if (!audio) return;

      const audible = await playAudible();
      if (audible) return;

      audio.muted = true;
      audio.loop = true;
      audio.volume = VOLUME;
      try {
        await audio.play();
        if (!audio.paused) {
          setNeedsUnlock(true);
          setMuted(true);
          return;
        }
      } catch {
        /* blocked entirely */
      }

      setNeedsUnlock(true);
      setMuted(true);
    }, AUTOPLAY_DELAY_MS);
  }, [playAudible]);

  const bindAudio = useCallback(
    (node) => {
      clearDelayTimer();
      audioRef.current = node;

      if (!node) {
        startLockRef.current = false;
        return;
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        userMutedRef.current = true;
        setMuted(true);
        setReady(false);
        return;
      }

      userMutedRef.current = false;
      setMuted(false);
      setNeedsUnlock(false);
      setError(false);
      setReady(false);
      startLockRef.current = false;

      node.loop = true;
      node.volume = VOLUME;
      node.preload = 'auto';
      node.muted = false;

      const markReady = () => setReady(true);
      const onFail = () => setError(true);

      if (node.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        markReady();
      } else {
        node.addEventListener('canplaythrough', markReady, { once: true });
        node.addEventListener('loadeddata', markReady, { once: true });
      }
      node.addEventListener('error', onFail, { once: true });

      startAfterDelay();
    },
    [startAfterDelay],
  );

  useEffect(() => {
    const unlock = () => {
      if (!userMutedRef.current) void playAudible();
    };

    const opts = { capture: true, passive: true, once: true };
    document.addEventListener('pointerdown', unlock, opts);
    document.addEventListener('touchstart', unlock, opts);

    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || userMutedRef.current) return;

      if (document.hidden) {
        audio.pause();
        return;
      }

      startLockRef.current = false;
      startAfterDelay();
    };

    const onPageShow = (event) => {
      if (event.persisted) {
        startLockRef.current = false;
        startAfterDelay();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      document.removeEventListener('pointerdown', unlock, opts);
      document.removeEventListener('touchstart', unlock, opts);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
      clearDelayTimer();
    };
  }, [playAudible, startAfterDelay]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    if (muted || needsUnlock) {
      userMutedRef.current = false;
      startLockRef.current = true;
      await playAudible();
      return;
    }

    userMutedRef.current = true;
    clearDelayTimer();
    audio.pause();
    audio.muted = true;
    setMuted(true);
    setNeedsUnlock(false);
  }, [error, muted, needsUnlock, playAudible]);

  const value = {
    muted,
    ready,
    error,
    needsUnlock,
    toggle,
    enableAudible: playAudible,
  };

  return (
    <SiteAudioContext.Provider value={value}>
      <audio
        ref={bindAudio}
        src={media.audio}
        loop
        preload="auto"
        className="pointer-events-none fixed h-px w-px opacity-0"
        aria-hidden="true"
      />
      {children}
    </SiteAudioContext.Provider>
  );
}

export function useSiteAudio() {
  const ctx = useContext(SiteAudioContext);
  if (!ctx) throw new Error('useSiteAudio must be used within SiteAudioProvider');
  return ctx;
}
