import React from 'react';

interface HeaderProps {
  users: number;
}

const Header: React.FC<HeaderProps> = ({ users }) => {
  return (
    <div className="navbar rounded-b-lg bg-base-300 z-50 flex justify-center fixed top-0 left-0 right-0 max-w-[768px] w-full mx-auto">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Chat Room</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-ghost normal-case">
          <div className="badge badge-outline">
            <span className="loading loading-ring loading-xs mr-2"></span> {users} Online
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
