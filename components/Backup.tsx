import Image from "next/image";

export type Shot = { src: string; alt: string; caption: string; width: number; height: number };

// 시연이 안 될 때(서버가 늦거나 끊김) 펼쳐 보여 줄 리허설 캡처
export default function Backup({ title, shots }: { title: string; shots: Shot[] }) {
  return (
    <details className="backup">
      <summary>{title}</summary>
      <div className="backup-grid">
        {shots.map((s) => (
          <figure key={s.src} className="shot">
            <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 720px) 100vw, 520px" />
            <figcaption>{s.caption}</figcaption>
          </figure>
        ))}
      </div>
    </details>
  );
}
