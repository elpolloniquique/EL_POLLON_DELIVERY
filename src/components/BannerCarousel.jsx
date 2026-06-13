import { useState, useEffect } from 'react';

export default function BannerCarousel({ banners }) {
  const [index, setIndex] = useState(0);
  const list = banners?.length ? banners : [{ image_url: '/img/oferton mas chaufa.png', title: 'El Pollón', subtitle: 'Pollo a la brasa' }];

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), 4000);
    return () => clearInterval(t);
  }, [list.length]);

  const current = list[index];

  return (
    <section className="relative rounded-3xl overflow-hidden shadow-card aspect-[16/9] mx-4 mt-4">
      <img
        src={current.image_url}
        alt={current.title || 'Banner'}
        className="w-full h-full object-cover transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h2 className="font-display text-2xl tracking-wide">{current.title}</h2>
        {current.subtitle && <p className="text-sm text-white/80">{current.subtitle}</p>}
      </div>
      <div className="absolute bottom-2 right-4 flex gap-1">
        {list.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition ${i === index ? 'bg-pollon-gold w-4' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
