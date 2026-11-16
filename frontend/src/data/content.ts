/**
 * All copy lives here. This is placeholder content for "Lior Voss", a
 * fictional interaction designer working on embodied AI and spatial
 * interfaces, structured like a one-person studio site.
 */
import { Practice, Project, Talk, Essay } from "@/types/content";

export const site = {
  name: "Lior Voss",
  wordmark: "LIOR VOSS",
  tagline: "Design for Embodied Intelligence",
  location: "Based in Lisbon, Portugal",
  role: "Independent interaction designer",
  email: "hello@liorvoss.studio",
  social: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Are.na", href: "https://are.na" },
    { label: "Instagram", href: "https://instagram.com" },
  ],
};

export const heroCopy = {
  kicker: "Not a studio — just one person",
  heading: "Interfaces for a world\nshared with machines",
  sub: "I design how people sense, move through, and trust intelligent systems — from wearable sensing to the agents that act on our behalf.",
};

export const introCopy = {
  heading: "Every interaction is a small negotiation of trust",
  paragraphs: [
    "My work sits between the body and the system — the moment a gesture becomes an instruction, or a signal from a device becomes something you can feel.",
    "I spend most of my time prototyping: sensors on skin, agents in the loop, interfaces that disappear when they work and explain themselves when they don't.",
  ],
};

export const practices: Practice[] = [
  {
    id: "spatial",
    name: "Spatial Interfaces",
    tag: "XR / wearables",
    description:
      "Voice, gaze, and gesture systems that stay legible when the screen disappears — designed so intent is understood and control is never ambiguous.",
  },
  {
    id: "embodiment",
    name: "Embodiment",
    tag: "Hardware + body",
    description:
      "Exosuits, haptic garments, and prosthetic interfaces that extend or restore physical ability, fitted to the person rather than the device.",
  },
  {
    id: "agents",
    name: "Human-Agent Collaboration",
    tag: "AI systems",
    description:
      "Interaction patterns for working alongside autonomous agents — where the person stays the author, and the system earns trust in small, visible steps.",
  },
  {
    id: "tooling",
    name: "Tools & Frameworks",
    tag: "Dev systems",
    description:
      "Design systems and SDKs built with engineers, so the right interaction pattern is the easy one to reach for by default.",
  },
];

export const aboutCopy = {
  heading: "I taught myself this field in 2016, from whatever I could find",
  paragraphs: [
    "No formal training, a lot of broken prototypes, and people generous enough to answer questions. That's probably why I still write and teach — it was someone else's writing that got me started.",
    "Outside of client work, I free-dive, badly maintain a small ceramics habit, and spend two weeks every year somewhere without reliable internet, on purpose.",
  ],
  current: "Currently designing interaction patterns for a field-robotics team, and writing a long-form series on consent in ambient computing.",
};

