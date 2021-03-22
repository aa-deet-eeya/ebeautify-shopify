import { Heading, Page, Button } from "@shopify/polaris";
// import { Center, Stack, Image } from "@chakra-ui/react";
import React from "react";
// import ErrorImage from "../assets/notFound.svg";
import Navbar from "../components/Navbar";

const PageNotFound = () => {
  return (
    <Page>
      {/* <Image boxSize="35%" src={ErrorImage} alt="404" /> */}
      <Heading textAlign="center" as="h1" size="2xl">
        Page Not Found
      </Heading>
    </Page>
  );
};

export default PageNotFound;
