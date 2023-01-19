import React from "react";
import Link from "next/link";
import styled from "styled-components";
import UcodiaLogo from "../src/svg/ucodia-logo.svg";
import { singleDiamond } from "../src/pages/sketches/diamonds";

const links = [
  {
    type: "link",
    title: "about",
    url: "https://ucodia.notion.site/Who-is-Ucodia-15cd507c414146c098df52f557a1c1d5",
  },
  {
    type: "page",
    title: "circle-clock",
    url: "circle-clock",
  },
  {
    type: "page",
    title: "giphy-vox",
    url: "giphy-vox",
  },
].sort((a, b) => a.title.localeCompare(b.title));

const Container = styled.div`
  padding: 50px 0;
`;
const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Sketch = styled.div`
  margin-right: 50px;
  height: 200px;
  width: 200px;

  @media only screen and (max-width: 425px) {
    margin-right: 25px;
    height: 100px;
    width: 100px;
  }
`;
const Logo = styled(UcodiaLogo)`
  height: 100px;
  fill: #000000;

  @media (prefers-color-scheme: dark) {
    fill: #ededed;
  }

  @media only screen and (max-width: 425px) {
    height: 50px;
  }
`;
const List = styled.div`
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 3rem;
  @media only screen and (max-width: 425px) {
    font-size: 2rem;
  }
`;
const ExternalLink = styled.a`
  padding: 10px;
  text-decoration: none;
  color: ${(props) => props.color};
`;
const PageLink = styled(Link)`
  padding: 10px;
  text-decoration: none;
  color: ${(props) => props.color};
`;

export default function Home() {
  return (
    <Container>
      <Heading>
        {/* <Sketch>
          <P5Wrapper sketch={singleDiamond} />
        </Sketch> */}
        <Logo />
      </Heading>
      <List>
        {links.map(({ type, title, url }, index, items) => {
          const inc = Math.round(360 / items.length);
          const color = `hsl(${index * inc}, 80%, 60%)`;

          return type === "page" ? (
            <PageLink color={color} key={title} href={`/${url}`}>
              {title}
            </PageLink>
          ) : (
            <ExternalLink color={color} key={title} href={url} target="_blank">
              {title}
            </ExternalLink>
          );
        })}
      </List>
    </Container>
  );
}
