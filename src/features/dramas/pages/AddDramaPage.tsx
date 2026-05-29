import DramaForm from "../components/DramaForm";

function AddDramaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute left-[-120px] top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-140px] top-72 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        <section className="text-center">
          <h1 className="text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
            Add a New Drama
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Save the dramas you want to watch, track your progress, and keep
            your thoughts in one place.
          </p>
        </section>

        <DramaForm />
      </div>
    </main>
  );
}

export default AddDramaPage;
