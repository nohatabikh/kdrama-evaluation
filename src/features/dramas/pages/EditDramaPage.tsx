import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import DramaForm from "../components/DramaForm";

function EditDramaPage() {
  const { id } = useParams();

  const drama = useAppSelector((state) =>
    state.dramas.items.find((drama) => drama.id === id),
  );

  if (!drama) {
    return (
      <div>
        <h1>Drama not found</h1>
        <Link to="/">Back to collection</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Drama</h1>
      <DramaForm initialDrama={drama} />
    </div>
  );
}

export default EditDramaPage;
