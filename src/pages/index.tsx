import Head from 'next/head';
import { Roboto } from '@next/font/google';
import { cc } from '@/utils/combineClassNames';

const robotoFont = Roboto({
  weight: '400',
  subsets: ['latin'],
});

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
      <main
        className={cc([
          robotoFont.className,
          `w-screen min-h-screen flex flex-col items-center justify-center`,
        ])}
      >
        Hello World!
      </main>
    </>
  );
}
