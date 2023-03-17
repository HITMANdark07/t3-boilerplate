/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type FC } from "react";
import classNames from "classnames";

interface DotsLoaderProps {
  small?: boolean;
}
const DotsLoader: FC<DotsLoaderProps> = ({ small = false }) => {
  return (
    <div className="loading-dots">
      <div
        className={classNames("loading-dots--dot", {
          "loading-dots--dot-small": small,
        })}
      ></div>
      <div
        className={classNames("loading-dots--dot mx-1", {
          "loading-dots--dot-small": small,
        })}
      ></div>
      <div
        className={classNames("loading-dots--dot", {
          "loading-dots--dot-small": small,
        })}
      ></div>
    </div>
  );
};

export default DotsLoader;
