import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[80svh] flex-col justify-center pt-28">
      <p className="label text-muted">404</p>
      <h1 className="display wdth-118 mt-6 text-display-l text-silver">
        This signal
        <br />
        got lost<span className="text-lime">.</span>
      </h1>
      <p className="mt-6 max-w-[40ch] text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/start" variant="secondary" icon={false}>
          Start a project
        </ButtonLink>
      </div>
    </section>
  );
}
