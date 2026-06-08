import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMobileViewport, prefersReducedMotion } from '@/lib/motion';
import { telegraphScrollStory } from '@/lib/telemetry';
import { safeGsapContext } from '@/lib/recovery';

gsap.registerPlugin(ScrollTrigger);

export type StoryTransitionId = 'warp' | 'elevator' | 'iris' | 'dissolve';

export interface StoryBeat {
  id: string;
  holdRatio?: number;
  exitTransition?: StoryTransitionId;
}

export interface PinStoryOptions {
  storyId: string;
  root: HTMLElement;
  pin: HTMLElement;
  beats: StoryBeat[];
  segmentVh?: number;
  mobileSegmentVh?: number;
  scrub?: number;
  onBeatChange?: (index: number, progress: number) => void;
  onProgress?: (progress: number) => void;
}

export interface PinStoryHandle {
  triggers: ScrollTrigger[];
  ctx: gsap.Context;
  destroy: () => void;
}

export function segmentProgress(
  globalProgress: number,
  beatCount: number,
  holdRatio = 0.68
): { index: number; local: number; phase: 'hold' | 'exit' } {
  const scaled = globalProgress * beatCount;
  const index = Math.min(beatCount - 1, Math.max(0, Math.floor(scaled)));
  const local = scaled - index;
  const phase = local < holdRatio ? 'hold' : 'exit';
  return { index, local, phase };
}

export function transitionMix(local: number, holdRatio = 0.68): number {
  if (local < holdRatio) return 0;
  return gsap.utils.clamp(0, 1, (local - holdRatio) / (1 - holdRatio));
}

export function applyStoryTransition(
  transition: StoryTransitionId,
  mix: number,
  direction: 1 | -1,
  panel: HTMLElement,
  image: HTMLElement | null,
  content: HTMLElement | null
): void {
  const m = mix;
  const d = direction;

  switch (transition) {
    case 'warp':
      gsap.set(panel, {
        opacity: 1 - m * 0.85,
        scale: 1 + m * 0.35,
        filter: `blur(${m * 14}px)`,
        z: m * 200 * d,
        transformPerspective: 1200,
      });
      if (image) gsap.set(image, { scale: 1.1 + m * 0.2, x: m * 80 * d });
      if (content) gsap.set(content, { y: m * -40, opacity: 1 - m * 0.5 });
      break;
    case 'elevator':
      gsap.set(panel, {
        opacity: 1 - m * 0.4,
        y: m * 120 * d,
        clipPath: `inset(${(1 - m) * 8}% 0 ${m * 22}% 0)`,
      });
      if (image) gsap.set(image, { y: m * 60 * d, scale: 1.05 + m * 0.08 });
      if (content) gsap.set(content, { y: m * 80 * d, rotateX: m * -12 });
      break;
    case 'iris':
      gsap.set(panel, {
        opacity: 1,
        clipPath: `circle(${(1 - m) * 78}% at 50% 50%)`,
        scale: 1 - m * 0.05,
      });
      if (image) {
        gsap.set(image, {
          scale: 1.15 - m * 0.1,
          filter: `saturate(${1 + m * 0.4}) hue-rotate(${m * 18}deg)`,
        });
      }
      if (content) gsap.set(content, { scale: 1 + m * 0.06, opacity: 1 - m * 0.25 });
      break;
    case 'dissolve':
    default:
      gsap.set(panel, {
        opacity: 1 - m,
        scale: 1 - m * 0.04,
        filter: `blur(${m * 6}px)`,
      });
      if (content) gsap.set(content, { y: m * 30 * d, opacity: 1 - m });
      break;
  }
}

export function createPinStory({
  storyId,
  root,
  pin,
  beats,
  segmentVh = 1.15,
  mobileSegmentVh = 0.95,
  scrub = 1,
  onBeatChange,
  onProgress,
}: PinStoryOptions): PinStoryHandle {
  const triggers: ScrollTrigger[] = [];
  let activeBeat = -1;

  const reduced = prefersReducedMotion();
  const mobile = isMobileViewport();
  const beatCount = beats.length;
  const segVh = mobile ? mobileSegmentVh : segmentVh;

  const ctx = safeGsapContext(root, () => {
      if (reduced || beatCount === 0) {
        telegraphScrollStory(storyId, 'reduced-motion-static');
        return;
      }

      const endDistance = () => window.innerHeight * segVh * Math.max(1, beatCount);

      const pinTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${endDistance()}`,
        pin,
        scrub: mobile ? scrub * 0.85 : scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          onProgress?.(self.progress);
          const hold = beats[0]?.holdRatio ?? 0.68;
          const { index, local, phase } = segmentProgress(self.progress, beatCount, hold);

          if (index !== activeBeat) {
            activeBeat = index;
            telegraphScrollStory(storyId, `beat:${beats[index]?.id ?? index}`, {
              index,
              progress: self.progress,
            });
            onBeatChange?.(index, self.progress);
          }

          if (phase === 'exit') {
            telegraphScrollStory(storyId, `exit:${beats[index]?.exitTransition ?? 'dissolve'}`, {
              index,
              mix: transitionMix(local, hold),
            });
          }
        },
      });
      triggers.push(pinTrigger);
    },
    storyId
  );

  const destroy = () => {
    triggers.forEach((t) => t.kill());
    ctx.revert();
  };

  return { triggers, ctx, destroy };
}
