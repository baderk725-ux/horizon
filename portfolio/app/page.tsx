import { Signal } from "@/components/sections/Signal";
import { Form } from "@/components/sections/Form";
import { Interface } from "@/components/sections/Interface";
import { Work } from "@/components/sections/Work";
import { System } from "@/components/sections/System";
import { Beyond } from "@/components/sections/Beyond";
import { jsonLd, personLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personLd()) }} />
      <Signal />
      <Form />
      <Interface />
      <Work />
      <System />
      <Beyond />
    </>
  );
}
