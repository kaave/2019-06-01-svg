import * as React from 'react';
import * as dg from 'dis-gui';

import { initializeWebMidi } from '../../modules/Midi';
import * as Audio from '../../modules/Audio';
import { Svg, Props as SvgProps } from '../components/Svg';

const audioFiles = [
  'audios/amen.mp3',
  'audios/think.mp3',
  'audios/apache.mp3',
  'audios/soulpride.mp3',
  'audios/tizianocrudeli.mp3',
  'audios/ojisan.mp3',
];
const audio = Audio.create({ sourceNames: audioFiles });
const audioSources = ['none', ...audioFiles, 'microphone'];
const validGrainSizes = [256, 512, 1024, 2048, 4096, 8192].map(n => n.toString());

export const App: React.FC<{}> = () => {
  const [audioSource, setAudioSource] = React.useState(audioSources[0]);
  const [pitchRatio, setPitchRatio] = React.useState(1);
  const [playbackRatio, setPlaybackRatio] = React.useState(1);
  const [overlapRatio, setOverlapRatio] = React.useState(0.6);
  const [grainSize, setGrainSize] = React.useState(validGrainSizes[2]);
  const [delayTime, setDelayTime] = React.useState(250);
  const [feedbackGain, setFeedbackGain] = React.useState(0.4);
  const [cutoff, setCutoff] = React.useState(8000);
  const [frequencyData, setFrequencyData] = React.useState(new Uint8Array());

  const svgRef = React.useRef<SVGSVGElement>(null);
  const svgProps: SvgProps = { svgRef, blockCount: frequencyData.length };

  React.useEffect(() => {
    audio.setOnRAF((node: AnalyserNode) => {
      const tmpFrequencyData = new Uint8Array(node.frequencyBinCount);
      node.getByteTimeDomainData(tmpFrequencyData);
      const totalTimeData = tmpFrequencyData.reduce((total, n) => total + n, 0);
      const amplitude = Math.abs(totalTimeData / tmpFrequencyData.length - 128) * 5 + 1;
      const normalizedAmp = amplitude / 128; // あまめ
      document.body.style.backgroundColor = `hsl(0, 0%, ${normalizedAmp * 100}%)`;

      // spectrum analyser
      node.getByteFrequencyData(tmpFrequencyData);
      setFrequencyData(tmpFrequencyData);

      if (!svgRef.current) return;
      const rects = Array.from(svgRef.current.querySelectorAll<SVGRectElement>('.mask rect'));
      rects.forEach((rect, i) => {
        const gain = tmpFrequencyData[i];
        if (!gain) return;
        rect.setAttribute('transform', `scale(1, ${1 - gain / 256})`);
      });
    });
    initializeWebMidi(({ data: [, ch, value] }) => {
      // eslint-disable-next-line yoda
      if (ch < 21 || 28 < ch) return;

      const normalizedValue = value / 127;
      const knobIndex = ch - 21;
      switch (knobIndex) {
        case 0: {
          const min = 0.5;
          const max = 2;
          const range = max - min;
          const setValue = range * normalizedValue + min;
          setPitchRatio(setValue);
          audio.setPitchRatio(setValue);
          break;
        }
        case 1: {
          const min = 0;
          const max = 5;
          const range = max - min;
          const setValue = range * normalizedValue + min;
          setPlaybackRatio(setValue);
          audio.setPlaybackRatio(setValue);
          break;
        }
        case 2: {
          const min = 0;
          const max = 0.99;
          const range = max - min;
          const setValue = range * normalizedValue + min;
          setOverlapRatio(setValue);
          audio.setOverlapRatio(setValue);
          break;
        }
        case 5: {
          const min = 20;
          const max = 1000;
          const range = max - min;
          const setValue = range * normalizedValue + min;
          setDelayTime(setValue);
          audio.setDelayTime(setValue / 1000);
          break;
        }
        case 6: {
          const min = 0;
          const max = 1;
          const range = max - min;
          const setValue = range * normalizedValue + min;
          setFeedbackGain(setValue);
          audio.setFeedbackGain(setValue);
          break;
        }
        case 7: {
          const min = 0;
          const max = 20000;
          const range = max - min;
          const setValue = range * normalizedValue + min;
          setCutoff(setValue);
          audio.setCutoff(setValue);
          break;
        }

        default:
          break;
      }
    });
  }, []);

  return (
    <main id="main" className="Main" role="main">
      <figure className="Svg__parent">
        <Svg {...svgProps} />
      </figure>
      <dg.GUI>
        <dg.Select
          label="Source"
          value={audioSource}
          options={audioSources}
          onChange={(sourceName: string) => {
            setAudioSource(sourceName);
            const bufferIndex = audioSources.indexOf(sourceName) - 1;
            audio.setAudioSourceIndex(bufferIndex);
          }}
        />
        <dg.Number
          label="PitchRatio"
          value={pitchRatio}
          min={0.5}
          max={2}
          step={0.01}
          onChange={(n: number) => {
            setPitchRatio(n);
            audio.setPitchRatio(n);
          }}
        />
        <dg.Number
          label="PlaybackRatio"
          value={playbackRatio}
          min={0}
          max={5}
          step={0.05}
          onChange={(n: number) => {
            setPlaybackRatio(n);
            audio.setPlaybackRatio(n);
          }}
        />
        <dg.Number
          label="OverlapRatio"
          value={overlapRatio}
          min={0}
          max={0.99}
          step={0.01}
          onChange={(n: number) => {
            setOverlapRatio(n);
            audio.setOverlapRatio(n);
          }}
        />
        <dg.Select
          label="GrainSize"
          value={grainSize}
          options={validGrainSizes}
          onChange={(s: string) => {
            const n = parseInt(s, 10);
            setGrainSize(s);
            audio.setGrainSize(n);
          }}
        />
        <dg.Number
          label="DelayTime"
          value={delayTime}
          min={20}
          max={1000}
          step={20}
          onChange={(n: number) => {
            setDelayTime(n);
            audio.setDelayTime(n / 1000);
          }}
        />
        <dg.Number
          label="FeedbackGain"
          value={feedbackGain}
          min={0}
          max={1}
          step={0.01}
          onChange={(n: number) => {
            setFeedbackGain(n);
            audio.setFeedbackGain(n);
          }}
        />
        <dg.Number
          label="Cutoff frequency"
          value={cutoff}
          min={0}
          max={20000}
          step={500}
          onChange={(n: number) => {
            setCutoff(n);
            audio.setCutoff(n);
          }}
        />
      </dg.GUI>
    </main>
  );
};
