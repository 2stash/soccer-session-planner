import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
const Sidebar = ({ setToEditing }) => {
  return (
    <>
      <aside
        id='logo-sidebar'
        className='fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800'>
          <ul className='space-y-2 font-medium'>
            <li>
              <a
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <span className='ms-3'>Dashboard</span>
              </a>
            </li>
            <li>
              <Link
                to='/session'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <span
                  className='flex-1 ms-3 whitespace-nowrap'
                  onClick={() => setToEditing(-1)}
                >
                  Sessions
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
