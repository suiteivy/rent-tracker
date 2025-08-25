import React, { useState } from "react";

function formatCurrency(amount) {
  if (amount == null) return "-";
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  });
}

function PropertiesList({ properties, lease }) {
  // Group properties by location
  const seefarProperties = properties.filter(
    (p) => p.location?.toLowerCase() === "seefar"
  );
  const westsideProperties = properties.filter(
    (p) => p.location?.toLowerCase() === "westside"
  );

  // Dummy extra properties (demo)
  const extraProperties = [
    {
      id: "extra1",
      name: "Rosewood Villas",
      description: "Luxury villas with stunning gardens and pool.",
      location: "Seefar",
      type: "Residential",
      base_rent: 40000,
      max_rooms: 4,
    },
    {
      id: "extra2",
      name: "Westside Business Park",
      description: "Modern office spaces for startups and businesses.",
      location: "Westside",
      type: "Commercial",
      base_rent: 60000,
      max_rooms: 6,
    },
  ];

  const combinedSeefar = [...seefarProperties, extraProperties[0]];
  const combinedWestside = [...westsideProperties, extraProperties[1]];

  const typeColors = {
    Residential: "bg-blue-200 text-blue-800",
    Commercial: "bg-green-200 text-green-800",
    Industrial: "bg-yellow-200 text-yellow-800",
    MixedUse: "bg-purple-200 text-purple-800",
    Default: "bg-gray-200 text-gray-800",
  };

  function PropertyCard({ property }) {
    const [rooms, setRooms] = useState(1);
    const isLeased = lease?.property_id === property.id;
    const typeColorClass = typeColors[property.type] || typeColors.Default;

    const baseRent = property.base_rent ?? property.rent_amount ?? 0;
    const adjustedRent = baseRent * rooms;

    return (
      <div
        className={`rounded-2xl p-6 shadow-lg hover:shadow-2xl transition cursor-pointer bg-white border border-gray-300 flex flex-col justify-between min-w-[320px] mx-3`}
      >
        <h3 className="text-2xl font-semibold mb-1 text-center">{property.name}</h3>

        {/* Badge centered under name */}
        <div className="flex justify-center mb-4">
          <span
            className={`inline-block rounded-full px-4 py-1 font-bold text-sm tracking-wide ${
              isLeased ? "bg-crimson text-white" : "bg-green-600 text-white"
            }`}
          >
            {isLeased ? "Leased" : "Available"}
          </span>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed text-center max-w-xs mx-auto">
          {property.description || "No description provided."}
        </p>

        {/* Property Type Tag */}
        <div className="flex justify-center mb-3">
          <span
            className={`inline-block rounded-full px-4 py-1 font-semibold text-sm tracking-wide ${typeColorClass}`}
          >
            {property.type || "Residential"}
          </span>
        </div>

        <p className="text-sm font-semibold mb-3 text-center">
          <span className="uppercase tracking-wide">Rent: </span>
          <span className="text-crimson font-bold">{formatCurrency(adjustedRent)}</span>
        </p>

        {/* Rooms dropdown */}
        <div className="flex justify-center mb-5">
          <select
            className="px-6 py-3 border border-gray-300 rounded-md bg-white text-gray-800 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-crimson focus:border-crimson"
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            aria-label="Select number of rooms"
          >
            {[...Array(property.max_rooms || 7).keys()]
              .map((i) => i + 1)
              .map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Room" : "Rooms"}
                </option>
              ))}
          </select>
        </div>

        <button
          className="w-full bg-crimson text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
          type="button"
        >
          Add Property
        </button>
      </div>
    );
  }

  // Horizontal scroll container for properties side-by-side
  function PropertyRow({ title, properties }) {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-crimson">{title}</h2>
        {properties.length === 0 ? (
          <p className="italic text-gray-500 text-center">No properties available.</p>
        ) : (
          <div className="flex overflow-x-auto scrollbar-hide space-x-6 px-6 py-4">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mb-20">
      <PropertyRow title="Seefar Properties" properties={combinedSeefar} />
      <PropertyRow title="Westside Properties" properties={combinedWestside} />
    </section>
  );
}

export default PropertiesList;