export const projects: Project[] = [
  {
    slug: "fieldsense",
    title: "FieldSense",
    client: "Independent research",
    year: "2024",
    category: "Wearable sensing",
    summary:
      "A forearm sensor band that reads micro-gestures for hands-full fieldwork — built with ecologists who needed to tag data without touching a screen.",
    body: [
      "FieldSense began with a simple complaint from ecologists doing bird surveys: every observation meant stopping, removing a glove, and tapping a tablet, usually the moment the thing they wanted to record disappeared.",
      "The final band reads five gestures from forearm muscle activity, calibrated per wearer in under two minutes. It pairs with a simple audio confirmation so the wearer never has to look down.",
      "Three field seasons in, the team records roughly four times more observations per outing, mostly because the device gets out of the way.",
    ],
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "co-pilot-patterns",
    title: "Co-Pilot Interaction Patterns",
    client: "Internal platform team",
    year: "2023",
    category: "Human-agent collaboration",
    summary:
      "A pattern library for products where an AI agent proposes actions on a person's behalf — covering confidence, reversibility, and interruption.",
    body: [
      "As more products shipped an agent that could act rather than just answer, teams kept re-solving the same three problems: how confident to sound, how to make an action reversible, and when an agent should interrupt versus wait.",
      "This library turned those into a shared vocabulary — a small set of named states (proposing, acting, done, undone) with concrete UI for each — so a team could ship a trustworthy agent feature without re-deriving the whole interaction model.",
      "Adopted across four product teams within two quarters, with support tickets about 'the AI did something I didn't expect' dropping noticeably on teams that used it.",
    ],
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "halo-exosuit",
    title: "Halo Exosuit Interface",
    client: "Rehabilitation lab, partner clinic",
    year: "2022",
    category: "Embodiment",
    summary:
      "The control and feedback interface for a lower-limb exosuit used in gait rehabilitation — designed with physical therapists and patients together.",
    body: [
      "Most exosuit controls are built for engineers, not for someone recovering their ability to walk. We redesigned the interface around three audiences at once: the patient wearing it, the therapist adjusting it, and the device quietly logging progress.",
      "The patient-facing surface is just three buttons and a single light. Everything else — assist level, step symmetry, session history — lives in a therapist view that updates live during a session.",
      "The clinic now onboards new patients to the device in one session instead of three.",
    ],
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "open-interaction-kit",
    title: "Open Interaction Kit",
    client: "Open source",
    year: "2021",
    category: "Tools & systems",
    summary:
      "A free SDK and Figma kit for gesture and voice interaction patterns, built so small teams could prototype spatial interfaces without a research budget.",
    body: [
      "I built the first version for myself, because I was tired of rebuilding the same gesture-recognition scaffolding for every new prototype.",
      "Released it publicly with documentation written for designers, not just engineers. It now has contributors on three continents and is used in a handful of university HCI courses.",
    ],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "quiet-alerts",
    title: "Quiet Alerts",
    client: "Accessibility-focused startup",
    year: "2020",
    category: "Accessibility",
    summary:
      "A haptic notification language for a hearing-assistance wearable — translating six categories of sound into distinct, learnable vibration patterns.",
    body: [
      "Standard buzz-buzz notifications can't distinguish a doorbell from a smoke alarm, which matters a great deal if sound is your only cue that something happened.",
      "We designed six distinct vibration 'words' — rhythm, not just intensity — tested for correct recognition after a single five-minute training session.",
      "97% of testers could correctly identify all six patterns a week later with no retraining.",
    ],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "ambient-consent",
    title: "Ambient Consent",
    client: "Research & writing",
    year: "2019",
    category: "Research",
    summary:
      "A framework and public essay series on what meaningful consent looks like when sensors are always on — now referenced in two university syllabi.",
    body: [
      "Ambient and always-on sensing breaks the usual consent pattern of a single click before use. This project proposed 'layered consent' — ambient, ongoing signals of what's being sensed, paired with occasional, specific checkpoints for anything higher-stakes.",
      "Published as a five-part essay series, later adapted into a workshop format taught at two design schools.",
    ],
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
  },
];

export const talks: Talk[] = [
  {
    org: "ETH Zürich",
    role: "Guest Lecture",
    year: "2024",
    topic: "Embodied Interaction & Spatial Legibility in Post-Screen Computing",
  },
  {
    org: "Lisbon Design Week",
    role: "Workshop Lead",
    year: "2023",
    topic: "Designing for Semi-Autonomous Agents: Reversibility & Consent",
  },
  {
    org: "Royal College of Art",
    role: "Studio Critique & Jury",
    year: "2023",
    topic: "Wearable Bio-Sensing and the Ethics of Continuous Calibration",
  },
  {
    org: "MIT Media Lab",
    role: "Invited Panelist",
    year: "2022",
    topic: "Haptic Grammars for Human-Robot Physical Collaboration",
  },
];

