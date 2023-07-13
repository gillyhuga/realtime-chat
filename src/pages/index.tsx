import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import Header from '../components/Header';

const Home: React.FC = () => {
  const [users, setUsers] = useState<number>(0);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data.memberCount))
      .catch((error) => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <Head>
        <title>Realtime Chat App</title>
      </Head>
      <main className="relative max-w-[768px] mx-auto">
        <Header users={users} />
        <Chat />
      </main>
    </div>
  );
};

export default Home;
