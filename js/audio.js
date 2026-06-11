/* 江湖箴言 · generative erhu-style ambience.
   Synthesized live with the Web Audio API — no audio files, nothing to license.
   A bowed sawtooth voice (bandpass "body", delayed vibrato, slow bow envelope)
   wanders a D-major pentatonic scale over a soft open-string drone and valley echo. */
var ErhuMusic = (function () {
  "use strict";

  var ctx = null, master = null, echoIn = null;
  var playing = false, schedTimer = null, nextTime = 0;
  var prevIdx = 2, prevFreq = null;

  // D major pentatonic across the erhu's sweet range: D4 E4 F#4 A4 B4 D5 E5
  var SCALE = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25];

  function setup() {
    var AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // valley echo: feedback delay, damped so repeats soften like distance
    echoIn = ctx.createDelay(1.0);
    echoIn.delayTime.value = 0.34;
    var damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 2400;
    var feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    var wet = ctx.createGain();
    wet.gain.value = 0.35;
    echoIn.connect(damp);
    damp.connect(feedback);
    feedback.connect(echoIn);
    echoIn.connect(wet);
    wet.connect(master);

    // soft low drone — the resonance of the open D string
    var drone = ctx.createOscillator();
    drone.type = "triangle";
    drone.frequency.value = 146.83;
    var droneGain = ctx.createGain();
    droneGain.gain.value = 0.035;
    var tremolo = ctx.createOscillator();
    tremolo.frequency.value = 0.13;
    var tremoloDepth = ctx.createGain();
    tremoloDepth.gain.value = 0.012;
    tremolo.connect(tremoloDepth);
    tremoloDepth.connect(droneGain.gain);
    drone.connect(droneGain);
    droneGain.connect(master);
    drone.start();
    tremolo.start();
  }

  function bow(t, freq, dur, slideFrom) {
    var osc = ctx.createOscillator();
    osc.type = "sawtooth";

    // the instrument "body": a resonant bandpass plus a gentle lowpass
    var body = ctx.createBiquadFilter();
    body.type = "bandpass";
    body.frequency.value = Math.min(freq * 2.6, 1900);
    body.Q.value = 1.6;
    var soften = ctx.createBiquadFilter();
    soften.type = "lowpass";
    soften.frequency.value = 3000;

    if (slideFrom) {
      // portamento slide into the note, a signature erhu gesture
      osc.frequency.setValueAtTime(slideFrom, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.16);
    } else {
      osc.frequency.setValueAtTime(freq, t);
    }

    // vibrato fades in late, like a finger settling on the string
    var vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5.2 + Math.random() * 0.8;
    var vibratoDepth = ctx.createGain();
    vibratoDepth.gain.setValueAtTime(0, t);
    vibratoDepth.gain.linearRampToValueAtTime(freq * 0.013, t + 0.4);
    vibrato.connect(vibratoDepth);
    vibratoDepth.connect(osc.frequency);

    // bow envelope: slow swell, sustain, soft release
    var peak = 0.13 + Math.random() * 0.05;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.14);
    gain.gain.setValueAtTime(peak, Math.max(t + 0.15, t + dur - 0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(body);
    body.connect(soften);
    soften.connect(gain);
    gain.connect(master);
    gain.connect(echoIn);
    osc.start(t);
    osc.stop(t + dur + 0.1);
    vibrato.start(t);
    vibrato.stop(t + dur + 0.1);
  }

  function schedule() {
    while (nextTime < ctx.currentTime + 2.5) {
      // wander the scale, favoring small steps
      var step = [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
      var idx = Math.max(0, Math.min(SCALE.length - 1, prevIdx + step));
      var freq = SCALE[idx];
      var dur = [1.0, 1.3, 1.6, 2.2, 2.8][Math.floor(Math.random() * 5)];
      var slide = (Math.abs(idx - prevIdx) >= 2 && prevFreq) ? prevFreq : null;
      bow(nextTime, freq, dur, slide);
      prevIdx = idx;
      prevFreq = freq;
      // occasional breath between phrases
      nextTime += dur + (Math.random() < 0.25 ? 0.9 + Math.random() : 0.12);
    }
    schedTimer = setTimeout(schedule, 600);
  }

  function start() {
    if (!ctx) setup();
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.6);
    nextTime = Math.max(nextTime, ctx.currentTime + 0.15);
    clearTimeout(schedTimer);
    schedule();
    playing = true;
  }

  function stop() {
    if (!ctx) return;
    clearTimeout(schedTimer);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    playing = false;
  }

  return {
    toggle: function () {
      if (playing) { stop(); } else { start(); }
      return playing;
    },
    isPlaying: function () { return playing; }
  };
})();
