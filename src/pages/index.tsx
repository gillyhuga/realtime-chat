import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

const Chat = dynamic(() => import('../components/Chat'), { ssr: false });

const Home: React.FC = () => {
  return (
    <div className="container mx-auto">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Head>
        <title>Realtime Chat App</title>
      </Head>
      <main className="relative">

        <h1 className="title font-bold text-lg flex justify-center items-center h-20 m-0 fixed top-0 left-0 right-0 bg-transparent backdrop-filter backdrop-blur-md ">
          <div className=" bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 h-60 blur-2xl opacity-30 -mt-40  absolute w-full top-0 z-10"></div>
          Gilech Chat Room
        </h1>
        <Chat />
      </main>
    </div>
  );
};

export default Home;