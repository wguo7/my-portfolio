import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Will Guo.",
};

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title text-4xl sm:text-5xl">get in touch.</h1>
      <p className="max-w-[48ch] text-muted-foreground">
        Email works best:{" "}
        <a href="mailto:wguo4@uchicago.edu" className="fancy-link">
          wguo4@uchicago.edu
        </a>
        . Or use the form below.
      </p>

      <ContactForm />
    </article>
  );
}
