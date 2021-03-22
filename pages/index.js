import { Heading, Page, Button } from "@shopify/polaris";
import Link from "next/link";

const Index = () => (
  <Page>
    <Heading>Shopify app with Node and React 🎉</Heading>
    <Link href="/404">
      <Button>Goto Somewhere</Button>
    </Link>
    <Link href="/editor">
      <Button>Goto Editor</Button>
    </Link>
  </Page>
);

export default Index;
