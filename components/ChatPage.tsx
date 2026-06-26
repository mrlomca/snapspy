import React, { useEffect, useMemo, useState } from 'react';
import {
  Search, Users, MoreHorizontal, MessageSquare, MessageCircle, Smile, UserPlus, Plus,
  Camera, X, MapPin, Play, Signal, Wifi, BatteryFull, SquarePen, Video,
} from 'lucide-react';

// Uploaded profile pictures — b* male, g* female (g2 = me).
import b1 from '../images/b1.png';
import b2 from '../images/b2.png';
import b3 from '../images/b3.png';
import g1 from '../images/g1.png';
import g2 from '../images/g2.png';
import g3 from '../images/g3.png';
import g4 from '../images/g4.png';
import g5 from '../images/g5.png';

/* ------------------------------------------------------------------ */
/*  Avatars with a deterministic initials fallback                     */
/* ------------------------------------------------------------------ */

const FALLBACK_COLORS = ['#FF6B6B', '#4FC3F7', '#9C6ADE', '#34C759', '#FF9F45', '#F368A0', '#5C7CFA', '#26C6DA'];
const colorFor = (name: string) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
};

const Avatar: React.FC<{ src?: string; name: string; size?: number }> = ({ src, name, size = 52 }) => {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        className="rounded-full object-cover bg-gray-100 shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name.replace('@', '').split(/[\s_]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Edvard's live typing — types, deletes, retypes, then loops         */
/* ------------------------------------------------------------------ */

const SNAP_BLUE = '#1FA1FF';

const buildTypingFrames = () => {
  const frames: { text: string; delay: number }[] = [];
  const typeOut = (str: string, base: number, jitter: number) => {
    const chars = [...str];
    let s = '';
    for (const ch of chars) {
      s += ch;
      frames.push({ text: s, delay: base + Math.random() * jitter });
    }
    return s;
  };

  // 1) types a regrettable message
  let s = typeOut('yesterday I slept with...', 60, 55);
  frames.push({ text: s, delay: 1400 }); // hesitates

  // 2) changes his mind — deletes everything
  let arr = [...s];
  while (arr.length) {
    arr.pop();
    frames.push({ text: arr.join(''), delay: 32 });
  }
  frames.push({ text: '', delay: 450 });

  // 3) types what he really means
  s = typeOut('I love you babe 😍', 75, 60);
  frames.push({ text: s, delay: 4200 }); // holds before looping

  return frames;
};

const LiveTyping: React.FC = () => {
  const frames = useMemo(buildTypingFrames, []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setIdx((i) => (i + 1) % frames.length), frames[idx].delay);
    return () => clearTimeout(id);
  }, [idx, frames]);

  return (
    <span className="text-[14px] leading-tight" style={{ color: SNAP_BLUE }}>
      {frames[idx].text}
      <span
        className="inline-block w-[1.5px] h-[13px] ml-[1px] align-middle animate-blink"
        style={{ background: SNAP_BLUE }}
      />
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Status indicators                                                  */
/* ------------------------------------------------------------------ */

const Square: React.FC<{ color: string; filled?: boolean }> = ({ color, filled = true }) => (
  <span
    className="inline-block w-[13px] h-[13px] rounded-[3px] shrink-0"
    style={filled ? { background: color } : { border: `2px solid ${color}` }}
  />
);

type Kind = 'typing' | 'snap' | 'snapAudio' | 'chat' | 'screenRecord' | 'sayHi' | 'tapToChat';
type RightAction = 'camera' | 'chat' | 'x' | 'snapPill' | null;

interface Convo {
  id: string;
  name: string;
  img: string;
  kind: Kind;
  time?: string;
  right: RightAction;
}

// Ordered most-recent first; the "new friend" rows (no timestamp) sit at the bottom.
const CONVOS: Convo[] = [
  { id: 'edvard',   name: 'Edvard',          img: b1, kind: 'typing',       right: 'camera' },
  { id: 'yasmin',   name: 'Yasmin Chiquita', img: g1, kind: 'screenRecord', time: '12m', right: 'camera' },
  { id: 'vivian',   name: 'Vivian 🧸🍭🎀',     img: g3, kind: 'chat',         time: '1d',  right: 'x' },
  { id: 'vinay',    name: 'Mr_vinay07',      img: b2, kind: 'snap',         time: '2w',  right: 'chat' },
  { id: 'ann',      name: 'Ann Tiana',       img: g4, kind: 'snapAudio',    time: '4w',  right: 'chat' },
  { id: 'g59',      name: 'G59',             img: b3, kind: 'sayHi',        right: 'snapPill' },
  { id: 'jolynn',   name: 'Jolynn Green',    img: g5, kind: 'tapToChat',    right: 'camera' },
  { id: 'karie',    name: 'Karie Debrah',    img: g1, kind: 'tapToChat',    right: 'camera' },
];

const Status: React.FC<{ c: Convo }> = ({ c }) => {
  const time = c.time ? <span className="text-gray-400 font-normal"> · {c.time}</span> : null;
  switch (c.kind) {
    case 'typing':
      return <LiveTyping />;
    case 'snap':
      return (
        <span className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: '#F23B57' }}>
          <Square color="#F23B57" /> New Snap {time}
        </span>
      );
    case 'snapAudio':
      return (
        <span className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: '#B05CE6' }}>
          <Square color="#B05CE6" /> New Snap {time}
        </span>
      );
    case 'chat':
      return (
        <span className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: '#1FA1FF' }}>
          <Square color="#1FA1FF" /> New Chat {time}
        </span>
      );
    case 'screenRecord':
      return (
        <span className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: '#15A07A' }}>
          <Video size={14} strokeWidth={2.4} /> Screen recording {time}
        </span>
      );
    case 'sayHi':
      return (
        <span className="flex items-center gap-1.5 text-[14px] text-gray-400 font-normal">
          <Square color="#C7CBD1" filled={false} /> Say Hi!
        </span>
      );
    case 'tapToChat':
    default:
      return (
        <span className="flex items-center gap-1.5 text-[14px] text-gray-400 font-normal">
          <Square color="#C7CBD1" filled={false} /> Tap to chat
        </span>
      );
  }
};

