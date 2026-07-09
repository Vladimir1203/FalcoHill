export default function FloorPlan() {
  return (
    <section id="floor-plan" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">Tipičan sprat</h2>
        <p className="text-lg text-slate-600 text-center mb-12 max-w-3xl mx-auto">
          Sve etaže objekta projektovane su sa identičnom strukturom stanova, što obezbeđuje
          konzistentan kvalitet i funkcionalnost na svakom spratu.
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-50 rounded-lg shadow-xl p-8">
            <img
              src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Floor plan"
              className="w-full rounded-lg"
            />
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-slate-600 text-center">
                Osnova tipičnog sprata sa raspoređenim stanovima različitih struktura
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
