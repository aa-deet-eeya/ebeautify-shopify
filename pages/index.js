import { Heading, Page, Button, ButtonGroup } from "@shopify/polaris";
import Link from "next/link";

const Index = () => (
  <Page>
    <Heading>Make your custom Emails using ebeautify</Heading>
    <ButtonGroup>
      <Link href="/editor">
        <Button>Goto Editor and start creating!!!!</Button>
      </Link>
    </ButtonGroup>
  </Page>
);

export default Index;
