export async function initializeWebMidi(onMidiMessage: (e: WebMidi.MIDIMessageEvent) => void) {
  if (!navigator.requestMIDIAccess) {
    return;
  }

  const midi = await navigator.requestMIDIAccess();
  const inputIterator = midi.inputs.values();
  const inputs: WebMidi.MIDIInput[] = [];
  for (let o = inputIterator.next(); !o.done; o = inputIterator.next()) {
    inputs.push(o.value);
  }

  inputs.forEach(input => {
    console.log(`${input.state} [${input.name}]`);
    // eslint-disable-next-line no-param-reassign
    input.onmidimessage = onMidiMessage;
  });
}
