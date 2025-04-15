export default async function Task({ params }) {
  var { id } = await params;

  return (
    <div>
      <h1>Task {id}</h1>
      <p>Task details will be displayed here.</p>
    </div>
  );
}