export const essays: Essay[] = [
  {
    slug: "ambient-consent",
    title: "Ambient Consent: Designing for Always-On Sensing",
    subtitle: "A five-part framework for sensory transparency when devices fade into walls, skin, and fabric.",
    date: "October 2024",
    readTime: "12 min read",
    category: "Ethics & Spatial Computing",
    abstract: "The traditional web paradigm of a single modal click to grant permission completely fails when sensing is ambient, continuous, and physical. In this essay, we outline five tiers of ambient consent: peripheral awareness, passive disclosure, active checkpoints, continuous calibration, and irrevocable revocation.",
    body: [
      "When a camera was a distinct black box on a tripod with a red tally lamp, everyone in the room intuitively understood the state of observation. The visual grammar of being recorded was built directly into the physical mass of the hardware.",
      "Ambient computing removes that mass. Wearable cameras look like tortoiseshell spectacles; acoustic beamformers hide inside ceiling plaster; micro-radar transceivers nestle behind wallpaper. In a world where sensing hardware disappears, how do we prevent trust from disappearing with it?",
      "The answer is not a longer terms-of-service agreement or an intrusive pop-up dialog. We need 'layered consent' — continuous, peripheral physical affordances that subtly whisper system state without shouting, coupled with hard mechanical stops for critical boundaries.",
      "In this series, we propose three core criteria for evaluating ambient sensors: legibility at a glance, proportional feedback (the louder the perception, the more salient the display), and effortless bodily revocation.",
    ],
  },
  {
    slug: "reversible-ai-actions",
    title: "Notes on Designing Reversible AI Actions",
    subtitle: "Why human-agent collaboration succeeds or fails on the mechanics of 'undo' rather than the brilliance of inference.",
    date: "June 2024",
    readTime: "8 min read",
    category: "Agent Interaction Design",
    abstract: "As autonomous software agents transition from generating textual suggestions to actively performing state-altering workflows (booking travel, sending emails, issuing financial trades), user anxiety spikes. We examine why confidence bars don't help, and how three-phase reversible execution restores user agency.",
    body: [
      "Most product teams believe people want their AI assistant to be smarter. But in usability trials with semi-autonomous agents, user hesitation rarely comes from doubt about the model's raw intelligence — it comes from fear of irreversible side effects.",
      "If clicking 'Approve' triggers an email that cannot be unsent, an API call that cannot be rolled back, or a database migration that overwrites historical rows, the user will spend more time scrutinizing the agent's work than doing the work themselves. The cognitive overhead exceeds the automation savings.",
      "Trust is not earned by sounding confident; trust is earned by making failure cheap. When an action is guaranteed to be reversible for five minutes with a single physical keypress, users delegate freely and boldly.",
      "We unpack the four essential states of reversible agency: Intention Proposal, Reversible Staging, Grace-Period Execution, and Transparent Audit Trail.",
    ],
  },
  {
    slug: "tactile-syntax",
    title: "Tactile Syntax: Haptic Grammars for Ambient Wearables",
    subtitle: "Moving beyond binary buzzes toward rich, learnable vibration vocabularies.",
    date: "February 2024",
    readTime: "10 min read",
    category: "Haptic Architecture",
    abstract: "A study in designing six distinct haptic primitives (swell, tap, stutter, sweep, breathe, and snap) capable of communicating complex urgency and spatial direction through micro-linear actuators without looking at a screen.",
    body: [
      "Human skin is our largest sensory organ, packed with hundreds of thousands of mechanoreceptors capable of discerning micro-frequency variations, tactile friction, and wave propagation speeds. Yet in 99% of consumer hardware, haptics are reduced to a generic buzz for incoming notifications.",
      "In our fieldwork with visually impaired navigators and surgical nurses, we mapped six distinct vibration words based on natural acoustic envelopes. Instead of varying only amplitude, we shaped attack, decay, sustain, and release curves.",
      "The resulting syntax demonstrated a 97% recognition accuracy across multi-session recall tests. When haptics feel like language rather than an alarm, users can stay present in the physical world without being torn away by a glass rectangle.",
    ],
  },
  {
    slug: "embodied-trust",
    title: "Embodied Trust: Why Screenless Interfaces Demand New Mental Models",
    subtitle: "What physical industrial robots teach us about designing everyday AI interfaces.",
    date: "November 2023",
    readTime: "14 min read",
    category: "Philosophy of Interaction",
    abstract: "Physical proximity alters human psychology. When an AI system occupies physical space — moving a robotic arm, driving a vehicle, or speaking into an ear canal — users evaluate trust through proprioception and kinesthetics, not GUI logic.",
    body: [
      "Software interaction design has spent thirty years in the Cartesian plane of flat pixels, rectangular bounding boxes, and mouse clicks. When an interface fails on a screen, the worst consequence is a frozen cursor or an erroneous modal dialog.",
      "In physical robotics and embodied computing, interface failures have inertia. A robotic limb moves real mass; an autonomous forklift exerts kinetic force; an exoskeleton applies torque directly to a person's femur.",
      "Designing for embodiment requires interaction designers to adopt the mindset of an architect or a choreographer. We must design for body language, spatial intention cues, anticipatory deceleration, and readable kinetic trajectories.",
    ],
  },
];

export const writing = [
  { title: "Ambient Consent, a five-part series", href: "/writing#ambient-consent" },
  { title: "Notes on designing reversible AI actions", href: "/writing#reversible-ai-actions" },
  { title: "Tactile Syntax: Haptic Grammars for Ambient Wearables", href: "/writing#tactile-syntax" },
  { title: "Embodied Trust: Screenless Interfaces", href: "/writing#embodied-trust" },
];
