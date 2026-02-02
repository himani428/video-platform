export default function Player({ id }) {
  return (
    <video controls width="400">
      <source src={`http://localhost:5000/api/videos/stream/${id}`} />
    </video>
  );
}
