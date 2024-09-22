'use client';

import { MenuContext } from '@/context/MenuContext';
import React, { useContext, useEffect, useState } from 'react';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import UserAreaSelectBox from './UserAreaSelectBox';
import LanguageSelectBox from './LanguageSelectBox';

const MainHeader = () => {
  const initialTheme =
    typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';
  const [theme, setTheme] = useState(initialTheme);
  const { toggle } = useContext(MenuContext);

  const themeSwitchHandler = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className='bg-white dark:bg-slate-800 dark:text-white flex justify-between items-center px-4 h-12 mb-4'>
      <div><h1 className='text-2xl font-bold'>Brand</h1></div>
      <div className='flex justify-center items-center gap-3'>
        {theme === 'light' ? (
          <FaMoon
            className='cursor-pointer'
            onClick={() => themeSwitchHandler('dark')}
          />
        ) : (
          <FaSun
            className='cursor-pointer'
            onClick={() => themeSwitchHandler('light')}
          />
        )}

        <div>
          <LanguageSelectBox />
        </div>
        <div onClick={toggle} className='lg:hidden'>
          <FaBars className='cursor-pointer' />
        </div>
        <div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
              <span className="text-sm font-bold">U</span>
            </div>
            <UserAreaSelectBox />
          </div>  
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
