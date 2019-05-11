import * as React from 'react';
import * as dg from 'dis-gui';

import * as Audio from '../../modules/Audio';
import { Svg, Props as SvgProps } from '../components/Svg';

const audioFiles = [
  'audios/amen.mp3',
  'audios/think.mp3',
  'audios/apache.mp3',
  'audios/soulpride.mp3',
  'audios/tizianocrudeli.mp3',
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
      // spectrum analyser
      const tmpFrequencyData = new Uint8Array(node.frequencyBinCount);
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
