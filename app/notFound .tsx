import { notFound } from 'next/navigation';

export default function Home() {
  notFound();
  return (
    <div>
      <h1>TEST</h1>
    </div>
  );
}