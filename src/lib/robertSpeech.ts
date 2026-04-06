export interface SpeechSegment {
  text: string;
  caption: string;
}

export const robertDialogue: SpeechSegment[] = [
  {
    text: "The threat landscape is evolving at an unprecedented pace. Every 39 seconds, a new cyber attack is launched somewhere in the world. No gaps. No guesswork. Security that works.",
    caption:
      "The threat landscape is evolving at an unprecedented pace. Every 39 seconds, a new cyber attack is launched. No gaps. No guesswork. Security that works.",
  },
  {
    text: "At A1 Technology, we protect your applications, network, cloud, and infrastructure. Our fully integrated operations center monitors security incidents instantly and responds with advanced threat hunting.",
    caption:
      "A1 Technology protects your applications, network, cloud, and infrastructure. Our integrated operations center monitors and responds instantly.",
  },
  {
    text: "We continuously monitor your networks with proactive threat intelligence and advanced analysis methods, detecting potential attacks at their source and quickly closing security gaps.",
    caption:
      "We continuously monitor networks with proactive threat intelligence, detecting attacks at their source and closing security gaps.",
  },
  {
    text: "From DevSecOps pipeline integration to advanced application security, from vulnerability assessment and penetration testing to AI-powered threat hunting. We engineer resilience at every layer.",
    caption:
      "From DevSecOps to application security, from VAPT to AI-powered threat hunting — resilience at every layer.",
  },
  {
    text: "With offices across India, UAE, South Africa, Kenya, and the United States, A1 Technology is your trusted partner for cybersecurity solutions of the future. Overcome the traditional understanding of security. Redefine security.",
    caption:
      "Offices across 5 countries. A1 Technology — your trusted partner. Overcome traditional security. Redefine it.",
  },
];

export class RobertVoice {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private onSpeakingChange: (speaking: boolean) => void;
  private onSegmentChange: (index: number) => void;
  private currentSegment = 0;
  private isMuted = false;
  private isCancelled = false;

  constructor(
    onSpeakingChange: (speaking: boolean) => void,
    onSegmentChange: (index: number) => void
  ) {
    this.onSpeakingChange = onSpeakingChange;
    this.onSegmentChange = onSegmentChange;

    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis;
    }
  }

  private getVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const preferred = [
      "Daniel", "Alex", "Google UK English Male", "Microsoft David",
      "Microsoft Mark", "Aaron", "Fred",
    ];
    for (const name of preferred) {
      const found = voices.find((v) => v.name.includes(name));
      if (found) return found;
    }
    const english = voices.find(
      (v) => v.lang.startsWith("en") && !v.name.includes("Female")
    );
    return english || voices[0] || null;
  }

  speak(segmentIndex: number = 0) {
    if (!this.synth || this.isMuted) return;
    this.isCancelled = false;
    this.currentSegment = segmentIndex;
    this.speakSegment();
  }

  private speakSegment() {
    if (!this.synth || this.isCancelled || this.currentSegment >= robertDialogue.length) {
      this.onSpeakingChange(false);
      return;
    }
    this.synth.cancel();
    const segment = robertDialogue[this.currentSegment];
    this.onSegmentChange(this.currentSegment);
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.rate = 0.85;
    utterance.pitch = 0.7;
    utterance.volume = this.isMuted ? 0 : 0.9;
    const voice = this.getVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => this.onSpeakingChange(true);
    utterance.onend = () => {
      this.onSpeakingChange(false);
      this.currentSegment++;
      if (this.currentSegment < robertDialogue.length && !this.isCancelled) {
        setTimeout(() => this.speakSegment(), 800);
      }
    };
    this.utterance = utterance;
    this.synth.speak(utterance);
  }

  skip() {
    if (!this.synth) return;
    this.synth.cancel();
    this.onSpeakingChange(false);
    this.currentSegment++;
    if (this.currentSegment < robertDialogue.length) {
      setTimeout(() => this.speakSegment(), 300);
    }
  }

  mute() {
    this.isMuted = true;
    if (this.synth) this.synth.cancel();
    this.onSpeakingChange(false);
  }

  unmute() {
    this.isMuted = false;
  }

  get muted() {
    return this.isMuted;
  }

  stop() {
    this.isCancelled = true;
    if (this.synth) this.synth.cancel();
    this.onSpeakingChange(false);
  }

  destroy() {
    this.stop();
  }
}
