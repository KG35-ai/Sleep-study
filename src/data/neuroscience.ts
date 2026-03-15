export interface BrainRegion {
  id: string;
  name: string;
  description: string;
  functions: string[];
  position: [number, number, number];
  color: string;
  clinical?: string;
}

export const brainRegions: BrainRegion[] = [
  {
    id: 'pons',
    name: 'The Pons',
    description: 'Part of the brainstem that serves as a message station between several areas of the brain. It plays a key role in generating the respiratory rhythm of breathing.',
    clinical: 'Critical for REM sleep regulation and the transition between wakefulness and sleep.',
    functions: ['Respiratory Rhythm', 'REM Sleep Generation', 'Sleep-Wake Transition'],
    position: [0, -1.8, 0.2],
    color: '#60a5fa'
  },
  {
    id: 'medulla',
    name: 'Medulla Oblongata',
    description: 'The lowest part of the brainstem, continuous with the spinal cord. It contains the primary respiratory centers.',
    clinical: 'Controls autonomic functions such as breathing, heart rate, and blood pressure. Damage can lead to central sleep apnea.',
    functions: ['Involuntary Breathing', 'Heart Rate Regulation', 'Chemoreceptor Integration'],
    position: [0, -2.5, 0],
    color: '#3b82f6'
  },
  {
    id: 'hypothalamus',
    name: 'Hypothalamus',
    description: 'A small but crucial part of the brain that acts as the control center for many autonomic functions.',
    clinical: 'Contains the Suprachiasmatic Nucleus (SCN), the body\'s master circadian clock.',
    functions: ['Circadian Rhythm Control', 'Sleep Induction', 'Thermoregulation'],
    position: [0, -0.2, 0.5],
    color: '#f472b6'
  },
  {
    id: 'thalamus',
    name: 'Thalamus',
    description: 'Relays sensory and motor signals to the cerebral cortex.',
    clinical: 'Acts as a gatekeeper for sensory information during sleep; it becomes less active during non-REM sleep to prevent arousal.',
    functions: ['Sensory Gating', 'Arousal Regulation', 'Sleep Spindle Generation'],
    position: [0, 0.5, 0],
    color: '#8b5cf6'
  },
  {
    id: 'pineal-gland',
    name: 'Pineal Gland',
    description: 'A small endocrine gland that produces melatonin, a hormone that modulates sleep patterns.',
    clinical: 'Essential for the regulation of the sleep-wake cycle in response to light-dark cycles.',
    functions: ['Melatonin Secretion', 'Seasonal Rhythm', 'Sleep Pattern Modulation'],
    position: [0, 0.2, -0.5],
    color: '#ec4899'
  },
  {
    id: 'prefrontal-cortex',
    name: 'Prefrontal Cortex',
    description: 'The front part of the frontal lobe, involved in complex cognitive behavior.',
    clinical: 'Sleep deprivation significantly impairs prefrontal cortex function, leading to poor judgment and emotional instability.',
    functions: ['Executive Function', 'Emotional Regulation', 'Cognitive Recovery during Sleep'],
    position: [0, 1, 2],
    color: '#ef4444'
  }
];

export interface BrainWave {
  type: string;
  frequency: string;
  state: string;
  description: string;
}

export const brainWaves: BrainWave[] = [
  {
    type: 'Beta',
    frequency: '13-30 Hz',
    state: 'Active Wake',
    description: 'Normal waking consciousness and active thinking.'
  },
  {
    type: 'Alpha',
    frequency: '8-13 Hz',
    state: 'Relaxed Wake',
    description: 'Relaxed state with eyes closed, just before falling asleep.'
  },
  {
    type: 'Theta',
    frequency: '4-8 Hz',
    state: 'N1/N2 Sleep',
    description: 'Light sleep stages, associated with sleep spindles and K-complexes.'
  },
  {
    type: 'Delta',
    frequency: '0.5-4 Hz',
    state: 'N3 Deep Sleep',
    description: 'Slow-wave sleep, critical for physical restoration and growth.'
  },
  {
    type: 'REM',
    frequency: 'Mixed',
    state: 'Dream State',
    description: 'Rapid Eye Movement sleep, associated with intense brain activity and dreaming.'
  }
];
