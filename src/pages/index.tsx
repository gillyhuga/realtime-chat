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
      <main className="relative  max-w-[768px] mx-auto">
        <div className="navbar rounded-b-lg bg-base-300 z-50 flex justify-center fixed top-0 left-0 right-0 max-w-[768px] w-full mx-auto">
          <a className="btn btn-ghost normal-case text-xl">Gilech Chat Room</a>
        </div>
        <Chat />
      </main>
    </div>
  );
};

export default Home;