import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-20 text-center">
      <p className="text-7xl font-extrabold text-primary-500">404</p>
      <h1 className="mt-4 text-xl font-bold">Looks like this event doesn&apos;t exist.</h1>
      <p className="mt-2 text-sm text-muted">The page you are looking for may have been moved or deleted.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
