import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { singleDiamond } from "../pages/sketches/diamonds";
import U5Wrapper from "./U5Wrapper";
import routes from "@/routes";

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
const LogoImg = styled.img`
  height: 100px;
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

  // TODO: remove this after applying Tailwind for layout
  line-height: normal;

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

const links = routes
  .map(({ name, path, override }) => ({
    name,
    to: override ? override : path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const Home = () => {
  return (
    <Container>
      <Heading>
        <Sketch>
          <U5Wrapper sketch={singleDiamond} />
        </Sketch>
        <picture>
          <source
            srcSet="/dark-ucodia-logo.svg"
            media="(prefers-color-scheme: dark)"
          />
          <LogoImg src="/light-ucodia-logo.svg" alt="website logo" />
        </picture>
      </Heading>
      <List>
        {links.map(({ type, name, to }, index, items) => {
          const inc = Math.round(360 / items.length);
          const color = `hsl(${index * inc}, 80%, 60%)`;

          return (
            <PageLink color={color} key={name} to={to}>
              {name}
            </PageLink>
          );
        })}
      </List>
    </Container>
  );
};

export default Home;
