import DramaForm from "../components/DramaForm";

function AddDramaPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute -left-30 top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-35 top-72 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        <section className="mb-3 py-8 text-center md:py-12">
          <h1 className="mb-4 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-[2.75rem]">
            Add a New Drama
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Save the dramas you want to watch, track your progress, and keep
            your thoughts in one place.
          </p>
        </section>

        <DramaForm />
      </div>
    </div>
  );
}

export default AddDramaPage;
