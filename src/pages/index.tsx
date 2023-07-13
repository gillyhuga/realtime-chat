import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat';

const Home: React.FC = () => {
  const [users, setUsers] = useState([]);

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
      <main className="relative  max-w-[768px] mx-auto">
        <div className="navbar rounded-b-lg bg-base-300 z-50 flex justify-center fixed top-0 left-0 right-0 max-w-[768px] w-full mx-auto">

          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Gilech Chat Room</a>
          </div>
          <div className="flex-none">

            <button className="btn btn-ghost normal-case">
              <div className="badge badge-outline"><span className="loading loading-ring loading-xs mr-2"></span> {users} Online</div>
            </button>
          </div>

        </div>
        <Chat />
      </main>
    </div>
  );
};

export default Home;
