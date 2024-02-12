import React from 'react';
import Head from 'next/head';
import MyAppBar from '../components/appbar/appbar';
import MyFooter from '../components/footer/footer';
import Page from './page';

const Index = () => {
  return (
    <>
      <Head>
        <title>Memory Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyAppBar />
      <div style={{ flexGrow: 1 }}>
        <Page />
      </div>
      <MyFooter />
    </>
  );
};

export default Index;
