export default function HelpCenter() {
  return (
    <div className="container mx-auto py-20 px-4 mt-20">
      <h1 className="text-4xl font-bold font-nunito mb-8">Help Center</h1>
      <p className="font-montserrat text-lg text-gray-600">
        Welcome to the Petzy Help Center. How can we assist you today?
      </p>
      <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
        <p className="font-nunito font-semibold">Need immediate support?</p>
        <p className="font-montserrat text-gray-600">Email us at support@petzy.com</p>
      </div>
    </div>
  );
}