const RightIcon: React.FC<{ action: RightAction; onDismiss: () => void }> = ({ action, onDismiss }) => {
  switch (action) {
    case 'camera':
      return <Camera size={22} className="text-gray-400" strokeWidth={1.8} />;
    case 'chat':
      return <MessageSquare size={21} className="text-gray-400" strokeWidth={1.8} />;
    case 'x':
      return (
        <button onClick={onDismiss} className="text-gray-400 active:scale-90 transition-transform p-1">
          <X size={20} strokeWidth={2.2} />
        </button>
      );
    case 'snapPill':
      return (
        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-[13px] font-bold px-3.5 py-1.5 rounded-full">
          <Camera size={15} strokeWidth={2.2} /> Snap
        </span>
      );
    default:
      return null;
  }
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const FILTER_CHIPS = [
  { icon: <Users size={19} strokeWidth={2} />, key: 'groups' },
  { icon: <MessageSquare size={19} strokeWidth={2} />, key: 'unread' },
  { icon: <MessageCircle size={19} strokeWidth={2} />, key: 'chats' },
  { icon: <Smile size={20} strokeWidth={2.2} />, key: 'friends', active: true },
  { icon: <UserPlus size={19} strokeWidth={2} />, key: 'add' },
  { icon: <Plus size={20} strokeWidth={2.2} />, key: 'new' },
];

const ChatPage: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const list = CONVOS.filter((c) => !dismissed.includes(c.id));

  return (
    <div className="font-snap min-h-screen w-full flex justify-center bg-neutral-200">
      <div className="relative w-full max-w-[440px] bg-white min-h-screen flex flex-col text-black">

        {/* Status bar */}
        <div className="relative flex items-center justify-between px-7 pt-3 pb-1 text-[15px] font-semibold select-none">
          <span>8:38</span>
          <div className="flex items-center gap-1.5">
            <Signal size={16} strokeWidth={2.4} className="fill-black" />
            <Wifi size={16} strokeWidth={2.4} />
            <BatteryFull size={22} strokeWidth={1.6} />
          </div>
        </div>

        {/* Header */}
        <header className="relative flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Avatar src={g2} name="Me" size={34} />
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform">
              <Search size={19} strokeWidth={2.4} className="text-gray-700" />
            </button>
          </div>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-[19px] font-bold">Chat</h1>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform">
              <Users size={19} strokeWidth={2.2} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FFFC00] text-black text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                15
              </span>
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform">
              <MoreHorizontal size={19} strokeWidth={2.4} className="text-gray-700" />
            </button>
          </div>
        </header>

        {/* Filter chips */}
        <div className="flex items-center justify-between px-4 py-2 gap-2">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.key}
              className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform ${
                chip.active ? 'bg-[#FFFC00] text-black' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {chip.icon}
            </button>
          ))}
        </div>

        {/* Notification banner */}
        {showBanner && (
          <div className="mx-3 my-1.5 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gray-50">
            <span className="text-2xl leading-none">📬</span>
            <div className="flex-1">
              <p className="text-[14px] font-bold leading-tight">Get notifications for new Snaps?</p>
              <p className="text-[12px] text-gray-500 leading-tight">Tap to enable notifications</p>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-gray-400 p-1 active:scale-90 transition-transform">
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>
        )}

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {list.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 active:bg-gray-50 transition-colors">
              <Avatar src={c.img} name={c.name} size={52} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[16px] leading-tight truncate">{c.name}</div>
                <div className="mt-0.5 truncate">
                  <Status c={c} />
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                <RightIcon action={c.right} onDismiss={() => setDismissed((d) => [...d, c.id])} />
              </div>
            </div>
          ))}
        </div>

        {/* Floating new-chat button */}
        <button className="absolute right-4 bottom-24 w-[52px] h-[52px] rounded-full bg-[#1FA1FF] shadow-lg shadow-blue-500/30 flex items-center justify-center text-white active:scale-90 transition-transform">
          <SquarePen size={22} strokeWidth={2.2} />
        </button>

        {/* Bottom navigation */}
        <nav className="absolute bottom-0 inset-x-0 max-w-[440px] mx-auto bg-white border-t border-gray-100 px-6 pt-2 pb-5 flex items-center justify-between">
          <button className="p-2 text-gray-400 active:scale-90 transition-transform"><MapPin size={26} strokeWidth={1.9} /></button>
          <button className="relative p-2 text-black active:scale-90 transition-transform">
            <MessageSquare size={26} strokeWidth={2.2} className="fill-black" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1FA1FF] ring-2 ring-white" />
          </button>
          <button className="w-[60px] h-[60px] rounded-full border-[3px] border-gray-300 bg-white -mt-4 active:scale-95 transition-transform flex items-center justify-center">
            <span className="w-[46px] h-[46px] rounded-full border-2 border-gray-200" />
          </button>
          <button className="p-2 text-gray-400 active:scale-90 transition-transform"><Users size={26} strokeWidth={1.9} /></button>
          <button className="p-2 text-gray-400 active:scale-90 transition-transform"><Play size={26} strokeWidth={1.9} /></button>
        </nav>
      </div>
    </div>
  );
};

export default ChatPage;
