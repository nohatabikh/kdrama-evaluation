import type { Drama } from "../types/drama.types";
import DramaCard from "./DramaCard";

type DramaListProps = {
  dramas: Drama[];
};

function DramaList({ dramas }: DramaListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {dramas.map((drama) => (
        <DramaCard key={drama.id} drama={drama} />
      ))}
    </div>
  );
}

export default DramaList;
