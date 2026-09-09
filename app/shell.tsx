import Link from 'next/link';
import { Sparkles, ArrowUpRight, Orbit } from 'lucide-react';
export function Stars(){return <div className="starfield" aria-hidden="true">{Array.from({length:72},(_,i)=><i key={i} style={{left:`${(i*37.7)%100}%`,top:`${(i*19.3)%100}%`,opacity:.15+(i%5)*.12,animationDelay:`-${i%9}s`,width:i%13===0?3:1.5,height:i%13===0?3:1.5}}/>)}</div>}
export function Header(){return <header className="header"><Link className="wordmark" href="/"><Sparkles size={24} strokeWidth={1.2}/> elsewhere<span className="wordmark-dot">.</span></Link><nav aria-label="Main navigation"><Link href="/demo">Explore a universe <ArrowUpRight size={15}/></Link><Link href="/profile" className="nav-saved"><Orbit size={16}/> My universes</Link></nav></header>}
export function Footer(){return <footer className="footer"><span>Fiction, not fate. An imaginative experience, never a prediction.</span><span>Made of moments. And maybes.</span></footer>}
