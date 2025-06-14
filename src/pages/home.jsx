import React from "react";
import { Link } from "react-router-dom";
import { singleDiamond } from "./sketches/diamonds";
import ExternalLink from "@/components/external-link";
import U5Wrapper from "@/components/u5-wrapper";
import routes from "@/routes";

const DEV_ONLY_ROUTES = ["manifest"];

const links = routes
  .filter(
    (route) => import.meta.env.DEV || !DEV_ONLY_ROUTES.includes(route.name)
  )
  .filter(({ path }) => !path.includes("fullscreen"))
  .map(({ ...args }) => ({
    ...args,
    to: args.override ? args.override : args.path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const Home = () => {
  return (
    <div className="py-12 sm:py-[50px]">
      <div className="flex flex-row items-center justify-center">
        <div className="mr-6 h-[100px] w-[100px] sm:mr-[50px] sm:h-[200px] sm:w-[200px]">
          <U5Wrapper sketch={singleDiamond} />
        </div>
        <img
          src="/ucodia-logo.svg"
          alt="website logo"
          className="h-[50px] w-[155px] sm:h-[100px] sm:w-[310px] dark:invert"
        />
      </div>
      <div className="my-12 sm:my-[50px] flex flex-col items-center justify-center">
        {links.map(({ name, to, element }, index, items) => {
          const inc = Math.round(360 / items.length);
          const color = `hsl(${index * inc},80%,60%)`;
            if (element?.type?.name === "ExternalRedirect") {
            return (
              <ExternalLink
                key={name}
                className="text-center text-4xl sm:text-6xl p-2 sm:p-4 no-underline"
                style={{ color: color }}
                href={to}
              >
                {name}
              </ExternalLink>
            );
          }
          return (
            <Link
              key={name}
              className="text-center text-4xl sm:text-6xl p-2 sm:p-4 no-underline"
              style={{ color: color }}
              to={to}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
