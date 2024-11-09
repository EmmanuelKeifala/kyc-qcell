export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mt-4 text-gray-600">
        You do not have permission to access this page.
      </p>
    </div>
  );
}
