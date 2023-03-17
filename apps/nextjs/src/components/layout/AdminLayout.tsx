import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BiMessageDetail } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosNotifications } from "react-icons/io";
import {
  IoAppsSharp,
  IoLogOutOutline,
  IoPeopleCircle,
  IoSettings,
} from "react-icons/io5";
import { MdDashboard, MdSecurity } from "react-icons/md";
import { RiSuitcaseFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";

interface AdminLayoutProps {
  children: JSX.Element;
}

const CIRCLE_BUTTON_CLASSNAMES =
  "btn btn-circle hover:bg-purple-400 bg-transparent border-none";

const MENUS = [
  {
    icon: <MdDashboard size={25} color="#FFFFFF" />,
    name: "Dashboard",
  },
  {
    icon: <IoAppsSharp size={25} color="#FFFFFF" />,
    name: "Apps",
  },
  {
    icon: <MdSecurity size={25} color="#FFFFFF" />,
    name: "Security",
  },
  {
    icon: <TbReportAnalytics size={25} color="#FFFFFF" />,
    name: "Reports",
  },
  {
    icon: <IoPeopleCircle size={25} color="#FFFFFF" />,
    name: "Users",
  },
  {
    icon: <RiSuitcaseFill size={25} color="#FFFFFF" />,
    name: "Teams",
  },
  {
    icon: <BiMessageDetail size={25} color="#FFFFFF" />,
    name: "Messages",
  },
  {
    icon: <IoSettings size={25} color="#FFFFFF" />,
    name: "Settings",
  },
  {
    icon: <IoLogOutOutline size={25} color="#FFFFFF" />,
    name: "Logout",
  },
];
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [showFullMenu, setShowFullMenu] = useState<boolean>(false);
  return (
    <div className="h-screen w-full">
      <div className="sticky top-0 flex flex-row items-center justify-between rounded-t-none rounded-b-3xl bg-purple-600  p-3 shadow-xl md:top-4  md:rounded-full lg:m-4 lg:px-8 ">
        <div className="flex flex-row items-center gap-2">
          <motion.button className={CIRCLE_BUTTON_CLASSNAMES + " lg:hidden "}>
            <GiHamburgerMenu size={25} color="#FFFFFF" />
          </motion.button>
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            whileHover={{
              scale: 1.3,
              originX: 0,
            }}
            transition={{ type: "spring" }}
            className="cursor-pointer text-2xl font-black text-white"
          >
            Admin Panel
          </motion.div>
        </div>
        <div className="hidden items-center gap-10 md:flex">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-circle border-none bg-transparent outline-none hover:bg-purple-400"
            >
              <div className="indicator">
                <span className="indicator-item badge-xs badge badge-primary text-white"></span>
                <IoIosNotifications size={25} color="#FFFFFF" />
              </div>
            </label>
            <div
              tabIndex={1}
              className="dropdown-content min-h-16  card card-compact text-primary-content mt-4 w-80 bg-purple-600 p-2 shadow"
            >
              {/* <div className="card-body">
                <h3 className="card-title">Card title!</h3>
                <p>you can use any element as a dropdown.</p>
              </div> */}
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-circle border-none bg-transparent outline-none hover:bg-purple-400"
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box mt-4 w-52 bg-purple-600 p-2 shadow"
            >
              <li>
                <a className="flex items-center gap-2 font-semibold text-white hover:bg-purple-400">
                  <IoSettings size={30} color="#FFFFFF" />
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      originX: 0,
                      transition: {
                        duration: 0.3,
                      },
                    }}
                  >
                    Settings
                  </motion.div>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 font-semibold text-white hover:bg-purple-400">
                  <IoLogOutOutline size={25} color="#FFFFFF" />
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      originX: 0,
                      transition: {
                        duration: 0.3,
                      },
                    }}
                  >
                    Logout
                  </motion.div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-row ">
        <motion.div
          onHoverStart={() => {
            setShowFullMenu(true);
          }}
          onHoverEnd={() => {
            setShowFullMenu(false);
          }}
          className={`sticky top-[110px] hidden h-fit w-fit flex-col gap-2 bg-purple-600 p-3 lg:flex ${
            showFullMenu ? "rounded-lg" : "rounded-full delay-500 duration-500 "
          } lg:ml-4`}
        >
          {MENUS.map((menu, idx) => (
            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: ((idx + 1) * 2) / 20,
                bounce: 500,
                damping: 300,
              }}
              className="flex cursor-pointer flex-row items-center gap-2  rounded-lg hover:bg-purple-400 "
              key={idx}
            >
              <button className={CIRCLE_BUTTON_CLASSNAMES}>{menu.icon}</button>
              <AnimatePresence>
                {showFullMenu && (
                  <motion.div
                    initial={{
                      x: -50,
                    }}
                    animate={{
                      x: 0,
                    }}
                    exit={{
                      x: -50,
                      transition: {
                        duration: 0.2,
                      },
                    }}
                    transition={{
                      duration: (2 * (idx + 1)) / 50,
                      bounce: 500,
                      damping: 300,
                    }}
                    whileHover={{
                      scale: 1.2,
                    }}
                    className="pr-4 font-semibold text-white"
                  >
                    {menu.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        <div className="scrollbar-hide h-[90vh] w-full overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
