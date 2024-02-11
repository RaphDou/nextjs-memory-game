import Head from 'next/head';
import MyAppBar from '../components/appbar/appbar';
import MyFooter from '../components/footer/footer';
import Page from './page';

export default function Game() {
  return (
    <div>
      <Head>
        <title>Memory Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyAppBar />
      <main>
        <Page />
      </main>
      <MyFooter />
    </div>
  );
}