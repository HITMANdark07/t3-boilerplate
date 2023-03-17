import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";

interface PublicLayoutProps {
  children: JSX.Element;
}

const HEADER_LINKS = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Pricing",
    url: "/pricing",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];
const CIRCLE_BUTTON_CLASSNAMES =
  "btn btn-circle hover:bg-purple-400 bg-transparent border-none";

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="h-screen w-full">
      <div className="sticky top-0 m-0 flex  flex-row  items-center justify-between p-3  shadow-2xl lg:px-12 ">
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
            App Name
          </motion.div>
        </div>
        <div className="hidden gap-20 md:flex">
          {HEADER_LINKS.map((link, _idx) => (
            <motion.div
              initial={{
                x: 800,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: ((_idx + 1) * 2) / 10,
                bounce: 500,
                damping: 300,
              }}
              whileHover={{
                scale: 1.2,
                originX: 0,
                transition: {
                  duration: 0.2,
                },
              }}
              key={_idx}
              className="cursor-pointer rounded-full px-3 py-1 text-white hover:bg-purple-400"
            >
              <Link href={link.url}>{link.name}</Link>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-row ">
        <div className="scrollbar-hide h-[90vh] w-full overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
