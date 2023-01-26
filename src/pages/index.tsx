import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Booking Car | Company X</title>
        <meta
          name="description"
          content="Reserve the company car with just a few clicks!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.Container}></main>
    </>
  );
}
