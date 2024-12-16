import { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaSpotify, FaGithub, FaEnvelope } from 'react-icons/fa';
import Email from './Email';
import VanillaTilt from 'vanilla-tilt';

const Socials = () => {
  const [isEmailPopupOpen, setEmailPopupOpen] = useState(false);
  const emailPopupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailPopupRef.current && !emailPopupRef.current.contains(event.target as Node)) {
        setEmailPopupOpen(false);
      }
    };

    if (isEmailPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEmailPopupOpen]);

  useEffect(() => {
    if (emailPopupRef.current) {
      VanillaTilt.init(emailPopupRef.current, {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      });
    }
  }, [isEmailPopupOpen]);

  const toggleEmailPopup = () => {
    setEmailPopupOpen(!isEmailPopupOpen);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex gap-6 items-center">
        <a
          href="https://www.linkedin.com/in/xuolynn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-blue-500 transition-colors"
        >
          <FaLinkedin size={30} />
        </a>

        <a
          href="https://github.com/xuolynn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-gray-700 transition-colors"
        >
          <FaGithub size={32} />
        </a>
        
        <a
          href="https://open.spotify.com/user/22lrnz7y4nsfca3lzflobn7gi?si=1540dc121f9d43cc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-green-500 transition-colors"
        >
          <FaSpotify size={30} />
        </a>
        

        <button
          onClick={toggleEmailPopup}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-md transition-colors"
        >
          <FaEnvelope size={30} />
          <span>Email Me</span>
        </button>
      </div>
      {isEmailPopupOpen && (
        <div
          ref={emailPopupRef}
          className="popup bg-black bg-opacity-45 backdrop-blur-md rounded-2xl p-4 shadow-lg mt-4 relative animate-fadeIn"
        >
          <Email />
        </div>
      )}
    </div>
  );
};

export default Socials;
