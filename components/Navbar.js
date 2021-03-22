import { Heading, Page, Button } from "@shopify/polaris";
import { GoThreeBars, GoLinkExternal } from "react-icons/go";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
// import Logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <Flex justifyContent="space-between" borderBottom="1px solid #fff" p={2}>
      <Link href="/">{/* <Image src={Logo} mt={2} /> */}</Link>
      <Flex>
        <Menu>
          <MenuButton
            ml={2}
            as={IconButton}
            aria-label="Options"
            icon={<GoThreeBars />}
            variant="outline"
          />
          <MenuList>
            <Text p={4} textAlign="center" fontSize="lg">
              Logged In as User
            </Text>
            <MenuItem icon={<GoLinkExternal />}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
