/* eslint-disable no-return-assign */

import axios from 'axios';

if (!('AudioContext' in window)) {
  throw new Error('Your browser does not support the Web Audio API');
}

if (!navigator.getUserMedia) {
  throw new Error('Your browser does not support the Media Stream API');
}

type GetBuffers = (context: AudioContext, urls: string[]) => Promise<AudioBuffer>[];

const getBuffers: GetBuffers = (context, urls) =>
  urls.map(
    url =>
      new Promise<AudioBuffer>(async (resolve, reject) => {
        const { data } = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
        context.decodeAudioData(
          data,
          buffer => {
            if (!buffer) {
              reject(new Error("Can't get buffer"));
              return;
            }

            resolve(buffer);
          },
          error => reject(error),
        );
      }),
  );

const linearInterpolation = (a: number, b: number, t: number) => a + (b - a) * t;
const hannWindow = (length: number) => {
  const window = new Float32Array(length);
  [...Array(length).keys()].forEach(i => (window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)))));
  return window;
};

export type Props = {
  sourceNames: string[];
};

export type IO = {
  setAudioSourceIndex: (i: number) => void;
  setPitchRatio: (pitchRatio: number) => void;
  setPlaybackRatio: (pitchRatio: number) => void;
  setOverlapRatio: (overlapRatio: number) => void;
  setGrainSize: (n: number) => void;
  setDelayTime: (n: number) => void;
  setFeedbackGain: (n: number) => void;
  setCutoff: (n: number) => void;
  setOnRAF: (cb: (analyser: AnalyserNode) => void) => void;
};

class PitchShifter implements IO {
  audioContext: AudioContext;

  audioSources: (AudioBufferSourceNode | MediaStreamAudioSourceNode)[] = [];

  processor?: ScriptProcessorNode;

  spectrumAnalyser: AnalyserNode;

  audioSourceIndex = -1;

  pitchRatio = 1.0;

  playbackRatio = 1.0;

  overlapRatio = 0.5;

  grainSize = 512;

  delayTime = 0.5;

  feedbackGain = 0.8;

  cutoff = 1000;

  delay: DelayNode;

  feedback: GainNode;

  filter: BiquadFilterNode;

  onRAF?: (analyser: AnalyserNode) => void;

  constructor({ sourceNames }: Props) {
    this.audioContext = new AudioContext();
    this.delay = this.audioContext.createDelay();
    this.delay.delayTime.value = this.delayTime;
    this.feedback = this.audioContext.createGain();
    this.feedback.gain.value = this.feedbackGain;
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.frequency.value = this.cutoff;
    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.audioContext.destination);

    navigator.getUserMedia(
      { audio: true, video: false },
      stream => (this.audioSources[sourceNames.length] = this.audioContext.createMediaStreamSource(stream)),
      error => console.error(error),
    );

    this.spectrumAnalyser = this.audioContext.createAnalyser();
    this.spectrumAnalyser.fftSize = 128;
    this.spectrumAnalyser.smoothingTimeConstant = 0.8;

    const getBuffersPromise = getBuffers(this.audioContext, sourceNames);
    Promise.all(getBuffersPromise).then(buffers =>
      buffers.forEach((buffer, i) => {
        const bufferSource = this.audioContext.createBufferSource();

        bufferSource.buffer = buffer;
        bufferSource.loop = true;
        if (this.processor) {
          bufferSource.connect(this.processor);
        }

        bufferSource.start(0);
        bufferSource.disconnect();
        this.audioSources[i] = bufferSource;
      }),
    );

    this.initProcessor();
  }

  setAudioSourceIndex = (i: number) => {
    const currentSource = this.audioSources[this.audioSourceIndex];
    if (currentSource) {
      currentSource.disconnect();
    }

    this.audioSourceIndex = i;

    const nextSource = this.audioSources[this.audioSourceIndex];
    if (nextSource && this.processor) {
      nextSource.connect(this.delay);
      nextSource.connect(this.processor);
    }
  };

  setPitchRatio = (n: number) => (this.pitchRatio = n);

  setPlaybackRatio = (n: number) =>
    this.audioSources.forEach(bufferSource => {
      if (bufferSource instanceof AudioBufferSourceNode) {
        // eslint-disable-next-line no-param-reassign
        bufferSource.playbackRate.value = n;
      }
    });

  setOverlapRatio = (n: number) => (this.overlapRatio = n);

  setGrainSize = (n: number) => {
    this.grainSize = n;
    this.initProcessor();

    if (this.audioSources[this.audioSourceIndex] && this.processor) {
      this.audioSources[this.audioSourceIndex].connect(this.processor);
    }
  };

  setDelayTime = (n: number) => {
    this.delayTime = n;
    this.delay.delayTime.value = this.delayTime;
  };

  setFeedbackGain = (n: number) => {
    this.feedbackGain = n;
    this.feedback.gain.value = this.feedbackGain;
  };

  setCutoff = (n: number) => {
    this.cutoff = n;
    this.filter.frequency.value = this.cutoff;
  };

  setOnRAF = (cb: (analyser: AnalyserNode) => void) => (this.onRAF = cb);

  getOnAudioProcess = () => {
    const { grainSize } = this;
    const buffer = new Float32Array(grainSize * 2);
    const grainWindow = hannWindow(grainSize);

    return (event: AudioProcessingEvent) => {
      const inputData = event.inputBuffer.getChannelData(0);
      const outputData = event.outputBuffer.getChannelData(0);

      for (let i = 0; i < inputData.length; i += 1) {
        // Apply the window to the input buffer
        inputData[i] *= grainWindow[i];

        // Shift half of the buffer
        buffer[i] = buffer[i + grainSize];

        // Empty the buffer tail
        buffer[i + grainSize] = 0.0;
      }

      // Calculate the pitch shifted grain re-sampling and looping the input
      const grainData = new Float32Array(grainSize * 2);
      for (let i = 0, j = 0.0; i < grainSize; i += 1, j += this.pitchRatio) {
        const index = Math.floor(j) % grainSize;
        const a = inputData[index];
        const b = inputData[(index + 1) % grainSize];
        grainData[i] += linearInterpolation(a, b, j % 1.0) * grainWindow[i];
      }

      // Copy the grain multiple times overlapping it
      for (let i = 0; i < grainSize; i += Math.round(grainSize * (1 - this.overlapRatio))) {
        for (let j = 0; j <= grainSize; j += 1) {
          buffer[i + j] += grainData[j];
        }
      }

      // Output the first half of the buffer
      for (let i = 0; i < grainSize; i += 1) {
        outputData[i] = buffer[i];
      }
    };
  };

  setOutput = (processor: ScriptProcessorNode) => {
    processor.connect(this.spectrumAnalyser);
    processor.connect(this.audioContext.destination);
  };

  initProcessor = () => {
    if (this.processor) {
      this.processor.disconnect();
    }

    this.processor = this.audioContext.createScriptProcessor(this.grainSize, 1, 1);

    this.processor.onaudioprocess = this.getOnAudioProcess();
    this.setOutput(this.processor);

    const onRAF = () => {
      const { spectrumAnalyser: analyzer } = this;
      if (this.onRAF && analyzer) {
        this.onRAF(analyzer);
      }
      requestAnimationFrame(onRAF);
    };
    requestAnimationFrame(onRAF);
  };
}

export function create(props: Props): IO {
  return new PitchShifter(props);
}
