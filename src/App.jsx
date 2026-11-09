import { useEffect, useMemo, useState } from 'react';
import { cats, rarityWeights } from './cats';

const copy = {
 ru:{home:'Главная',collection:'Коллекция',games:'Мини-игры',title:'Добро пожаловать в Cat Collection',subtitle:'Открывай карточки, собирай редких котят и пополняй свою коллекцию.',spin:'Открыть рулетку · 50 🪙',cost:'Стоимость открытия — 50 монет',recent:'Последняя находка',empty:'Пока ничего не выпало',count:'Собрано',play:'Играть',earn:'Нажимай на котика и собирай лапки!',start:'Начать мини-игру',finish:'Забрать награду',coins:'Монеты',all:'Все',found:'Найден',unknown:'Ещё не найден',duplicate:'Дубликат! Начислено 10 монет.',won:'Новый котёнок!',need:'Не хватает монет. Сыграй в мини-игру.',again:'Попробовать снова',rarity:{common:'Обычный',uncommon:'Необычный',rare:'Редкий',epic:'Эпический',legendary:'Легендарный'}},
 en:{home:'Home',collection:'Collection',games:'Mini-games',title:'Welcome to Cat Collection',subtitle:'Open cards, discover rare cats and grow your collection.',spin:'Open roulette · 50 🪙',cost:'Opening costs 50 coins',recent:'Latest discovery',empty:'Nothing discovered yet',count:'Collected',play:'Play',earn:'Tap the kitty and collect paw points!',start:'Start mini-game',finish:'Claim reward',coins:'Coins',all:'All',found:'Discovered',unknown:'Not discovered',duplicate:'Duplicate! 10 coins added.',won:'New kitty!',need:'Not enough coins. Play a mini-game.',again:'Try again',rarity:{common:'Common',uncommon:'Uncommon',rare:'Rare',epic:'Epic',legendary:'Legendary'}}
};
function safeLoad(){
  try {
    const raw=JSON.parse(localStorage.getItem('cat-collection-save')||'{}');
    const owned=raw.owned&&typeof raw.owned==='object'&&!Array.isArray(raw.owned)?raw.owned:{};
    const clean={};
    for(const cat of cats){const n=Number(owned[cat.id]||0);if(Number.isInteger(n)&&n>0&&n<100000)clean[cat.id]=n;}
    const coins=Number(raw.coins);
    return {coins:Number.isFinite(coins)&&coins>=0?Math.min(Math.floor(coins),1000000):250,owned:clean};
  } catch { return {coins:250,owned:{}}; }
}
export default function App(){
  const [lang,setLang]=useState(()=>{try{return localStorage.getItem('cat-lang')==='en'?'en':'ru';}catch{return 'ru';}});
  const [page,setPage]=useState('home');
  const [save,setSave]=useState(safeLoad);
  const [last,setLast]=useState(null);
  const [message,setMessage]=useState('');
  const [spinning,setSpinning]=useState(false);
  const [taps,setTaps]=useState(0);
  const [playing,setPlaying]=useState(false);
  const t=copy[lang];
  const total=useMemo(()=>Object.values(save.owned).reduce((a,b)=>a+b,0),[save.owned]);
  useEffect(()=>{try{localStorage.setItem('cat-collection-save',JSON.stringify(save));}catch{setMessage('Не удалось сохранить прогресс в браузере.');}},[save]);
  useEffect(()=>{document.documentElement.lang=lang;try{localStorage.setItem('cat-lang',lang);}catch{}},[lang]);
  function weightedCat(){
    const roll=Math.random()*100;let sum=0;let rarity='common';
    for(const item of rarityWeights){sum+=item.weight;if(roll<sum){rarity=item.rarity;break;}}
    const pool=cats.filter(cat=>cat.rarity===rarity);
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function spin(){
    if(spinning)return;
    if(save.coins<50){setMessage(t.need);return;}
    setSpinning(true);setMessage('');
    setSave(old=>({...old,coins:old.coins-50}));
    window.setTimeout(()=>{
      const cat=weightedCat();setLast(cat);
      setSave(old=>{
        const duplicate=(old.owned[cat.id]||0)>0;
        return {coins:old.coins+(duplicate?10:0),owned:{...old.owned,[cat.id]:(old.owned[cat.id]||0)+1}};
      });
      setMessage((save.owned[cat.id]||0)>0?t.duplicate:t.won);
      setSpinning(false);
    },1100);
  }
  function startGame(){setTaps(0);setPlaying(true);setMessage('');}
  function claim(){if(!playing||taps<10)return;setSave(old=>({...old,coins:old.coins+25}));setPlaying(false);setMessage('+25 🪙');}
  const rarityLabel=r=>t.rarity[r];
  return <div className="app">
    <header className="topbar"><a className="brand" onClick={()=>setPage('home')}>🐾 <span>CAT <b>COLLECTION</b></span></a>
      <nav><button className={page==='home'?'active':''} onClick={()=>setPage('home')}>{t.home}</button><button className={page==='collection'?'active':''} onClick={()=>setPage('collection')}>{t.collection}</button><button className={page==='games'?'active':''} onClick={()=>setPage('games')}>{t.games}</button></nav>
      <div className="right"><span className="balance">🪙 {save.coins}</span><select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value)}><option value="ru">RU</option><option value="en">EN</option></select></div>
    </header>
    <main>
      {page==='home'&&<><section className="hero"><div><span className="eyebrow">A LITTLE MAGIC IN EVERY PACK</span><h1>{t.title}</h1><p>{t.subtitle}</p></div><div className="hero-cat">🐈‍⬛</div></section>
        <section className="panel roulette"><div className="section-head"><div><span className="eyebrow">MYSTERY PACK</span><h2>🎰 Roulette</h2></div><span className="cost">{t.cost}</span></div>
          <div className={'reel '+(spinning?'spinning':'')}><div className="reel-card">🐱</div><div className="reel-card selected">{last?last.emoji:'✨'}</div><div className="reel-card">🐈</div></div>
          <button className="primary" disabled={spinning} onClick={spin}>{spinning?'…':t.spin}</button>
          {message&&<p className="notice" role="status">{message}</p>}
        </section>
        <section className="panel latest"><h2>{t.recent}</h2>{last?<CatTile cat={last} label={rarityLabel(last.rarity)} count={save.owned[last.id]||1} lang={lang}/>:<div className="empty">{t.empty}</div>}</section>
      </>}
      {page==='collection'&&<><section className="page-heading"><span className="eyebrow">YOUR CAT ALBUM</span><h1>{t.collection}</h1><p>{t.count}: {Object.keys(save.owned).length} / {cats.length}</p><div className="progress"><span style={{width:(Object.keys(save.owned).length/cats.length*100)+'%'}}/></div></section><div className="cat-grid">{cats.map(cat=><CatTile key={cat.id} cat={cat} label={rarityLabel(cat.rarity)} count={save.owned[cat.id]||0} unknown={!save.owned[cat.id]} lang={lang}/>)}</div></>}
      {page==='games'&&<><section className="page-heading"><span className="eyebrow">PLAY TO EARN</span><h1>{t.games}</h1><p>{t.earn}</p></section><section className="panel mini-game"><div className="game-icon">🐾</div><h2>Tap the Kitty</h2><p>{t.earn}</p><div className="tap-count">{taps} / 10</div><button className="primary" onClick={playing?()=>setTaps(v=>Math.min(10,v+1)):startGame}>{playing?'🐾 TAP!':t.start}</button><button className="secondary" disabled={!playing||taps<10} onClick={claim}>{t.finish} · 25 🪙</button><p className="muted">10 taps = 25 coins</p></section>{message&&<p className="notice">{message}</p>}</>}
    </main>
    <footer>CAT COLLECTION · COLLECT THEM ALL</footer>
  </div>;
}
function CatTile({cat,label,count,unknown=false,lang='ru'}){
  return <article className={'cat-tile '+cat.rarity}><div className="cat-art">{unknown?'?':cat.emoji}</div><div className="cat-info"><span className="rarity">{label}</span><h3>{unknown?'???':(lang==='en'?cat.nameEn:cat.name)}</h3><p>{unknown?(lang==='en'?'Discover this card to reveal the cat.':'Открой карточку, чтобы узнать котёнка.'):(lang==='en'?cat.descriptionEn:cat.description)}</p><small>{unknown?(lang==='en'?'Not found':'Не найден'): '× '+count}</small></div></article>;
}